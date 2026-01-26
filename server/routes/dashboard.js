import express from 'express';
import { getDashboardData, getDashboardStats } from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Dashboard routes
router.get('/', getDashboardData); // Main dashboard data based on user role
router.get('/stats', getDashboardStats); // Dashboard statistics based on user role

export default router;