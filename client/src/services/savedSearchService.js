import api from './api';

export const savedSearchService = {
  // Get all saved searches
  getSavedSearches: async () => {
    const response = await api.get('/saved-searches');
    return response.data;
  },

  // Create saved search
  createSavedSearch: async (searchData) => {
    const response = await api.post('/saved-searches', searchData);
    return response.data;
  },

  // Update saved search
  updateSavedSearch: async (id, searchData) => {
    const response = await api.put(`/saved-searches/${id}`, searchData);
    return response.data;
  },

  // Delete saved search
  deleteSavedSearch: async (id) => {
    const response = await api.delete(`/saved-searches/${id}`);
    return response.data;
  },

  // Get saved search results
  getSavedSearchResults: async (id) => {
    const response = await api.get(`/saved-searches/${id}/results`);
    return response.data;
  },
};
