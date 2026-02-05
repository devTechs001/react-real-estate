import express from 'express';
import { aiController } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';
import { aiRateLimit } from '../middleware/aiRateLimit.js';
import { body, query, param } from 'express-validator';

const router = express.Router();

// Price Prediction Routes
router.post(
  '/predict-price',
  protect,
  aiRateLimit,
  [
    body('propertyType').isString().notEmpty(),
    body('location').isString().notEmpty(),
    body('bedrooms').isInt({ min: 0 }),
    body('bathrooms').isFloat({ min: 0 }),
    body('area').isFloat({ min: 0 })
  ],
  aiController.predictPrice
);

router.get(
  '/market-trends',
  protect,
  [
    query('location').isString().notEmpty(),
    query('propertyType').isString().optional()
  ],
  aiController.getMarketTrends
);

// Recommendation Routes
router.get('/recommendations', protect, aiController.getRecommendations);

router.get(
  '/similar-properties/:propertyId',
  protect,
  [param('propertyId').isMongoId()],
  aiController.getSimilarProperties
);

router.get('/trending-properties', aiController.getTrendingProperties);

// Fraud Detection Routes
router.post(
  '/check-fraud',
  protect,
  aiRateLimit,
  [body('propertyData').isObject().notEmpty()],
  aiController.checkFraud
);

router.get(
  '/risk-profile/:userId',
  protect,
  [param('userId').isMongoId()],
  aiController.getUserRiskProfile
);

// Image Analysis Routes
router.post(
  '/analyze-image',
  protect,
  aiRateLimit,
  [body('imageUrl').isURL()],
  aiController.analyzeImage
);

router.post(
  '/enhance-image',
  protect,
  aiRateLimit,
  [
    body('imageUrl').isURL(),
    body('enhancements').isArray().optional()
  ],
  aiController.enhanceImage
);

// NLP Routes
router.post(
  '/generate-description',
  protect,
  aiRateLimit,
  [body('propertyData').isObject().notEmpty()],
  aiController.generateDescription
);

router.post(
  '/answer-question',
  protect,
  aiRateLimit,
  [
    body('propertyId').isMongoId(),
    body('question').isString().notEmpty()
  ],
  aiController.answerQuestion
);

router.post(
  '/extract-keywords',
  protect,
  [body('text').isString().notEmpty()],
  aiController.extractKeywords
);

// Market Insights Routes
router.get(
  '/market-insights',
  protect,
  [
    query('location').isString().notEmpty(),
    query('propertyType').isString().optional()
  ],
  aiController.getMarketInsights
);

router.post(
  '/compare-properties',
  protect,
  aiRateLimit,
  [body('propertyIds').isArray().notEmpty()],
  aiController.compareProperties
);

router.get(
  '/analyze-neighborhood',
  protect,
  [query('location').isString().notEmpty()],
  aiController.analyzeNeighborhood
);

router.get(
  '/analyze-investment/:propertyId',
  protect,
  aiRateLimit,
  [param('propertyId').isMongoId()],
  aiController.analyzeInvestment
);

// Sentiment Analysis Routes
router.get(
  '/analyze-reviews/:propertyId',
  protect,
  [param('propertyId').isMongoId()],
  aiController.analyzeReviews
);

export default router;