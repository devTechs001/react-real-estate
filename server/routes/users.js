import express from 'express';
import {
  getUserProfile,
  getUserProperties,
  updatePreferences,
  getDashboardStats,
  followUser,
  unfollowUser
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/profile/:id', getUserProfile);
router.get('/:id/properties', getUserProperties);

// Protected routes
router.route('/preferences')
  .put(protect, updatePreferences);

router.get('/dashboard-stats', protect, getDashboardStats);

router.route('/:id/follow')
  .post(protect, followUser)
  .delete(protect, unfollowUser);

export default router;