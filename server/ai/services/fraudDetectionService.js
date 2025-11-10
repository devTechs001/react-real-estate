import Property from '../../models/Property.js';
import User from '../../models/User.js';

class FraudDetectionService {
  // Detect suspicious properties
  async detectSuspiciousProperty(propertyData) {
    const flags = [];
    let riskScore = 0;

    // Price anomaly detection
    const priceAnomaly = await this.detectPriceAnomaly(propertyData);
    if (priceAnomaly.suspicious) {
      flags.push({
        type: 'PRICE_ANOMALY',
        severity: 'high',
        message: priceAnomaly.message,
      });
      riskScore += 40;
    }

    // Image analysis
    const imageCheck = await this.validateImages(propertyData.images);
    if (imageCheck.suspicious) {
      flags.push({
        type: 'IMAGE_SUSPICIOUS',
        severity: 'medium',
        message: imageCheck.message,
      });
      riskScore += 25;
    }

    // Description analysis
    const descCheck = await this.analyzeDescription(propertyData.description);
    if (descCheck.suspicious) {
      flags.push({
        type: 'DESCRIPTION_SUSPICIOUS',
        severity: 'medium',
        message: descCheck.message,
      });
      riskScore += 20;
    }

    // Duplicate detection
    const duplicateCheck = await this.detectDuplicates(propertyData);
    if (duplicateCheck.suspicious) {
      flags.push({
        type: 'POSSIBLE_DUPLICATE',
        severity: 'high',
        message: duplicateCheck.message,
      });
      riskScore += 35;
    }

    // User behavior analysis
    const userCheck = await this.analyzeUserBehavior(propertyData.owner);
    if (userCheck.suspicious) {
      flags.push({
        type: 'USER_SUSPICIOUS',
        severity: userCheck.severity,
        message: userCheck.message,
      });
      riskScore += userCheck.score;
    }

    return {
      suspicious: riskScore > 50,
      riskScore,
      riskLevel: this.getRiskLevel(riskScore),
      flags,
      recommendation: this.getRecommendation(riskScore),
    };
  }

  async detectPriceAnomaly(propertyData) {
    try {
      // Get similar properties
      const similarProperties = await Property.find({
        propertyType: propertyData.propertyType,
        city: propertyData.city,
        bedrooms: { $gte: propertyData.bedrooms - 1, $lte: propertyData.bedrooms + 1 },
      }).limit(50);

      if (similarProperties.length < 5) {
        return { suspicious: false };
      }

      const prices = similarProperties.map((p) => p.price);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      const stdDev = this.calculateStdDev(prices, avgPrice);

      const zScore = Math.abs((propertyData.price - avgPrice) / stdDev);

      if (zScore > 3) {
        return {
          suspicious: true,
          message: `Price is ${zScore.toFixed(2)} standard deviations from market average`,
          avgMarketPrice: avgPrice,
          deviation: ((propertyData.price - avgPrice) / avgPrice) * 100,
        };
      }

      return { suspicious: false };
    } catch (error) {
      console.error('Price Anomaly Detection Error:', error);
      return { suspicious: false };
    }
  }

  async validateImages(images) {
    if (!images || images.length === 0) {
      return {
        suspicious: true,
        message: 'No images provided',
      };
    }

    if (images.length < 3) {
      return {
        suspicious: true,
        message: 'Insufficient number of images',
      };
    }

    // Check for stock photos or duplicates (simplified)
    // In production, use image recognition API

    return { suspicious: false };
  }

  async analyzeDescription(description) {
    if (!description || description.length < 50) {
      return {
        suspicious: true,
        message: 'Description too short or missing',
      };
    }

    // Check for suspicious keywords
    const suspiciousKeywords = [
      'guaranteed',
      'risk-free',
      'act now',
      'limited time',
      'urgent',
      'wire transfer',
      'western union',
      'cashier check',
    ];

    const lowercaseDesc = description.toLowerCase();
    const foundKeywords = suspiciousKeywords.filter((keyword) =>
      lowercaseDesc.includes(keyword)
    );

    if (foundKeywords.length > 0) {
      return {
        suspicious: true,
        message: `Contains suspicious keywords: ${foundKeywords.join(', ')}`,
      };
    }

    // Check for excessive capitalization
    const capsRatio =
      (description.match(/[A-Z]/g) || []).length / description.length;
    if (capsRatio > 0.3) {
      return {
        suspicious: true,
        message: 'Excessive use of capital letters',
      };
    }

    return { suspicious: false };
  }

  async detectDuplicates(propertyData) {
    try {
      // Check for exact matches
      const exactMatch = await Property.findOne({
        address: propertyData.address,
        city: propertyData.city,
        _id: { $ne: propertyData._id },
      });

      if (exactMatch) {
        return {
          suspicious: true,
          message: 'Property with same address already exists',
          duplicateId: exactMatch._id,
        };
      }

      // Check for similar properties by same owner
      if (propertyData.owner) {
        const similarByOwner = await Property.find({
          owner: propertyData.owner,
          propertyType: propertyData.propertyType,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          price: {
            $gte: propertyData.price * 0.95,
            $lte: propertyData.price * 1.05,
          },
          _id: { $ne: propertyData._id },
        });

        if (similarByOwner.length > 0) {
          return {
            suspicious: true,
            message: 'Similar property already listed by same owner',
          };
        }
      }

      return { suspicious: false };
    } catch (error) {
      console.error('Duplicate Detection Error:', error);
      return { suspicious: false };
    }
  }

  async analyzeUserBehavior(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { suspicious: false };
      }

      const userProperties = await Property.find({ owner: userId });

      // New user with many properties
      const accountAge = Date.now() - new Date(user.createdAt).getTime();
      const daysOld = accountAge / (1000 * 60 * 60 * 24);

      if (daysOld < 7 && userProperties.length > 5) {
        return {
          suspicious: true,
          severity: 'high',
          score: 30,
          message: 'New account with unusually high number of listings',
        };
      }

      // Multiple similar listings in short time
      const recentProperties = userProperties.filter((p) => {
        const propertyAge = Date.now() - new Date(p.createdAt).getTime();
        return propertyAge < 24 * 60 * 60 * 1000; // Last 24 hours
      });

      if (recentProperties.length > 10) {
        return {
          suspicious: true,
          severity: 'medium',
          score: 25,
          message: 'Unusually high posting frequency',
        };
      }

      // User not verified
      if (!user.isVerified) {
        return {
          suspicious: true,
          severity: 'low',
          score: 15,
          message: 'User email not verified',
        };
      }

      return { suspicious: false, score: 0 };
    } catch (error) {
      console.error('User Behavior Analysis Error:', error);
      return { suspicious: false, score: 0 };
    }
  }

  getRiskLevel(score) {
    if (score >= 75) return 'CRITICAL';
    if (score >= 50) return 'HIGH';
    if (score >= 30) return 'MEDIUM';
    return 'LOW';
  }

  getRecommendation(score) {
    if (score >= 75) {
      return 'BLOCK - Do not publish this listing';
    }
    if (score >= 50) {
      return 'REVIEW - Manual review required before publishing';
    }
    if (score >= 30) {
      return 'FLAG - Publish with monitoring';
    }
    return 'APPROVE - Safe to publish';
  }

  calculateStdDev(values, mean) {
    const squareDiffs = values.map((value) => Math.pow(value - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(avgSquareDiff);
  }

  // Real-time anomaly detection
  async monitorUserActivity(userId, action) {
    const redis = require('../config/redis'); // Add Redis for caching
    
    const key = `user_activity:${userId}:${action}`;
    const count = await redis.incr(key);
    await redis.expire(key, 3600); // 1 hour window

    // Define thresholds
    const thresholds = {
      property_view: 100,
      property_create: 20,
      property_update: 50,
      search: 200,
    };

    if (count > (thresholds[action] || 50)) {
      return {
        suspicious: true,
        action: 'RATE_LIMIT',
        message: `Unusual ${action} frequency detected`,
      };
    }

    return { suspicious: false };
  }
}

export default new FraudDetectionService();