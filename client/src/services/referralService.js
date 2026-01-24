import api from './api';

export const referralService = {
  // Create property shareable link
  createPropertyLink: async (propertyId, expiresInDays = 90) => {
    const response = await api.post('/referrals/property', {
      propertyId,
      expiresInDays,
    });
    return response.data;
  },

  // Create seller profile link
  createSellerLink: async (expiresInDays = 365) => {
    const response = await api.post('/referrals/seller', {
      expiresInDays,
    });
    return response.data;
  },

  // Get referral by code (public)
  getReferralByCode: async (code) => {
    const response = await api.get(`/referrals/${code}`);
    return response.data;
  },

  // Get my referral links
  getMyReferrals: async () => {
    const response = await api.get('/referrals');
    return response.data;
  },

  // Update referral
  updateReferral: async (id, data) => {
    const response = await api.put(`/referrals/${id}`, data);
    return response.data;
  },

  // Delete referral
  deleteReferral: async (id) => {
    const response = await api.delete(`/referrals/${id}`);
    return response.data;
  },

  // Get analytics
  getReferralAnalytics: async () => {
    const response = await api.get('/referrals/analytics/stats');
    return response.data;
  },
};
