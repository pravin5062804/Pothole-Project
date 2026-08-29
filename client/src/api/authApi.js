import api from './axios';

export const authApi = {
  // Login with email and password
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Get current authenticated user profile
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Fast demo account creation/seeding
  seedDemo: async () => {
    const response = await api.post('/auth/seed-demo');
    return response.data;
  },
};
