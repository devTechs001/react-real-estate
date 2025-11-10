import api from './api';

export const authService = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  // Change password
  changePassword: async (passwords) => {
    const response = await api.put('/auth/change-password', passwords);
    return response.data;
  },
};import api from './api';

export const inquiryService = {
  createInquiry: async (data) => {
    const response = await api.post('/inquiries', data);
    return response.data;
  },

  getMyInquiries: async () => {
    const response = await api.get('/inquiries/my-inquiries');
    return response.data;
  },

  getReceivedInquiries: async (status) => {
    const response = await api.get(`/inquiries/received${status ? `?status=${status}` : ''}`);
    return response.data;
  },

  respondToInquiry: async (id, response) => {
    const res = await api.put(`/inquiries/${id}/respond`, { response });
    return res.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/inquiries/${id}/status`, { status });
    return response.data;
  },
};