import express from 'express';
import {
  getPropertyReviews,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/property/:propertyId', getPropertyReviews);
router.get('/user/my-reviews', protect, getUserReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;