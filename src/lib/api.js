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

export const api = {
  // 1. AUTHENTICATION
  auth: {
    async register(name, email, password, phone = '') {
      if (isSupabaseConfigured) {
        // Generate unique Indian File ID
        const currentYear = new Date().getFullYear();
        const randNum = Math.floor(10000 + Math.random() * 90000);
        const fileNo = `IRA-${currentYear}-${randNum}`;

        const { data, error } = await supabase
          .from('users')
          .insert([
            {
              name: name.trim(),
              email: email.toLowerCase().trim(),
              password: password,
              phone: phone.trim(),
              file_no: fileNo,
              status: 'Profile Created'
            }
          ])
          .select()
          .single();

        if (error) throw new Error(error.message);
        return { success: true, user: data, token: String(data.id) };
      } else {
        return localFetch('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name, email, password, phone })
        });
      }
    },

    async login(email, password) {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('users')
          .select('id, email, name, phone, file_no, status, password')
          .eq('email', email.toLowerCase().trim())
          .single();

        if (error || !data || data.password !== password) {
          throw new Error('Invalid email or password.');
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
          country: formData.country || 'India',
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
          tax_year: data.taxYear || 'AY 2025-26',
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
        return { data: data || [] };
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
          .update({ fee_paid: 1, status: 'Fee Paid via UPI / In Queue for E-Filing' })
          .eq('user_id', userId);

        if (error) throw new Error(error.message);
        return { success: true };
      } else {
        return localFetch('/api/tax-summary/pay-fee', { method: 'POST' }, token);
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
  }
};
