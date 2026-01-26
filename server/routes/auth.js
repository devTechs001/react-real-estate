import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  getAllRoles,
  getRolePermissions,
  updateUserRole,
  verifyEmail,
  resendVerificationEmail
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);
router.put('/update-password', protect, updatePassword);
router.post('/verify-email/:verificationToken', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// User profile routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Role management routes (admin only)
router.get('/roles', protect, authorize('admin'), getAllRoles);
router.get('/roles/:role/permissions', protect, authorize('admin'), getRolePermissions);
router.put('/users/:userId/role', protect, authorize('admin'), updateUserRole);

export default router;