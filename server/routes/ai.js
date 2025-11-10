import express from 'express';
import {
  chat,
  predictPrice,
  getRecommendations,
  analyzeImage,
  generateDescription,
  getMarketInsights,
  detectFraud,
  enhanceSearch,
  trainModel,
} from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/auth.js';
import { aiRateLimit } from '../middleware/aiRateLimit.js';

const router = express.Router();

// Public routes with rate limiting
router.post('/chat', aiRateLimit, chat);
router.post('/predict-price', aiRateLimit, predictPrice);
router.post('/enhance-search', aiRateLimit, enhanceSearch);
router.post('/market-insights', aiRateLimit, getMarketInsights);

// Protected routes
router.get('/recommendations', protect, aiRateLimit, getRecommendations);
router.post('/analyze-image', protect, aiRateLimit, analyzeImage);
router.post('/generate-description', protect, aiRateLimit, generateDescription);

// Admin routes
router.post('/fraud-detection', protect, authorize('admin'), detectFraud);
router.post('/train-model', protect, authorize('admin'), trainModel);

export default router;