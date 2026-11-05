import { supabase, isSupabaseConfigured } from './supabase';

/* ========================================================
   UNIVERSAL API CLIENT (Supabase Cloud + Local SQLite Fallback)
   ======================================================== */

// Helper to make local fetch requests with auth header
const localFetch = async (endpoint, options = {}, token = '') => {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const res = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `HTTP error! status: ${res.status}`);
  }
  return data;
};

// Cryptographic Password Hashing (SHA-256 via Web Crypto)
const hashPassword = async (plainText) => {
  if (!plainText) return '';
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    return plainText;
  }
  try {
    const enc = new TextEncoder();
    const buf = await window.crypto.subtle.digest('SHA-256', enc.encode(plainText));
    const arr = Array.from(new Uint8Array(buf));
    return arr.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return plainText;
  }
};

export const api = {
  // 1. AUTHENTICATION
  auth: {
    async register(name, email, password, phone = '', referName = '') {
      if (isSupabaseConfigured) {
        // Generate unique US Tax Filing Client ID
        const currentYear = new Date().getFullYear();
        const randNum = Math.floor(10000 + Math.random() * 90000);
        const fileNo = `IRA-${currentYear}-${randNum}`;

        const hashedPassword = await hashPassword(password);

        const basePayload = {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          phone: phone ? phone.trim() : '',
          file_no: fileNo,
          status: 'Profile Created'
        };

        let userRecord = null;
        let lastError = null;

        // Try inserting with refer_name first if provided
        if (referName && referName.trim()) {
          const { data, error } = await supabase
            .from('users')
            .insert([{ ...basePayload, refer_name: referName.trim() }])
            .select()
            .single();

          if (!error && data) {
            userRecord = data;
          } else {
            console.warn('Notice: refer_name column not in Supabase schema cache yet. Gracefully falling back to base user profile:', error?.message);
            lastError = error;
          }
        }

        // If insert failed because refer_name column does not exist or wasn't provided, insert base payload
        if (!userRecord) {
          const { data, error } = await supabase
            .from('users')
            .insert([basePayload])
            .select()
            .single();

          if (error) throw new Error(error.message);
          userRecord = data;
        }

        // Preserve refer_name on the in-memory user object and local storage
        if (referName && referName.trim() && userRecord) {
          userRecord.refer_name = referName.trim();
          try {
            localStorage.setItem(`ira_referral_${userRecord.id}`, referName.trim());
          } catch (e) {
            // ignore localStorage quota error
          }
        }

        return { success: true, user: userRecord, token: String(userRecord.id) };
      } else {
        return localFetch('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ 
            name, 
            email, 
            password, 
            phone,
            refer_name: referName 
          })
        });
      }
    },

    async login(email, password) {
      if (isSupabaseConfigured) {
        const cleanEmail = email.toLowerCase().trim();
        const { data, error } = await supabase
          .from('users')
          .select('id, email, name, phone, file_no, status, password')
          .eq('email', cleanEmail)
          .single();

        if (error || !data) {
          throw new Error('Invalid email or password.');
        }

        const hashedPassword = await hashPassword(password);
        const isMatch = (data.password === hashedPassword) || (data.password === password);

        if (!isMatch) {
          throw new Error('Invalid email or password.');
        }

        // Auto-upgrade legacy plaintext password to secure SHA-256 hash
        if (data.password === password && hashedPassword !== password) {
          try {
            await supabase
              .from('users')
              .update({ password: hashedPassword })
              .eq('id', data.id);
          } catch (e) {
            console.warn('Password upgrade note:', e);
          }
        }

        const { password: _, ...userSafe } = data;
        return { success: true, user: userSafe, token: String(data.id) };
      } else {
        return localFetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
      }
    },

    async getMe(token) {
      if (!token) return { user: null };
      if (isSupabaseConfigured) {
        const userId = parseInt(token, 10);
        const { data, error } = await supabase
          .from('users')
          .select('id, email, name, phone, file_no, status')
          .eq('id', userId)
          .single();

        if (error || !data) throw new Error('User not found.');
        return { user: data };
      } else {
        return localFetch('/api/auth/me', {}, token);
      }
    }
  },

  // 2. TAXPAYER INFO
  taxpayer: {
    async get(token) {
      if (isSupabaseConfigured) {
        const userId = parseInt(token, 10);
        const { data } = await supabase
          .from('taxpayer_info')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        return { data: data || null };
      } else {
        return localFetch('/api/taxpayer', {}, token);
      }
    },

    async save(formData, token) {
      if (isSupabaseConfigured) {
        const userId = parseInt(token, 10);
        const row = {
          user_id: userId,
          first_name: formData.firstName || '',
          middle_name: formData.middleName || '',
          last_name: formData.lastName || '',
          gender: formData.gender || '',
          ssn_itin: formData.ssnItin || '',
          dob: formData.dob || '',
          employer: formData.employer || '',
          occupation: formData.occupation || '',
          visa_type: formData.visaType || '',
          contact_number: formData.contactNumber || '',
          alternate_number: formData.alternateNumber || '',
          time_zone: formData.timeZone || '',
          citizenship: formData.citizenship || '',
          own_home: formData.ownHome || '',
          filing_status: formData.filingStatus || '',
          email: formData.email || '',
          street_address: formData.streetAddress || '',
          city: formData.city || '',
          country: formData.country || 'United States',
          state: formData.state || '',
          zip_code: formData.zipCode || '',
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('taxpayer_info')
          .upsert([row], { onConflict: 'user_id' });

        if (error) throw new Error(error.message);
        return { success: true };
      } else {
        return localFetch('/api/taxpayer', {
          method: 'POST',
          body: JSON.stringify(formData)
        }, token);
      }
    }
  },

  // 3. SPOUSE INFO
  spouse: {
    async get(token) {
      if (isSupabaseConfigured) {
        const userId = parseInt(token, 10);
        const { data } = await supabase
          .from('spouse_info')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        return { data: data || null };
      } else {
        return localFetch('/api/spouse', {}, token);
      }
    },

    async save(formData, token) {
      if (isSupabaseConfigured) {
        const userId = parseInt(token, 10);
        const row = {
          user_id: userId,
          has_spouse: formData.hasSpouse || 'yes',
          first_name: formData.firstName || '',
          middle_name: formData.middleName || '',
          last_name: formData.lastName || '',
          gender: formData.gender || '',
          dob: formData.dob || '',
          occupation: formData.occupation || '',
          visa_type: formData.visaType || '',
          tax_id_type: formData.taxIdType || '',
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('spouse_info')
          .upsert([row], { onConflict: 'user_id' });

        if (error) throw new Error(error.message);
        return { success: true };
      } else {
        return localFetch('/api/spouse', {
          method: 'POST',
          body: JSON.stringify(formData)
        }, token);
      }
    }
  },

  // 4. DEPENDENTS
  dependents: {
    async get(token) {
      if (isSupabaseConfigured) {
        const userId = parseInt(token, 10);
        const { data, error } = await supabase
          .from('dependents')
          .select('*')
          .eq('user_id', userId)
          .order('id', { ascending: true });

        if (error) throw new Error(error.message);
        return { data: data || [] };
      } else {
        return localFetch('/api/dependents', {}, token);
      }
    },

    async save(dependentsList, token) {
      if (isSupabaseConfigured) {
        const userId = parseInt(token, 10);
        // Clear and replace for simple array sync
        await supabase.from('dependents').delete().eq('user_id', userId);

        if (dependentsList && dependentsList.length > 0) {
          const rows = dependentsList.map(d => ({
            user_id: userId,
            first_name: d.firstName || '',
            middle_name: d.middleName || '',
            last_name: d.lastName || '',
            gender: d.gender || '',
            dob: d.dob || '',
            relationship: d.relationship || '',
            visa_type: d.visaType || '',
            tax_id_type: d.taxIdType || '',
            days_2025: d.days2025 || '',
            days_2024: d.days2024 || '',
            days_2023: d.days2023 || ''
          }));

          const { error } = await supabase.from('dependents').insert(rows);
          if (error) throw new Error(error.message);
        }
        return { success: true };
      } else {
        return localFetch('/api/dependents', {
          method: 'POST',
          body: JSON.stringify({ dependents: dependentsList })
        }, token);
      }
    }
  },

  // 5. SCHEDULE & NOTES
  schedule: {
    async get(token) {
      if (isSupabaseConfigured) {
        const userId = parseInt(token, 10);
        const { data } = await supabase
          .from('schedule_notes')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        return { data: data || null };
      } else {
        return localFetch('/api/schedule', {}, token);
      }
    },

    async save(data, token) {
      if (isSupabaseConfigured) {
        const userId = parseInt(token, 10);
        const row = {
          user_id: userId,
          tax_year: data.taxYear || 'AY 2026-27',
          preferred_date: data.preferredDate || '',
          preferred_time: data.preferredTime || '',
          notes: data.notes || '',
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('schedule_notes')
          .upsert([row], { onConflict: 'user_id' });

        if (error) throw new Error(error.message);
        return { success: true };
      } else {
        return localFetch('/api/schedule', {
          method: 'POST',
          body: JSON.stringify(data)
        }, token);
      }
    }
  },

  // 6. ADDRESS
  address: {
    async get(token) {
      if (isSupabaseConfigured) {
        const userId = parseInt(token, 10);
        const { data } = await supabase
          .from('address_history')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        return { data: data || null };
      } else {
        return localFetch('/api/address', {}, token);
      }
    },

    async save(payload, token) {
      if (isSupabaseConfigured) {
        const userId = parseInt(token, 10);
        const { addressData, movedDuringYear } = payload;
        const row = {
          user_id: userId,
          moved_during_year: movedDuringYear || 'no',
          primary_street: addressData.primaryStreet || '',
          primary_city: addressData.primaryCity || '',
          primary_state: addressData.primaryState || '',
          primary_zip: addressData.primaryZip || '',
          primary_start: addressData.primaryStartDate || '',
          primary_end: addressData.primaryEndDate || '',
          second_street: addressData.secondStreet || '',
          second_city: addressData.secondCity || '',
          second_state: addressData.secondState || '',
          second_zip: addressData.secondZip || '',
          second_start: addressData.secondStartDate || '',
          second_end: addressData.secondEndDate || '',
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('address_history')
          .upsert([row], { onConflict: 'user_id' });

        if (error) throw new Error(error.message);
        return { success: true };
      } else {
        return localFetch('/api/address', {
          method: 'POST',
          body: JSON.stringify(payload)
        }, token);
      }
    }
  },

  // 7. TAX DOCUMENTS & UPLOADS
  documents: {
    async list(token) {
      if (isSupabaseConfigured) {
        const userId = parseInt(token, 10);
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', userId)
          .order('id', { ascending: false });

        if (error) throw new Error(error.message);

        // Merge with validation cache
        const valCache = (() => {
          try {
            const raw = localStorage.getItem('ira_doc_validations_v1');
            return raw ? JSON.parse(raw) : {};
          } catch { return {}; }
        })();

        const mapped = (data || []).map(d => {
          const val = valCache[d.id] || {};
          const vs = d.validation_status || val.validation_status || 'pending';
          const rr = d.rejection_reason || val.rejection_reason || null;
          return {
            ...d,
            validation_status: vs,
            rejection_reason: rr,
            status: vs === 'approved' 
              ? 'Verified & Approved' 
              : vs === 'rejected' 
                ? 'Action Required / Re-upload Requested' 
                : 'Uploaded - Ready for Preparer Review'
          };
        });

        return { data: mapped };
      } else {
        return localFetch('/api/documents', {}, token);
      }
    },

    async upload(docRows, token) {
      if (isSupabaseConfigured) {
        const userId = parseInt(token, 10);
        const uploadedRecords = [];

        for (const row of docRows) {
          if (!row.file || !row.docType) continue;

          const fileExt = row.file.name.split('.').pop();
          const cleanName = `${userId}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `${userId}/${cleanName}`;

          // Upload to Supabase Storage bucket 'tax-documents'
          const { error: uploadError } = await supabase.storage
            .from('tax-documents')
            .upload(filePath, row.file, { upsert: true });

          if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

          // Get Public URL
          const { data: urlData } = supabase.storage
            .from('tax-documents')
            .getPublicUrl(filePath);

          const sizeStr = `${(row.file.size / 1024).toFixed(1)} KB`;

          // Insert metadata row
          const { data: docRecord, error: dbError } = await supabase
            .from('documents')
            .insert([
              {
                user_id: userId,
                doc_type: row.docType,
                original_name: row.file.name,
                stored_name: filePath,
                file_url: urlData?.publicUrl || '',
                file_size: sizeStr
              }
            ])
            .select()
            .single();

          if (dbError) throw new Error(dbError.message);
          uploadedRecords.push(docRecord);
        }

        return { success: true, count: uploadedRecords.length };
      } else {
        const formData = new FormData();
        docRows.forEach(r => {
          if (r.file && r.docType) {
            formData.append('files', r.file);
            formData.append('docTypes', r.docType);
          }
        });

        const res = await fetch('/api/documents/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Failed to upload document.');
        return data;
      }
    },

    async delete(id, token) {
      if (isSupabaseConfigured) {
        const userId = parseInt(token, 10);
        // Find document stored path
        const { data: doc } = await supabase
          .from('documents')
          .select('stored_name')
          .eq('id', id)
          .eq('user_id', userId)
          .single();

        if (doc && doc.stored_name) {
          await supabase.storage.from('tax-documents').remove([doc.stored_name]);
        }

        const { error } = await supabase
          .from('documents')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);

        if (error) throw new Error(error.message);
        return { success: true };
      } else {
        return localFetch(`/api/documents/${id}`, { method: 'DELETE' }, token);
      }
    }
  },

  // 8. TAX SUMMARY & RETURNS
  summary: {
    async get(token) {
      if (isSupabaseConfigured) {
        const userId = parseInt(token, 10);
        const { data } = await supabase
          .from('tax_summaries')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        return { data: data || null };
      } else {
        return localFetch('/api/tax-summary', {}, token);
      }
    },

    async payFee(token) {
      if (isSupabaseConfigured) {
        const userId = parseInt(token, 10);
        const { error } = await supabase
          .from('tax_summaries')
          .update({ fee_paid: 1, status: 'Fee Paid / In Queue for E-Filing' })
          .eq('user_id', userId);

        if (error) throw new Error(error.message);
        return { success: true };
      } else {
        return localFetch('/api/tax-summary/pay-fee', { method: 'POST' }, token);
      }
    }
  },

  // 9.5 WISE PAYMENT & PREPARATION FEE ($70) - HYBRID INTAKE & E-FILE
  payment: {
    async getInvoice(token) {
      if (isSupabaseConfigured) {
        const userId = parseInt(token, 10);
        const { data, error } = await supabase
          .from('tax_summaries')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) console.warn('Supabase invoice lookup:', error.message);

        // Check if user has uploaded any tax documents
        const { count: docsCount } = await supabase
          .from('documents')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        const hasDocuments = Boolean(docsCount && docsCount > 0);
        const hasDraftSummary = Boolean(data && (data.agi || data.taxable_income || data.estimated_refund));
        const feePaid = Boolean(data?.fee_paid);

        const parsedFee = data?.preparer_fee ? parseFloat(String(data.preparer_fee).replace(/[^0-9.]/g, '')) : 0;
        const totalAmount = (parsedFee && parsedFee > 0) ? parsedFee : 70.00;
        const federalFee = (parsedFee && parsedFee > 0) ? Math.max(0, parsedFee - 20) : 50.00;
        const stateFee = (parsedFee && parsedFee > 0) ? Math.min(parsedFee, 20.00) : 20.00;

        return {
          success: true,
          data: {
            user_id: userId,
            amount: totalAmount,
            federal_fee: federalFee,
            state_fee: stateFee,
            currency: 'USD',
            fee_paid: feePaid,
            has_documents: hasDocuments,
            docs_count: docsCount || 0,
            has_draft_summary: hasDraftSummary,
            is_upfront_retainer: Boolean(feePaid && !hasDraftSummary),
            status: data?.status || (feePaid ? (hasDocuments ? 'Fee Paid / In Queue for E-Filing' : 'Fee Pre-Paid / Priority Intake Queue') : 'Payment Due'),
            tax_year: data?.tax_year || '2025'
          }
        };
      } else {
        return {
          success: true,
          data: {
            amount: 70.00,
            federal_fee: 50.00,
            state_fee: 20.00,
            currency: 'USD',
            fee_paid: false,
            has_documents: false,
            docs_count: 0,
            has_draft_summary: false,
            is_upfront_retainer: false,
            status: 'Payment Due',
            tax_year: '2025'
          }
        };
      }
    },

    async processWisePayment(paymentDetails, token) {
      if (isSupabaseConfigured) {
        const userId = parseInt(token, 10);
        const txnId = paymentDetails?.txnId || `WISE-TXN-${Date.now()}`;

        // Check documents existence to determine if it's an upfront retainer or e-filing authorization
        const { count: docsCount } = await supabase
          .from('documents')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        const hasDocs = Boolean(docsCount && docsCount > 0);
        const targetStatus = hasDocs 
          ? 'Fee Paid / In Queue for E-Filing' 
          : 'Fee Pre-Paid / Priority Intake Queue';
        const feeLabel = hasDocs 
          ? '$70.00 USD (Paid via Wise - E-File Authorized)' 
          : '$70.00 USD (Pre-Paid Retainer via Wise)';

        // 1. Check if tax_summaries row exists
        const { data: existing } = await supabase
          .from('tax_summaries')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('tax_summaries')
            .update({
              fee_paid: 1,
              preparer_fee: feeLabel,
              status: targetStatus
            })
            .eq('user_id', userId);
        } else {
          await supabase
            .from('tax_summaries')
            .insert([{
              user_id: userId,
              fee_paid: 1,
              preparer_fee: feeLabel,
              status: targetStatus,
              tax_year: '2025'
            }]);
        }

        // 2. Update user status in users table
        await supabase
          .from('users')
          .update({
            status: targetStatus
          })
          .eq('id', userId);

        return {
          success: true,
          txnId,
          amount: 70.00,
          currency: 'USD',
          method: paymentDetails?.method || 'ach',
          targetStatus,
          message: hasDocs 
            ? 'Wise payment cleared and authorized for electronic IRS transmission.'
            : 'Wise retainer fee cleared! Your account is queued for priority return preparation.'
        };
      } else {
        return {
          success: true,
          txnId: paymentDetails?.txnId || `WISE-LOCAL-${Date.now()}`,
          amount: 70.00,
          currency: 'USD',
          method: paymentDetails?.method || 'ach'
        };
      }
    }
  },

  returns: {
    async list(token) {
      if (isSupabaseConfigured) {
        const userId = parseInt(token, 10);
        const { data, error } = await supabase
          .from('tax_returns')
          .select('*')
          .eq('user_id', userId)
          .order('id', { ascending: false });

        if (error) throw new Error(error.message);
        return { data: data || [] };
      } else {
        return localFetch('/api/tax-returns', {}, token);
      }
    }
  },

  // 10. ADMIN & DOCUMENT VALIDATION
  admin: {
    async listClients(token) {
      return localFetch('/api/admin/clients', {}, token);
    },
    async getClientDossier(id, token) {
      return localFetch(`/api/admin/clients/${id}`, {}, token);
    },
    async validateDocument(docId, validation_status, rejection_reason, token) {
      return localFetch(`/api/admin/documents/${docId}/validate`, {
        method: 'PATCH',
        body: JSON.stringify({ validation_status, rejection_reason })
      }, token);
    },
    async updateClientStatus(id, status, token) {
      return localFetch(`/api/admin/clients/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }, token);
    },
    async addNote(id, note, note_type, token) {
      return localFetch(`/api/admin/clients/${id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ note, note_type })
      }, token);
    },
    async getNotes(id, token) {
      return localFetch(`/api/admin/clients/${id}/notes`, {}, token);
    },
    async saveTaxSummary(id, summaryData, token) {
      return localFetch(`/api/admin/clients/${id}/tax-summary`, {
        method: 'POST',
        body: JSON.stringify(summaryData)
      }, token);
    }
  }
};
