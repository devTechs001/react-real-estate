import express from 'express';
import {
  createInquiry,
  getMyInquiries,
  getReceivedInquiries,
  respondToInquiry,
  updateInquiryStatus,
} from '../controllers/inquiryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createInquiry);
router.get('/my-inquiries', getMyInquiries);
router.get('/received', getReceivedInquiries);
router.put('/:id/respond', respondToInquiry);
router.put('/:id/status', updateInquiryStatus);

export default router;