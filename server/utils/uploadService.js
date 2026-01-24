import cloudinary from '../config/cloudinary.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Local file path
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<object>} Upload result
 */
export const uploadToCloudinary = async (filePath, folder = 'properties') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `real-estate/${folder}`,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });

    // Delete local file after upload
    await fs.unlink(filePath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array<string>} filePaths - Array of local file paths
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Array<object>>} Array of upload results
 */
export const uploadMultipleToCloudinary = async (filePaths, folder = 'properties') => {
  try {
    const uploadPromises = filePaths.map((filePath) =>
      uploadToCloudinary(filePath, folder)
    );
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw new Error('Failed to upload images');
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<object>} Deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image');
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {Array<string>} publicIds - Array of Cloudinary public IDs
 * @returns {Promise<Array<object>>} Array of deletion results
 */
export const deleteMultipleFromCloudinary = async (publicIds) => {
  try {
    const deletePromises = publicIds.map((publicId) =>
      deleteFromCloudinary(publicId)
    );
    return await Promise.all(deletePromises);
  } catch (error) {
    console.error('Multiple delete error:', error);
    throw new Error('Failed to delete images');
  }
};

/**
 * Validate file type
 * @param {object} file - Multer file object
 * @param {Array<string>} allowedTypes - Array of allowed MIME types
 * @returns {boolean} Is valid
 */
export const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) => {
  return allowedTypes.includes(file.mimetype);
};

/**
 * Validate file size
 * @param {object} file - Multer file object
 * @param {number} maxSize - Maximum size in bytes (default 5MB)
 * @returns {boolean} Is valid
 */
export const validateFileSize = (file, maxSize = 5 * 1024 * 1024) => {
  return file.size <= maxSize;
};
