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
  getSystemHealth,
  getSystemLogs,
  getEmailTemplates,
  getSystemSettings,
  updateSystemSettings,
  getFinancialAnalytics,
  getSellerPerformance,
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

// System
router.get('/system', getSystemHealth);
router.get('/logs', getSystemLogs);

// Email Templates
router.get('/emails', getEmailTemplates);

// System Settings
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);

// Analytics
router.get('/financial-analytics', getFinancialAnalytics);
router.get('/seller-performance', getSellerPerformance);

export default router;