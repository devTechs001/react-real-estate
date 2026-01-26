import pricePredictionService from '../ai/services/pricePredictionService.js';
import recommendationService from '../ai/services/recommendationService.js';
import fraudDetectionService from '../ai/services/fraudDetectionService.js';
import imageAnalysisService from '../ai/services/imageAnalysisService.js';
import nlpService from '../ai/services/nlpService.js';
import openAiService from '../ai/services/openAiService.js';
import sentimentAnalysisService from '../ai/services/sentimentAnalysis.js';
import { validationResult } from 'express-validator';

export const aiController = {
  // Price Prediction
  async predictPrice(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const prediction = await pricePredictionService.predictPrice(req.body);
      
      res.json({
        success: true,
        prediction
      });
    } catch (error) {
      console.error('Price prediction error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getMarketTrends(req, res) {
    try {
      const { location, propertyType } = req.query;
      const trends = await pricePredictionService.getMarketTrends(location, propertyType);
      
      res.json({
        success: true,
        trends
      });
    } catch (error) {
      console.error('Market trends error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Recommendations
  async getRecommendations(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 10 } = req.query;
      
      const recommendations = await recommendationService.getPersonalizedRecommendations(
        userId,
        parseInt(limit)
      );
      
      res.json({
        success: true,
        recommendations
      });
    } catch (error) {
      console.error('Recommendations error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getSimilarProperties(req, res) {
    try {
      const { propertyId } = req.params;
      const { limit = 6 } = req.query;
      
      const similar = await recommendationService.getSimilarProperties(
        propertyId,
        parseInt(limit)
      );
      
      res.json({
        success: true,
        properties: similar
      });
    } catch (error) {
      console.error('Similar properties error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getTrendingProperties(req, res) {
    try {
      const { location, limit = 10 } = req.query;
      
      const trending = await recommendationService.getTrendingProperties(
        location,
        parseInt(limit)
      );
      
      res.json({
        success: true,
        properties: trending
      });
    } catch (error) {
      console.error('Trending properties error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Fraud Detection
  async checkFraud(req, res) {
    try {
      const { propertyData } = req.body;
      const userId = req.user.id;
      
      const result = await fraudDetectionService.detectFraud(propertyData, userId);
      
      res.json({
        success: true,
        fraudAnalysis: result
      });
    } catch (error) {
      console.error('Fraud detection error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getUserRiskProfile(req, res) {
    try {
      const { userId } = req.params;
      
      const profile = await fraudDetectionService.reviewUserHistory(userId);
      
      res.json({
        success: true,
        riskProfile: profile
      });
    } catch (error) {
      console.error('Risk profile error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Image Analysis
  async analyzeImage(req, res) {
    try {
      const { imageUrl } = req.body;
      
      const analysis = await imageAnalysisService.analyzePropertyImage(imageUrl);
      
      res.json({
        success: true,
        analysis
      });
    } catch (error) {
      console.error('Image analysis error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async enhanceImage(req, res) {
    try {
      const { imageUrl, enhancements } = req.body;
      
      const enhanced = await imageAnalysisService.enhanceImage(imageUrl, enhancements);
      
      res.json({
        success: true,
        enhancedImage: enhanced
      });
    } catch (error) {
      console.error('Image enhancement error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // NLP Services
  async generateDescription(req, res) {
    try {
      const { propertyData } = req.body;
      
      const description = await openAiService.generatePropertyDescription(propertyData);
      
      res.json({
        success: true,
        description
      });
    } catch (error) {
      console.error('Description generation error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async answerQuestion(req, res) {
    try {
      const { propertyId, question } = req.body;
      
      const property = await Property.findById(propertyId);
      const answer = await openAiService.answerPropertyQuestion(property, question);
      
      res.json({
        success: true,
        answer
      });
    } catch (error) {
      console.error('Q&A error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async extractKeywords(req, res) {
    try {
      const { text } = req.body;
      
      const keywords = await nlpService.extractKeywords(text);
      
      res.json({
        success: true,
        keywords
      });
    } catch (error) {
      console.error('Keyword extraction error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Market Insights
  async getMarketInsights(req, res) {
    try {
      const { location, propertyType } = req.query;
      
      const insights = await openAiService.generateMarketInsights(location, propertyType);
      
      res.json({
        success: true,
        insights
      });
    } catch (error) {
      console.error('Market insights error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async compareProperties(req, res) {
    try {
      const { propertyIds } = req.body;
      
      const properties = await Property.find({ _id: { $in: propertyIds } });
      const comparison = await openAiService.compareProperties(properties);
      
      res.json({
        success: true,
        comparison
      });
    } catch (error) {
      console.error('Property comparison error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async analyzeNeighborhood(req, res) {
    try {
      const { location } = req.query;
      
      const analysis = await openAiService.analyzeNeighborhood(location);
      
      res.json({
        success: true,
        analysis
      });
    } catch (error) {
      console.error('Neighborhood analysis error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async analyzeInvestment(req, res) {
    try {
      const { propertyId } = req.params;
      
      const property = await Property.findById(propertyId);
      const marketData = await pricePredictionService.getMarketTrends(
        property.location,
        property.propertyType
      );
      
      const analysis = await openAiService.analyzeInvestmentPotential(property, marketData);
      
      res.json({
        success: true,
        analysis
      });
    } catch (error) {
      console.error('Investment analysis error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Sentiment Analysis
  async analyzeReviews(req, res) {
    try {
      const { propertyId } = req.params;
      
      const reviews = await Review.find({ property: propertyId });
      const sentiment = await sentimentAnalysisService.analyzeReviews(reviews);
      
      res.json({
        success: true,
        sentiment
      });
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};