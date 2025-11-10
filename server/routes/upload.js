import express from 'express';
import { uploadImage, uploadImages, deleteImage } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/image', upload.single('image'), uploadImage);
router.post('/images', upload.array('images', 10), uploadImages);
router.delete('/image/:publicId', deleteImage);

export default router;