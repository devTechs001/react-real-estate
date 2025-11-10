import express from 'express';
import {
  requestAppointment,
  getMyAppointments,
  getReceivedAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', requestAppointment);
router.get('/my-appointments', getMyAppointments);
router.get('/received', getReceivedAppointments);
router.put('/:id/status', updateAppointmentStatus);
router.put('/:id/cancel', cancelAppointment);

export default router;