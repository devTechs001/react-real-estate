import api from './api';

export const paymentService = {
  createSubscription: async (plan) => {
    const response = await api.post('/payments/create-subscription', { plan });
    return response.data;
  },

  cancelSubscription: async (subscriptionId) => {
    const response = await api.post('/payments/cancel-subscription', {
      subscriptionId,
    });
    return response.data;
  },

  getSubscription: async () => {
    const response = await api.get('/payments/subscription');
    return response.data;
  },

  getPaymentHistory: async () => {
    const response = await api.get('/payments/history');
    return response.data;
  },

  createPaymentIntent: async (amount) => {
    const response = await api.post('/payments/create-intent', { amount });
    return response.data;
  },
};