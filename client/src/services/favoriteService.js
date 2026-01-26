// client/src/services/favoriteService.js
import api from './api';

export const favoriteService = {
  // Get all favorites
  getAll: async (params = {}) => {
    const response = await api.get('/favorites', { params });
    return response.data;
  },

  // Add to favorites
  add: async (propertyId) => {
    const response = await api.post('/favorites', { propertyId });
    return response.data;
  },

  // Remove from favorites
  remove: async (propertyId) => {
    const response = await api.delete(`/favorites/${propertyId}`);
    return response.data;
  },

  // Check if property is favorited
  check: async (propertyId) => {
    const response = await api.get(`/favorites/check/${propertyId}`);
    return response.data;
  },

  // Get favorites count
  getCount: async () => {
    const response = await api.get('/favorites/count');
    return response.data;
  }
};