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

  // Submit community confirmation vote
  submitVote: async (id, voteData) => {
    const response = await api.post(`/verification/${id}/vote`, voteData);
    return response.data;
  },
};
