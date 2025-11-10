import express from 'express';
import {
  createUserSubscription,
  cancelSubscription,
  getUserSubscription,
  getPaymentHistory,
  handleWebhook,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

router.use(protect);

router.post('/create-subscription', createUserSubscription);
router.post('/cancel-subscription', cancelSubscription);
router.get('/subscription', getUserSubscription);
router.get('/history', getPaymentHistory);

export default router;