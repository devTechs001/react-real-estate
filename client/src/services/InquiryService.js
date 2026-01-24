import api from './api';

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