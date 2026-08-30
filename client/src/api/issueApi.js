import api from './axios';

export const issueApi = {
  // Submit a new civic issue report with optional photos & GPS
  reportIssue: async (formData) => {
    const response = await api.post('/issues', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get list of issues with optional filtering parameters
  getIssues: async (params = {}) => {
    const response = await api.get('/issues', { params });
    return response.data;
  },

  // Get a single issue by MongoDB ID or ticketId (e.g. CR-2026-1234)
  getIssueById: async (id) => {
    const response = await api.get(`/issues/${id}`);
    return response.data;
  },

  // Get dashboard metrics and analytics
  getDashboardStats: async () => {
    const response = await api.get('/issues/stats/overview');
    return response.data;
  },

  // Update issue status (Admin / Worker)
  updateStatus: async (id, status, note = '') => {
    const response = await api.patch(`/issues/${id}/status`, { status, note });
    return response.data;
  },

  // Assign worker/team to an issue (Admin)
  assignWorker: async (id, data) => {
    const response = await api.patch(`/issues/${id}/assign`, data);
    return response.data;
  },

  // Auto-dispatch single issue via Smart Priority Queue
  autoDispatchSingle: async (id) => {
    const response = await api.post(`/issues/${id}/auto-dispatch`);
    return response.data;
  },

  // Batch auto-dispatch all unassigned issues in queue
  batchAutoDispatch: async () => {
    const response = await api.post('/issues/queue/batch-dispatch');
    return response.data;
  },

  // Field Worker uploads resolution evidence photos & notes
  submitEvidence: async (id, formData) => {
    const response = await api.post(`/verification/${id}/submit-evidence`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Submit community confirmation or dispute vote (Citizen)
  submitVote: async (id, formDataOrData) => {
    const headers =
      formDataOrData instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : {};
    const response = await api.post(`/verification/${id}/vote`, formDataOrData, {
      headers,
    });
    return response.data;
  },

  // Get issue confirmation votes tally & history
  getIssueVotes: async (id) => {
    const response = await api.get(`/verification/${id}/votes`);
    return response.data;
  },
};
