import openaiService from '../ai/services/openAiService.js';
import pricePredictionService from '../ai/services/pricePredictionService.js';
import recommendationService from '../ai/services/recommendationService.js';
import fraudDetectionService from '../ai/services/fraudDetectionService.js';

// @desc    Chat with AI assistant
// @route   POST /api/ai/chat
// @access  Public
export const chat = async (req, res) => {
  try {
    const { messages, context } = req.body;

    const response = await openaiService.chat(messages, context);

    res.json({
      success: true,
      response: response.message,
      usage: response.usage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Predict property price
// @route   POST /api/ai/predict-price
// @access  Public
export const predictPrice = async (req, res) => {
  try {
    const propertyData = req.body;

    const prediction = await pricePredictionService.predictPrice(propertyData);

    res.json({
      success: true,
      prediction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get personalized recommendations
// @route   GET /api/ai/recommendations
// @access  Private
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;

    const recommendations = await recommendationService.getPersonalizedRecommendations(
      userId,
      limit
    );

    res.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Analyze property images
// @route   POST /api/ai/analyze-image
// @access  Private
export const analyzeImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    const analysis = await openaiService.analyzePropertyImage(imageUrl);

    res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Generate property description
// @route   POST /api/ai/generate-description
// @access  Private
export const generateDescription = async (req, res) => {
  try {
    const propertyData = req.body;

    const description = await openaiService.generatePropertyDescription(propertyData);

    res.json({
      success: true,
      description,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get market insights
// @route   POST /api/ai/market-insights
// @access  Public
export const getMarketInsights = async (req, res) => {
  try {
    const { location, timeframe } = req.body;

    const trend = await pricePredictionService.analyzeMarketTrend(
      location,
      timeframe
    );
    
    const insights = await openaiService.generateMarketInsights({
      ...trend,
      location,
      period: `${timeframe} days`,
    });

    res.json({
      success: true,
      trend,
      insights,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Detect fraud/suspicious activity
// @route   POST /api/ai/fraud-detection
// @access  Private/Admin
export const detectFraud = async (req, res) => {
  try {
    const propertyData = req.body;

    const analysis = await fraudDetectionService.detectSuspiciousProperty(
      propertyData
    );

    res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Enhance search query
// @route   POST /api/ai/enhance-search
// @access  Public
export const enhanceSearch = async (req, res) => {
  try {
    const { query } = req.body;

    const enhanced = await openaiService.enhanceSearchQuery(query);

    res.json({
      success: true,
      original: query,
      enhanced,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Train price prediction model
// @route   POST /api/ai/train-model
// @access  Private/Admin
export const trainModel = async (req, res) => {
  try {
    const result = await pricePredictionService.trainTensorFlowModel();

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};