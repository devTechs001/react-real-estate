import express from 'express';
import {
  createPropertyLink,
  createSellerLink,
  getReferralByCode,
  getMyReferrals,
  updateReferral,
  deleteReferral,
  getReferralAnalytics,
} from '../controllers/referralController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/:code', getReferralByCode);

// Protected routes
router.use(protect);

router.post('/property', createPropertyLink);
router.post('/seller', createSellerLink);
router.get('/', getMyReferrals);
router.put('/:id', updateReferral);
router.delete('/:id', deleteReferral);
router.get('/analytics/stats', getReferralAnalytics);

export default router;
