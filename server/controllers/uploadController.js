import cloudinary from '../config/cloudinary.js';
import { upload } from '../middleware/upload.js';

// @desc    Upload single image
// @route   POST /api/upload/image
// @access  Private
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: req.body.folder || 'real-estate',
      resource_type: 'auto',
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private
export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: req.body.folder || 'real-estate',
        resource_type: 'auto',
      })
    );

    const results = await Promise.all(uploadPromises);

    const images = results.map((result) => ({
      url: result.secure_url,
      publicId: result.public_id,
    }));

    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete image
// @route   DELETE /api/upload/image/:publicId
// @access  Private
export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    await cloudinary.uploader.destroy(publicId);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};