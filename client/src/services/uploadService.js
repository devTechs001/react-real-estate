import api from './api';

export const uploadService = {
  uploadImage: async (file, folder = 'properties') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  uploadMultipleImages: async (files, folder = 'properties') => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('folder', folder);

    const response = await api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  deleteImage: async (publicId) => {
    const response = await api.delete(`/upload/image/${publicId}`);
    return response.data;
  },
};