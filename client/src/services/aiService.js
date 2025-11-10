import api from './api';

export const aiService = {
  // Chat with AI
  chat: async (messages, context = {}) => {
    const response = await api.post('/ai/chat', { messages, context });
    return response.data;
  },

  // Predict property price
  predictPrice: async (propertyData) => {
    const response = await api.post('/ai/predict-price', propertyData);
    return response.data;
  },

  // Get recommendations
  getRecommendations: async (limit = 10) => {
    const response = await api.get(`/ai/recommendations?limit=${limit}`);
    return response.data;
  },

  // Analyze image
  analyzeImage: async (imageUrl) => {
    const response = await api.post('/ai/analyze-image', { imageUrl });
    return response.data;
  },

  // Generate description
  generateDescription: async (propertyData) => {
    const response = await api.post('/ai/generate-description', propertyData);
    return response.data;
  },

  // Get market insights
  getMarketInsights: async (location, timeframe = 30) => {
    const response = await api.post('/ai/market-insights', {
      location,
      timeframe,
    });
    return response.data;
  },

  // Enhance search
  enhanceSearch: async (query) => {
    const response = await api.post('/ai/enhance-search', { query });
    return response.data;
  },

  // Fraud detection
  detectFraud: async (propertyData) => {
    const response = await api.post('/ai/fraud-detection', propertyData);
    return response.data;
  },
};