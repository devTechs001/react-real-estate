import express from 'express';
import {
  healthCheck,
  detailedHealthCheck,
  readinessCheck,
  livenessCheck,
} from '../controllers/healthController.js';

const router = express.Router();

// Public health endpoints
router.get('/', healthCheck);
router.get('/detailed', detailedHealthCheck);
router.get('/ready', readinessCheck);
router.get('/live', livenessCheck);

export default router;
