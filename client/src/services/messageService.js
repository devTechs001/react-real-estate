import api from './api';

export const messageService = {
  // Get conversations
  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response.data;
  },

  // Get messages
  getMessages: async (conversationId, page = 1) => {
    const response = await api.get(`/messages/${conversationId}?page=${page}`);
    return response.data;
  },

  // Send message
  sendMessage: async (data) => {
    const response = await api.post('/messages', data);
    return response.data;
  },

  // Mark as read
  markAsRead: async (conversationId) => {
    const response = await api.put(`/messages/${conversationId}/read`);
    return response.data;
  },

  // Delete conversation
  deleteConversation: async (conversationId) => {
    const response = await api.delete(`/messages/${conversationId}`);
    return response.data;
  },
};