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

export const api = {
  auth: {
    async login(email, password) {
      return localFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
    },

    async getMe(token) {
      if (!token) return { user: null };
      return localFetch('/api/auth/me', {}, token);
    }
  },

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
