import api from './api';

export const reviewService = {
  // Get property reviews
  getPropertyReviews: async (propertyId) => {
    const response = await api.get(`/reviews/property/${propertyId}`);
    return response.data;
  },

  // Create review
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete review
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  // Get user reviews
  getUserReviews: async () => {
    const response = await api.get('/reviews/user/my-reviews');
    return response.data;
  },
};