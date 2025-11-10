import api from './api';

export const analyticsService = {
  getSellerAnalytics: async (timeRange = 30) => {
    const response = await api.get(`/analytics/seller?days=${timeRange}`);
    return response.data;
  },

  getPropertyAnalytics: async (propertyId) => {
    const response = await api.get(`/analytics/property/${propertyId}`);
    return response.data;
  },

  trackPropertyView: async (propertyId) => {
    const response = await api.post(`/analytics/track-view/${propertyId}`);
    return response.data;
  },

  getAdminAnalytics: async () => {
    const response = await api.get('/analytics/admin');
    return response.data;
  },
};