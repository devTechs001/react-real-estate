import api from './api';

export const propertyService = {
  // Get all properties
  getProperties: async (params) => {
    const response = await api.get('/properties', { params });
    return response.data;
  },

  // Get single property
  getProperty: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  // Create property
  createProperty: async (propertyData) => {
    const response = await api.post('/properties', propertyData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update property
  updateProperty: async (id, propertyData) => {
    const response = await api.put(`/properties/${id}`, propertyData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete property
  deleteProperty: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  // Get user properties
  getUserProperties: async () => {
    const response = await api.get('/properties/user/my-properties');
    return response.data;
  },

  // Search properties
  searchProperties: async (searchTerm) => {
    const response = await api.get(`/properties/search?q=${searchTerm}`);
    return response.data;
  },

  // Get featured properties
  getFeaturedProperties: async () => {
    const response = await api.get('/properties/featured');
    return response.data;
  },
};