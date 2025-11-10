import api from './api';

export const favoriteService = {
  getFavorites: async () => {
    const response = await api.get('/favorites');
    return response.data;
  },

  addFavorite: async (propertyId, notes, tags) => {
    const response = await api.post('/favorites', { propertyId, notes, tags });
    return response.data;
  },

  removeFavorite: async (propertyId) => {
    const response = await api.delete(`/favorites/${propertyId}`);
    return response.data;
  },

  updateFavorite: async (id, notes, tags) => {
    const response = await api.put(`/favorites/${id}`, { notes, tags });
    return response.data;
  },

  checkFavorite: async (propertyId) => {
    const response = await api.get(`/favorites/check/${propertyId}`);
    return response.data;
  },
};