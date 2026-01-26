import express from 'express';
import { aiController } from '../controllers/aiController.js';
import { auth } from '../middleware/auth.js';
import { aiRateLimit } from '../middleware/aiRateLimit.js';
import { body, query, param } from 'express-validator';

const router = express.Router();

// Price Prediction Routes
router.post(
  '/predict-price',
  auth,
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
  auth,
  [
    query('location').isString().notEmpty(),
    query('propertyType').isString().optional()
  ],
  aiController.getMarketTrends
);

// Recommendation Routes
router.get('/recommendations', auth, aiController.getRecommendations);

router.get(
  '/similar-properties/:propertyId',
  auth,
  [param('propertyId').isMongoId()],
  aiController.getSimilarProperties
);

router.get('/trending-properties', aiController.getTrendingProperties);

// Fraud Detection Routes
router.post(
  '/check-fraud',
  auth,
  aiRateLimit,
  [body('propertyData').isObject().notEmpty()],
  aiController.checkFraud
);

router.get(
  '/risk-profile/:userId',
  auth,
  [param('userId').isMongoId()],
  aiController.getUserRiskProfile
);

// Image Analysis Routes
router.post(
  '/analyze-image',
  auth,
  aiRateLimit,
  [body('imageUrl').isURL()],
  aiController.analyzeImage
);

router.post(
  '/enhance-image',
  auth,
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
  auth,
  aiRateLimit,
  [body('propertyData').isObject().notEmpty()],
  aiController.generateDescription
);

router.post(
  '/answer-question',
  auth,
  aiRateLimit,
  [
    body('propertyId').isMongoId(),
    body('question').isString().notEmpty()
  ],
  aiController.answerQuestion
);

router.post(
  '/extract-keywords',
  auth,
  [body('text').isString().notEmpty()],
  aiController.extractKeywords
);

// Market Insights Routes
router.get(
  '/market-insights',
  auth,
  [
    query('location').isString().notEmpty(),
    query('propertyType').isString().optional()
  ],
  aiController.getMarketInsights
);

router.post(
  '/compare-properties',
  auth,
  aiRateLimit,
  [body('propertyIds').isArray().notEmpty()],
  aiController.compareProperties
);

router.get(
  '/analyze-neighborhood',
  auth,
  [query('location').isString().notEmpty()],
  aiController.analyzeNeighborhood
);

router.get(
  '/analyze-investment/:propertyId',
  auth,
  aiRateLimit,
  [param('propertyId').isMongoId()],
  aiController.analyzeInvestment
);

// Sentiment Analysis Routes
router.get(
  '/analyze-reviews/:propertyId',
  auth,
  [param('propertyId').isMongoId()],
  aiController.analyzeReviews
);

export default router;