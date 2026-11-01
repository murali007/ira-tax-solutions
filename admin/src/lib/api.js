import { supabase, isSupabaseConfigured } from '../../../src/lib/supabase';

export const API_BASE = import.meta.env.VITE_API_URL || '';

// Universal local fetch client with auth bearer token
const localFetch = async (endpoint, options = {}, token = '') => {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const res = await fetch(url, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `HTTP error! status: ${res.status}`);
  }
  return data;
};

/* ========================================================
   LOCAL STORAGE DATABASE FOR VERCEL DEPLOYMENTS
   ======================================================== */
const DB_STORAGE_KEY = 'ira_admin_dossiers_v2';

const INITIAL_CLIENTS = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+1 (408) 555-0192',
    file_no: 'IRA-2026-94821',
    status: 'Documents Uploaded',
    employer: 'Microsoft Corporation',
    filing_status: 'Married Filing Jointly',
    visa_type: 'H-1B Specialty Occupation',
    created_at: '2026-02-14 09:30:00',
    taxpayer: {
      first_name: 'Rahul',
      middle_name: '',
      last_name: 'Sharma',
      gender: 'male',
      ssn_itin: '987-65-4321',
      dob: '1988-06-14',
      employer: 'Microsoft Corporation',
      occupation: 'Principal Software Engineer',
      visa_type: 'H-1B',
      contact_number: '+1 (408) 555-0192',
      alternate_number: '+1 (408) 555-9988',
      time_zone: 'PST (Pacific Standard Time)',
      citizenship: 'Indian',
      own_home: 'yes',
      filing_status: 'Married Filing Jointly',
      email: 'rahul.sharma@example.com',
      street_address: '1 Microsoft Way, Building 92',
      city: 'Redmond',
      state: 'WA',
      zip_code: '98052',
      country: 'United States'
    },
    spouse: {
      has_spouse: 'yes',
      first_name: 'Ananya',
      middle_name: '',
      last_name: 'Sharma',
      gender: 'female',
      dob: '1990-09-22',
      occupation: 'Senior UX Designer',
      visa_type: 'H-4 EAD',
      tax_id_type: 'ssn'
    },
    dependents: [
      {
        id: 101,
        first_name: 'Aarav',
        middle_name: '',
        last_name: 'Sharma',
        gender: 'male',
        dob: '2020-04-12',
        relationship: 'Child / Son',
        visa_type: 'US Citizen',
        tax_id_type: 'ssn',
        days_2025: '365',
        days_2024: '365',
        days_2023: '365'
      }
    ],
    address: {
      moved_during_year: 'no',
      primary_street: '742 Evergreen Terrace Apt 4B',
      primary_city: 'Bellevue',
      primary_state: 'WA',
      primary_zip: '98004',
      primary_start: '2022-01-01',
      primary_end: '2025-12-31'
    },
    schedule: {
      tax_year: 'AY 2026-27 (TY 2025)',
      preferred_date: '2026-03-15',
      preferred_time: '18:00 EST',
      notes: 'Sold RSU shares in Q3 with Morgan Stanley. Need Foreign Bank Account (FBAR) filing for NRE/NRO accounts in India.'
    },
    documents: [
      {
        id: 1001,
        user_id: 1,
        doc_type: 'Form W-2 (Wage and Tax Statement)',
        file_name: 'Rahul_W2_Microsoft_2025.pdf',
        file_size: '245 KB',
        validation_status: 'approved',
        rejection_reason: null,
        status: 'Verified & Approved',
        verified_by: 'Master Tax Admin',
        created_at: '2026-02-15 10:20:00'
      },
      {
        id: 1002,
        user_id: 1,
        doc_type: 'Form 1099-INT (Interest Income)',
        file_name: 'Chase_1099_INT_Interest.pdf',
        file_size: '128 KB',
        validation_status: 'pending',
        rejection_reason: null,
        status: 'Uploaded - Ready for Preparer Review',
        created_at: '2026-02-16 14:10:00'
      },
      {
        id: 1003,
        user_id: 1,
        doc_type: 'Form 1099-B (Brokerage / Capital Gains)',
        file_name: 'MorganStanley_1099B_RSU.pdf',
        file_size: '512 KB',
        validation_status: 'pending',
        rejection_reason: null,
        status: 'Uploaded - Ready for Preparer Review',
        created_at: '2026-02-18 09:30:00'
      }
    ],
    taxSummary: {
      tax_year: '2025',
      adjusted_gross_income: 215400,
      federal_tax_due: 0,
      federal_refund: 4280,
      state_tax_due: 0,
      state_refund: 0,
      fee_paid: 1,
      status: 'Ready for Review'
    },
    reviewerNotes: [
      {
        id: 1,
        user_id: 1,
        author_name: 'Master Tax Admin',
        note: 'Verified Box 1 wages and Box 2 withholding against Microsoft payroll portal. State withholding matches WA state zero tax rules.',
        note_type: 'compliance',
        created_at: '2026-02-20 11:15:00'
      }
    ]
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya.patel@amazon.com',
    phone: '+1 (206) 555-8812',
    file_no: 'IRA-2026-47319',
    status: 'Documents Verified',
    employer: 'Amazon.com Services LLC',
    filing_status: 'Single',
    visa_type: 'L-1 Intra-Company Transferee',
    created_at: '2026-02-12 11:15:00',
    taxpayer: {
      first_name: 'Priya',
      middle_name: 'K',
      last_name: 'Patel',
      gender: 'female',
      ssn_itin: '987-12-3456',
      dob: '1992-04-18',
      employer: 'Amazon.com Services LLC',
      occupation: 'Senior Data Scientist',
      visa_type: 'L-1',
      contact_number: '+1 (206) 555-8812',
      alternate_number: '',
      time_zone: 'PST',
      citizenship: 'Indian',
      own_home: 'yes',
      filing_status: 'Single',
      email: 'priya.patel@amazon.com',
      street_address: '410 Terry Ave N',
      city: 'Seattle',
      state: 'WA',
      zip_code: '98109',
      country: 'United States'
    },
    spouse: { has_spouse: 'no' },
    dependents: [],
    address: {
      moved_during_year: 'no',
      primary_street: '1200 4th Ave Apt 1802',
      primary_city: 'Seattle',
      primary_state: 'WA',
      primary_zip: '98101',
      primary_start: '2023-01-01',
      primary_end: '2025-12-31'
    },
    schedule: {
      tax_year: 'AY 2026-27 (TY 2025)',
      preferred_date: '2026-03-20',
      preferred_time: '14:00 PST',
      notes: 'Eligible for substantial presence test. First year filing full 1040.'
    },
    documents: [
      {
        id: 2001,
        user_id: 2,
        doc_type: 'Form W-2 (Wage and Tax Statement)',
        file_name: 'Priya_Amazon_W2_2025.pdf',
        file_size: '195 KB',
        validation_status: 'approved',
        rejection_reason: null,
        status: 'Verified & Approved',
        verified_by: 'Master Tax Admin',
        created_at: '2026-02-14 16:20:00'
      },
      {
        id: 2002,
        user_id: 2,
        doc_type: 'Form 1098 (Mortgage Interest Statement)',
        file_name: 'WellsFargo_Form1098_Mortgage.pdf',
        file_size: '160 KB',
        validation_status: 'approved',
        rejection_reason: null,
        status: 'Verified & Approved',
        verified_by: 'Master Tax Admin',
        created_at: '2026-02-14 16:30:00'
      }
    ],
    taxSummary: {
      tax_year: '2025',
      adjusted_gross_income: 172000,
      federal_tax_due: 0,
      federal_refund: 2850,
      state_tax_due: 0,
      state_refund: 0,
      fee_paid: 1,
      status: 'Documents Verified'
    },
    reviewerNotes: [
      {
        id: 2,
        user_id: 2,
        author_name: 'Master Tax Admin',
        note: 'All mortgage deductions in Form 1098 validated. Substantial presence confirmed.',
        note_type: 'audit',
        created_at: '2026-02-16 10:00:00'
      }
    ]
  },
  {
    id: 3,
    name: 'Karthik Reddy',
    email: 'karthik.reddy@gmail.com',
    phone: '+1 (650) 555-4321',
    file_no: 'IRA-2026-12845',
    status: 'Action Required (Docs)',
    employer: 'Google LLC',
    filing_status: 'Single',
    visa_type: 'H-1B Specialty Occupation',
    created_at: '2026-02-10 14:00:00',
    taxpayer: {
      first_name: 'Karthik',
      middle_name: '',
      last_name: 'Reddy',
      gender: 'male',
      ssn_itin: '987-77-8899',
      dob: '1991-11-05',
      employer: 'Google LLC',
      occupation: 'Staff Software Engineer',
      visa_type: 'H-1B',
      contact_number: '+1 (650) 555-4321',
      alternate_number: '',
      time_zone: 'PST',
      citizenship: 'Indian',
      own_home: 'no',
      filing_status: 'Single',
      email: 'karthik.reddy@gmail.com',
      street_address: '1600 Amphitheatre Pkwy',
      city: 'Mountain View',
      state: 'CA',
      zip_code: '94043',
      country: 'United States'
    },
    spouse: { has_spouse: 'no' },
    dependents: [],
    address: {
      moved_during_year: 'yes',
      primary_street: '800 E Middlefield Rd',
      primary_city: 'Mountain View',
      primary_state: 'CA',
      primary_zip: '94043',
      primary_start: '2025-06-01',
      primary_end: '2025-12-31',
      second_street: '2200 Mission College Blvd',
      second_city: 'Santa Clara',
      second_state: 'CA',
      second_zip: '95054',
      second_start: '2025-01-01',
      second_end: '2025-05-31'
    },
    schedule: {
      tax_year: 'AY 2026-27 (TY 2025)',
      preferred_date: '2026-03-25',
      preferred_time: '19:00 PST',
      notes: 'Part-year CA tax allocation needed due to Santa Clara to Mountain View apartment move.'
    },
    documents: [
      {
        id: 3001,
        user_id: 3,
        doc_type: 'Form W-2 (Wage and Tax Statement)',
        file_name: 'Karthik_Google_W2.pdf',
        file_size: '220 KB',
        validation_status: 'approved',
        rejection_reason: null,
        status: 'Verified & Approved',
        verified_by: 'Master Tax Admin',
        created_at: '2026-02-11 10:15:00'
      },
      {
        id: 3002,
        user_id: 3,
        doc_type: 'Form 1099-DIV (Dividends and Distributions)',
        file_name: 'CharlesSchwab_1099DIV.jpg',
        file_size: '185 KB',
        validation_status: 'rejected',
        rejection_reason: 'Missing Page 2. Box 7 (Foreign Tax Paid) and Box 1a total ordinary dividends are cut off in photo scan. Please upload full PDF statement.',
        status: 'Action Required / Re-upload Requested',
        verified_by: 'Master Tax Admin',
        created_at: '2026-02-11 10:20:00'
      }
    ],
    taxSummary: {
      tax_year: '2025',
      adjusted_gross_income: 260000,
      federal_tax_due: 0,
      federal_refund: 1850,
      state_tax_due: 620,
      state_refund: 0,
      fee_paid: 1,
      status: 'Action Required (Docs)'
    },
    reviewerNotes: [
      {
        id: 3,
        user_id: 3,
        author_name: 'Master Tax Admin',
        note: 'Rejected Form 1099-DIV due to missing foreign tax credit page. Client notified via automated email alert.',
        note_type: 'correction',
        created_at: '2026-02-12 15:40:00'
      }
    ]
  }
];

function getLocalStore() {
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(INITIAL_CLIENTS));
      return INITIAL_CLIENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CLIENTS;
  }
}

function saveLocalStore(clients) {
  try {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(clients));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

/* ========================================================
   ADMIN API CLIENT (Cloud Vercel + Local + Supabase)
   ======================================================== */
export const api = {
  auth: {
    async login(email, password) {
      const cleanEmail = (email || '').toLowerCase().trim();
      const cleanPass = (password || '').trim();

      // Master Preparer Credentials for Administrative Access
      if (cleanEmail === 'admin@irataxsolutions.com' && cleanPass === 'admin123') {
        const adminUser = {
          id: 1,
          name: 'IRA Master Tax Preparer',
          email: 'admin@irataxsolutions.com',
          role: 'admin',
          phone: '+1 (800) 829-1040',
          file_no: 'ADMIN-001',
          status: 'Active'
        };
        return {
          success: true,
          user: adminUser,
          token: 'ira_admin_master_session'
        };
      }

      // If Supabase is connected, check cloud database
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('id, email, name, phone, file_no, status, role, password')
            .eq('email', cleanEmail)
            .single();

          if (!error && data && data.password === cleanPass && data.role === 'admin') {
            const { password: _, ...userSafe } = data;
            return { success: true, user: userSafe, token: String(data.id) };
          }
        } catch {
          // fallback to localFetch below
        }
      }

      // If an external backend is configured via VITE_API_URL
      if (API_BASE) {
        return localFetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: cleanEmail, password: cleanPass })
        });
      }

      throw new Error('Invalid administrative credentials. Please verify your Staff Email and Security Password.');
    },

    async getMe(token) {
      if (!token) return { user: null };

      // Master Admin session
      if (token === 'ira_admin_master_session' || token.includes('admin')) {
        return {
          user: {
            id: 1,
            name: 'IRA Master Tax Preparer',
            email: 'admin@irataxsolutions.com',
            role: 'admin',
            phone: '+1 (800) 829-1040',
            file_no: 'ADMIN-001',
            status: 'Active'
          }
        };
      }

      if (isSupabaseConfigured) {
        try {
          const userId = parseInt(token, 10);
          if (!isNaN(userId)) {
            const { data, error } = await supabase
              .from('users')
              .select('id, email, name, phone, file_no, status, role')
              .eq('id', userId)
              .single();

            if (!error && data && data.role === 'admin') {
              return { user: data };
            }
          }
        } catch {
          // fallback below
        }
      }

      if (API_BASE) {
        return localFetch('/api/auth/me', {}, token);
      }

      return {
        user: {
          id: 1,
          name: 'IRA Master Tax Preparer',
          email: 'admin@irataxsolutions.com',
          role: 'admin'
        }
      };
    }
  },

  admin: {
    async listClients(token) {
      if (API_BASE) {
        try {
          return await localFetch('/api/admin/clients', {}, token);
        } catch (e) {
          console.warn('API fetch failed, falling back to local client store:', e);
        }
      }

      // Fetch from local store
      const clients = getLocalStore();
      const clientSummaries = clients.map(c => {
        const docs = c.documents || [];
        const pending = docs.filter(d => d.validation_status === 'pending').length;
        const approved = docs.filter(d => d.validation_status === 'approved').length;
        const rejected = docs.filter(d => d.validation_status === 'rejected').length;

        return {
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          file_no: c.file_no,
          status: c.status,
          role: 'client',
          created_at: c.created_at,
          employer: c.taxpayer?.employer || c.employer || '',
          filing_status: c.taxpayer?.filing_status || c.filing_status || '',
          visa_type: c.taxpayer?.visa_type || c.visa_type || '',
          total_docs: docs.length,
          pending_docs: pending,
          approved_docs: approved,
          rejected_docs: rejected
        };
      });

      return { success: true, data: clientSummaries };
    },

    async getClientDossier(id, token) {
      const clientId = parseInt(id, 10);

      if (API_BASE) {
        try {
          return await localFetch(`/api/admin/clients/${id}`, {}, token);
        } catch (e) {
          console.warn('API fetch failed, falling back to local client store:', e);
        }
      }

      const clients = getLocalStore();
      const found = clients.find(c => c.id === clientId) || clients[0];

      if (!found) {
        throw new Error('Client dossier not found.');
      }

      return {
        success: true,
        data: {
          client: {
            id: found.id,
            name: found.name,
            email: found.email,
            phone: found.phone,
            file_no: found.file_no,
            status: found.status,
            role: 'client',
            created_at: found.created_at
          },
          taxpayer: found.taxpayer,
          spouse: found.spouse,
          dependents: found.dependents,
          address: found.address,
          schedule: found.schedule,
          documents: found.documents,
          taxSummary: found.taxSummary,
          taxReturns: [],
          reviewerNotes: found.reviewerNotes || []
        }
      };
    },

    async validateDocument(docId, validation_status, rejection_reason, token) {
      if (API_BASE) {
        try {
          return await localFetch(`/api/admin/documents/${docId}/validate`, {
            method: 'PATCH',
            body: JSON.stringify({ validation_status, rejection_reason })
          }, token);
        } catch (e) {
          console.warn('API validate failed, applying to local store:', e);
        }
      }

      const clients = getLocalStore();
      let updatedDoc = null;

      for (const c of clients) {
        const doc = (c.documents || []).find(d => d.id === parseInt(docId, 10));
        if (doc) {
          doc.validation_status = validation_status;
          doc.rejection_reason = rejection_reason || null;
          doc.verified_by = 'IRA Master Tax Preparer';
          doc.verified_at = new Date().toISOString();

          if (validation_status === 'approved') {
            doc.status = 'Verified & Approved';
          } else if (validation_status === 'rejected') {
            doc.status = 'Action Required / Re-upload Requested';
          } else {
            doc.status = 'Uploaded - Ready for Preparer Review';
          }

          // Auto-update client filing status
          const hasRejected = c.documents.some(d => d.validation_status === 'rejected');
          const allApproved = c.documents.length > 0 && c.documents.every(d => d.validation_status === 'approved');

          if (hasRejected) {
            c.status = 'Action Required (Docs)';
          } else if (allApproved) {
            c.status = 'Documents Verified';
          }

          updatedDoc = doc;
          break;
        }
      }

      saveLocalStore(clients);
      return { success: true, document: updatedDoc };
    },

    async updateClientStatus(id, status, token) {
      const clientId = parseInt(id, 10);

      if (API_BASE) {
        try {
          return await localFetch(`/api/admin/clients/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
          }, token);
        } catch (e) {
          console.warn('API status update failed, applying to local store:', e);
        }
      }

      const clients = getLocalStore();
      const target = clients.find(c => c.id === clientId);
      if (target) {
        target.status = status;
        saveLocalStore(clients);
      }

      return { success: true };
    },

    async addNote(id, note, note_type, token) {
      const clientId = parseInt(id, 10);

      if (API_BASE) {
        try {
          return await localFetch(`/api/admin/clients/${id}/notes`, {
            method: 'POST',
            body: JSON.stringify({ note, note_type })
          }, token);
        } catch (e) {
          console.warn('API add note failed, applying to local store:', e);
        }
      }

      const clients = getLocalStore();
      const target = clients.find(c => c.id === clientId);
      const newNote = {
        id: Date.now(),
        user_id: clientId,
        author_name: 'IRA Master Tax Preparer',
        note,
        note_type: note_type || 'general',
        created_at: new Date().toISOString()
      };

      if (target) {
        target.reviewerNotes = [newNote, ...(target.reviewerNotes || [])];
        saveLocalStore(clients);
      }

      return { success: true, note: newNote };
    },

    async getNotes(id, token) {
      if (API_BASE) {
        try {
          return await localFetch(`/api/admin/clients/${id}/notes`, {}, token);
        } catch (e) {
          console.warn('API get notes failed, reading from local store:', e);
        }
      }

      const clients = getLocalStore();
      const target = clients.find(c => c.id === parseInt(id, 10));
      return { success: true, data: target?.reviewerNotes || [] };
    },

    async saveTaxSummary(id, summaryData, token) {
      const clientId = parseInt(id, 10);

      if (API_BASE) {
        try {
          return await localFetch(`/api/admin/clients/${id}/tax-summary`, {
            method: 'POST',
            body: JSON.stringify(summaryData)
          }, token);
        } catch (e) {
          console.warn('API save summary failed, applying to local store:', e);
        }
      }

      const clients = getLocalStore();
      const target = clients.find(c => c.id === clientId);
      if (target) {
        target.taxSummary = {
          ...(target.taxSummary || {}),
          ...summaryData
        };
        saveLocalStore(clients);
      }

      return { success: true };
    }
  }
};
