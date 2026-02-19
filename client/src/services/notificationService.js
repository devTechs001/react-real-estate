import api from './api';

export const notificationService = {
  getNotifications: async (page = 1, unreadOnly = false) => {
    try {
      const response = await api.get(
        `/notifications?page=${page}&unreadOnly=${unreadOnly}`
      );
      return response.data;
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Failed to fetch notifications:', error);
      }
      throw error;
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data;
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Failed to fetch unread count:', error);
      }
      throw error;
    }
  },

  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};