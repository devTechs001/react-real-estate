import express from 'express';
import {
  getDashboardStats,
  getUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getProperties,
  approveProperty,
  rejectProperty,
  deleteProperty,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard-stats', getDashboardStats);

// Users
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Properties
router.get('/properties', getProperties);
router.put('/properties/:id/approve', approveProperty);
router.put('/properties/:id/reject', rejectProperty);
router.delete('/properties/:id', deleteProperty);

export default router;