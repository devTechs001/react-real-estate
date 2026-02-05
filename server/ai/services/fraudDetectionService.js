import * as tf from '@tensorflow/tfjs-node';
import Property from '../../models/Property.js';
import User from '../../models/User.js';
import AuditLog from '../../models/Auditlog.js';

class FraudDetectionService {
  constructor() {
    this.model = null;
    this.threshold = 0.7; // Fraud probability threshold
    this.initialized = false;
    this.suspiciousPatterns = new Map();
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      this.model = this.createFraudDetectionModel();
      this.loadSuspiciousPatterns();
      this.initialized = true;
      console.log('Fraud detection service initialized');
    } catch (error) {
      console.error('Failed to initialize fraud detection:', error);
    }
  }

  createFraudDetectionModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [20], units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  loadSuspiciousPatterns() {
    // Load known suspicious patterns
    this.suspiciousPatterns.set('duplicateImages', {
      weight: 0.8,
      description: 'Images used in multiple listings'
    });
    
    this.suspiciousPatterns.set('priceTooLow', {
      weight: 0.7,
      description: 'Price significantly below market value'
    });
    
    this.suspiciousPatterns.set('newUserMultipleListings', {
      weight: 0.6,
      description: 'New user with multiple high-value listings'
    });
    
    this.suspiciousPatterns.set('suspiciousDescription', {
      weight: 0.5,
      description: 'Description contains suspicious phrases'
    });
    
    this.suspiciousPatterns.set('rapidPriceChanges', {
      weight: 0.4,
      description: 'Frequent and significant price changes'
    });
  }

  async detectFraud(propertyData, userId) {
    await this.initialize();
    
    try {
      const fraudIndicators = await this.analyzeProperty(propertyData, userId);
      const fraudScore = this.calculateFraudScore(fraudIndicators);
      const mlPrediction = await this.getMlPrediction(propertyData, fraudIndicators);
      
      // Combine rule-based and ML predictions
      const finalScore = (fraudScore * 0.6) + (mlPrediction * 0.4);
      
      const result = {
        isFraudulent: finalScore > this.threshold,
        fraudScore: finalScore,
        confidence: this.calculateConfidence(fraudIndicators, mlPrediction),
        indicators: fraudIndicators,
        riskLevel: this.getRiskLevel(finalScore),
        recommendations: this.getRecommendations(fraudIndicators, finalScore),
        requiresManualReview: finalScore > 0.5 && finalScore < 0.8
      };
      
      // Log detection result
      await this.logDetection(propertyData, userId, result);
      
      return result;
    } catch (error) {
      console.error('Fraud detection error:', error);
      throw new Error('Failed to perform fraud detection');
    }
  }

  async analyzeProperty(propertyData, userId) {
    const indicators = [];
    
    // Check price anomaly
    const priceAnomaly = await this.checkPriceAnomaly(propertyData);
    if (priceAnomaly.isAnomaly) {
      indicators.push({
        type: 'priceAnomaly',
        severity: priceAnomaly.severity,
        description: priceAnomaly.description,
        weight: 0.7
      });
    }
    
    // Check duplicate images
    const duplicateImages = await this.checkDuplicateImages(propertyData.images);
    if (duplicateImages.found) {
      indicators.push({
        type: 'duplicateImages',
        severity: 'high',
        description: `Images found in ${duplicateImages.count} other listings`,
        weight: 0.8
      });
    }
    
    // Check user history
    const userAnalysis = await this.analyzeUser(userId);
    if (userAnalysis.suspicious) {
      indicators.push({
        type: 'suspiciousUser',
        severity: userAnalysis.severity,
        description: userAnalysis.description,
        weight: userAnalysis.weight
      });
    }
    
    // Check description quality
    const descriptionAnalysis = this.analyzeDescription(propertyData.description);
    if (descriptionAnalysis.suspicious) {
      indicators.push({
        type: 'suspiciousDescription',
        severity: descriptionAnalysis.severity,
        description: descriptionAnalysis.description,
        weight: 0.5
      });
    }
    
    // Check listing patterns
    const listingPatterns = await this.checkListingPatterns(propertyData, userId);
    if (listingPatterns.suspicious) {
      indicators.push({
        type: 'suspiciousPattern',
        severity: listingPatterns.severity,
        description: listingPatterns.description,
        weight: listingPatterns.weight
      });
    }
    
    // Check location validity
    const locationCheck = await this.verifyLocation(propertyData.location);
    if (!locationCheck.valid) {
      indicators.push({
        type: 'invalidLocation',
        severity: 'medium',
        description: 'Location could not be verified',
        weight: 0.4
      });
    }
    
    // Check contact information
    const contactCheck = this.analyzeContactInfo(propertyData.contactInfo);
    if (contactCheck.suspicious) {
      indicators.push({
        type: 'suspiciousContact',
        severity: contactCheck.severity,
        description: contactCheck.description,
        weight: 0.3
      });
    }
    
    return indicators;
  }

  async checkPriceAnomaly(propertyData) {
    try {
      // Get similar properties for comparison
      const similarProperties = await Property.find({
        propertyType: propertyData.propertyType,
        bedrooms: propertyData.bedrooms,
        location: new RegExp(propertyData.location.split(',')[0], 'i'),
        _id: { $ne: propertyData._id }
      }).limit(20);
      
      if (similarProperties.length < 5) {
        return { isAnomaly: false };
      }
      
      // Calculate average and standard deviation
      const prices = similarProperties.map(p => p.price);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      const stdDev = Math.sqrt(
        prices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / prices.length
      );
      
      const priceDiff = Math.abs(propertyData.price - avgPrice);
      const zScore = priceDiff / stdDev;
      
      if (zScore > 3) {
        return {
          isAnomaly: true,
          severity: 'high',
          description: `Price is ${propertyData.price < avgPrice ? 'significantly below' : 'significantly above'} market average (${Math.round(priceDiff/avgPrice * 100)}% difference)`
        };
      } else if (zScore > 2) {
        return {
          isAnomaly: true,
          severity: 'medium',
          description: `Price deviates from market average by ${Math.round(priceDiff/avgPrice * 100)}%`
        };
      }
      
      return { isAnomaly: false };
    } catch (error) {
      console.error('Price anomaly check error:', error);
      return { isAnomaly: false };
    }
  }

  async checkDuplicateImages(images) {
    if (!images || images.length === 0) {
      return { found: false };
    }
    
    try {
      // Hash-based duplicate detection (simplified)
      // In production, use perceptual hashing or image fingerprinting
      const duplicates = await Property.find({
        images: { $in: images }
      }).countDocuments();
      
      return {
        found: duplicates > 1,
        count: duplicates - 1
      };
    } catch (error) {
      console.error('Duplicate image check error:', error);
      return { found: false };
    }
  }

  async analyzeUser(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { suspicious: true, severity: 'high', description: 'User not found', weight: 0.9 };
      }
      
      // Check account age
      const accountAge = Date.now() - user.createdAt;
      const daysOld = accountAge / (1000 * 60 * 60 * 24);
      
      // Check number of listings
      const listingCount = await Property.countDocuments({ seller: userId });
      
      // New user with many listings
      if (daysOld < 7 && listingCount > 5) {
        return {
          suspicious: true,
          severity: 'high',
          description: 'New account with multiple listings',
          weight: 0.7
        };
      }
      
      // Check verification status
      if (!user.emailVerified) {
        return {
          suspicious: true,
          severity: 'medium',
          description: 'Unverified email address',
          weight: 0.4
        };
      }
      
      // Check user rating/reviews
      if (user.rating && user.rating < 2) {
        return {
          suspicious: true,
          severity: 'medium',
          description: 'Low user rating',
          weight: 0.5
        };
      }
      
      return { suspicious: false };
    } catch (error) {
      console.error('User analysis error:', error);
      return { suspicious: false };
    }
  }

  analyzeDescription(description) {
    if (!description) {
      return {
        suspicious: true,
        severity: 'low',
        description: 'No property description provided'
      };
    }
    
    const suspiciousPhrases = [
      'urgent sale',
      'cash only',
      'no viewing needed',
      'wire transfer',
      'western union',
      'deposit immediately',
      'limited time',
      'act fast',
      'too good to miss',
      'below market'
    ];
    
    const lowerDesc = description.toLowerCase();
    const foundPhrases = suspiciousPhrases.filter(phrase => lowerDesc.includes(phrase));
    
    if (foundPhrases.length > 2) {
      return {
        suspicious: true,
        severity: 'high',
        description: `Contains multiple suspicious phrases: ${foundPhrases.join(', ')}`
      };
    } else if (foundPhrases.length > 0) {
      return {
        suspicious: true,
        severity: 'medium',
        description: `Contains suspicious phrase: ${foundPhrases[0]}`
      };
    }
    
    // Check for poor quality indicators
    if (description.length < 50) {
      return {
        suspicious: true,
        severity: 'low',
        description: 'Very short description'
      };
    }
    
    // Check for excessive capitalization
    const capsRatio = (description.match(/[A-Z]/g) || []).length / description.length;
    if (capsRatio > 0.3) {
      return {
        suspicious: true,
        severity: 'low',
        description: 'Excessive capitalization'
      };
    }
    
    return { suspicious: false };
  }

  async checkListingPatterns(propertyData, userId) {
    try {
      // Check for rapid relisting
      const recentListings = await Property.find({
        seller: userId,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });
      
      if (recentListings.length > 10) {
        return {
          suspicious: true,
          severity: 'high',
          description: `${recentListings.length} listings in last 24 hours`,
          weight: 0.8
        };
      }
      
      // Check for similar listings
      const similarListings = await Property.find({
        seller: userId,
        price: propertyData.price,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms
      });
      
      if (similarListings.length > 3) {
        return {
          suspicious: true,
          severity: 'medium',
          description: 'Multiple identical listings',
          weight: 0.6
        };
      }
      
      return { suspicious: false };
    } catch (error) {
      console.error('Listing pattern check error:', error);
      return { suspicious: false };
    }
  }

  async verifyLocation(location) {
    // Simplified location verification
    // In production, use geocoding API
    if (!location || location.length < 3) {
      return { valid: false };
    }
    
    // Check for suspicious location patterns
    const suspiciousPatterns = ['test', 'fake', 'xxx', '123'];
    const lowerLocation = location.toLowerCase();
    
    for (const pattern of suspiciousPatterns) {
      if (lowerLocation.includes(pattern)) {
        return { valid: false };
      }
    }
    
    return { valid: true };
  }

  analyzeContactInfo(contactInfo) {
    if (!contactInfo) {
      return { suspicious: false };
    }
    
    // Check for suspicious email patterns
    if (contactInfo.email) {
      const suspiciousDomains = ['tempmail', 'throwaway', 'guerrillamail', '10minutemail'];
      const emailDomain = contactInfo.email.split('@')[1];
      
      if (suspiciousDomains.some(domain => emailDomain.includes(domain))) {
        return {
          suspicious: true,
          severity: 'high',
          description: 'Temporary email address used'
        };
      }
    }
    
    // Check for invalid phone patterns
    if (contactInfo.phone) {
      const phoneDigits = contactInfo.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        return {
          suspicious: true,
          severity: 'low',
          description: 'Invalid phone number format'
        };
      }
    }
    
    return { suspicious: false };
  }

  calculateFraudScore(indicators) {
    if (indicators.length === 0) return 0;
    
    let weightedSum = 0;
    let totalWeight = 0;
    
    for (const indicator of indicators) {
      const severityMultiplier = {
        'high': 1.0,
        'medium': 0.6,
        'low': 0.3
      };
      
      const score = (indicator.weight || 0.5) * (severityMultiplier[indicator.severity] || 0.5);
      weightedSum += score;
      totalWeight += indicator.weight || 0.5;
    }
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  async getMlPrediction(propertyData, indicators) {
    if (!this.model) return 0.5;
    
    try {
      // Prepare features for ML model
      const features = this.extractFeatures(propertyData, indicators);
      const inputTensor = tf.tensor2d([features]);
      
      const prediction = await this.model.predict(inputTensor).data();
      inputTensor.dispose();
      
      return prediction[0];
    } catch (error) {
      console.error('ML prediction error:', error);
      return 0.5;
    }
  }

  extractFeatures(propertyData, indicators) {
    // Extract numerical features for ML model
    return [
      propertyData.price / 1000000 || 0,
      propertyData.bedrooms || 0,
      propertyData.bathrooms || 0,
      propertyData.area / 1000 || 0,
      indicators.length,
      indicators.filter(i => i.severity === 'high').length,
      indicators.filter(i => i.severity === 'medium').length,
      indicators.filter(i => i.severity === 'low').length,
      propertyData.images?.length || 0,
      propertyData.description?.length || 0,
      propertyData.amenities?.length || 0,
      indicators.find(i => i.type === 'priceAnomaly') ? 1 : 0,
      indicators.find(i => i.type === 'duplicateImages') ? 1 : 0,
      indicators.find(i => i.type === 'suspiciousUser') ? 1 : 0,
      indicators.find(i => i.type === 'suspiciousDescription') ? 1 : 0,
      indicators.find(i => i.type === 'suspiciousPattern') ? 1 : 0,
      indicators.find(i => i.type === 'invalidLocation') ? 1 : 0,
      indicators.find(i => i.type === 'suspiciousContact') ? 1 : 0,
      Math.random(), // Placeholder for time-based features
      Math.random()  // Placeholder for user behavior features
    ];
  }

  calculateConfidence(indicators, mlPrediction) {
    // Calculate confidence based on indicator consistency
    const indicatorCount = indicators.length;
    const highSeverityCount = indicators.filter(i => i.severity === 'high').length;
    
    let confidence = 0.5;
    
    // Increase confidence if multiple indicators agree
    if (indicatorCount > 3) confidence += 0.2;
    if (highSeverityCount > 1) confidence += 0.2;
    
    // Adjust based on ML prediction strength
    if (mlPrediction > 0.8 || mlPrediction < 0.2) confidence += 0.1;
    
    return Math.min(confidence, 0.95);
  }

  getRiskLevel(fraudScore) {
    if (fraudScore >= 0.8) return 'critical';
    if (fraudScore >= 0.6) return 'high';
    if (fraudScore >= 0.4) return 'medium';
    if (fraudScore >= 0.2) return 'low';
    return 'minimal';
  }

  getRecommendations(indicators, fraudScore) {
    const recommendations = [];
    
    if (fraudScore > 0.7) {
      recommendations.push('Block this listing immediately');
      recommendations.push('Investigate user account');
      recommendations.push('Report to authorities if confirmed');
    } else if (fraudScore > 0.5) {
      recommendations.push('Flag for manual review');
      recommendations.push('Request additional verification from seller');
      recommendations.push('Monitor user activity closely');
    } else if (fraudScore > 0.3) {
      recommendations.push('Verify property details');
      recommendations.push('Check seller credentials');
      recommendations.push('Enable enhanced monitoring');
    }
    
    // Specific recommendations based on indicators
    if (indicators.find(i => i.type === 'duplicateImages')) {
      recommendations.push('Request original property photos');
    }
    
    if (indicators.find(i => i.type === 'priceAnomaly')) {
      recommendations.push('Verify pricing with market analysis');
    }
    
    if (indicators.find(i => i.type === 'suspiciousUser')) {
      recommendations.push('Require identity verification');
    }
    
    return recommendations;
  }

  async logDetection(propertyData, userId, result) {
    try {
      await AuditLog.create({
        action: 'fraud_detection',
        userId,
        targetId: propertyData._id,
        targetType: 'property',
        details: {
          fraudScore: result.fraudScore,
          isFraudulent: result.isFraudulent,
          riskLevel: result.riskLevel,
          indicators: result.indicators.map(i => ({
            type: i.type,
            severity: i.severity
          }))
        },
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Failed to log fraud detection:', error);
    }
  }

  async reviewUserHistory(userId) {
    try {
      const userLogs = await AuditLog.find({
        userId,
        action: 'fraud_detection'
      }).sort('-timestamp').limit(50);
      
      const fraudCount = userLogs.filter(log => log.details.isFraudulent).length;
      const avgFraudScore = userLogs.reduce((sum, log) => sum + log.details.fraudScore, 0) / userLogs.length;
      
      return {
        totalChecks: userLogs.length,
        fraudulentListings: fraudCount,
        averageFraudScore: avgFraudScore,
        riskProfile: avgFraudScore > 0.5 ? 'high-risk' : avgFraudScore > 0.3 ? 'medium-risk' : 'low-risk',
        recentActivity: userLogs.slice(0, 10)
      };
    } catch (error) {
      console.error('Error reviewing user history:', error);
      throw error;
    }
  }
}

export default new FraudDetectionService();