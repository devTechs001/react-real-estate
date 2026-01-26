import api from './api';

export const dashboardService = {
  // Get dashboard data based on user role
  getDashboardData: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },

  // Get dashboard stats based on user role
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Admin-specific endpoints
  getSystemHealth: async () => {
    const response = await api.get('/admin/system');
    return response.data;
  },

  getSystemLogs: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `/admin/logs?${queryParams}` : '/admin/logs';
    const response = await api.get(url);
    return response.data;
  },

  getEmailTemplates: async () => {
    const response = await api.get('/admin/emails');
    return response.data;
  },

  getSystemSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  updateSystemSettings: async (settings) => {
    const response = await api.put('/admin/settings', { settings });
    return response.data;
  },

  // Analytics endpoints
  getFinancialAnalytics: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `/admin/financial-analytics?${queryParams}` : '/admin/financial-analytics';
    const response = await api.get(url);
    return response.data;
  },

  getSellerPerformance: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `/admin/seller-performance?${queryParams}` : '/admin/seller-performance';
    const response = await api.get(url);
    return response.data;
  },
};