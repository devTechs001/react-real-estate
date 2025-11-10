import express from 'express';
import { getSellerAnalytics, trackPropertyView } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/seller', protect, getSellerAnalytics);
router.post('/track-view/:propertyId', trackPropertyView);

export default router;