import toast from 'react-hot-toast';

export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        toast.error(data.message || 'Bad request');
        break;
      case 401:
        toast.error('Unauthorized. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      case 403:
        toast.error('Access denied');
        break;
      case 404:
        toast.error(data.message || 'Resource not found');
        break;
      case 422:
        toast.error(data.message || 'Validation error');
        break;
      case 429:
        toast.error('Too many requests. Please try again later.');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(data.message || 'An error occurred');
    }
  } else if (error.request) {
    // Request made but no response
    toast.error('Network error. Please check your connection.');
  } else {
    // Something else happened
    toast.error(error.message || 'An unexpected error occurred');
  }
  
  return error;
};

export const logError = (error, context = '') => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);
  }
  
  // In production, send to error tracking service (Sentry, LogRocket, etc.)
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error);
  }
};