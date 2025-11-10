import express from 'express';
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getUserProperties,
} from '../controllers/propertyController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getProperties)
  .post(protect, upload.array('images', 10), createProperty);

router.get('/user/my-properties', protect, getUserProperties);

router.route('/:id')
  .get(getProperty)
  .put(protect, updateProperty)
  .delete(protect, deleteProperty);

export default router;