import api from './api';

export const appointmentService = {
  requestAppointment: async (data) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  getMyAppointments: async (status) => {
    const response = await api.get(`/appointments/my-appointments${status ? `?status=${status}` : ''}`);
    return response.data;
  },

  getReceivedAppointments: async (status) => {
    const response = await api.get(`/appointments/received${status ? `?status=${status}` : ''}`);
    return response.data;
  },

  updateStatus: async (id, status, sellerNotes) => {
    const response = await api.put(`/appointments/${id}/status`, { status, sellerNotes });
    return response.data;
  },

  cancelAppointment: async (id, cancellationReason) => {
    const response = await api.put(`/appointments/${id}/cancel`, { cancellationReason });
    return response.data;
  },
};