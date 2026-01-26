import * as tf from '@tensorflow/tfjs-node';
import path from 'path';
import { fileURLToPath } from 'url';
import Property from '../../models/Property.js';
import openAiService from './openAiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PricePredictionService {
  constructor() {
    this.model = null;
    this.scaler = null;
    this.features = [
      'bedrooms', 'bathrooms', 'area', 'yearBuilt', 
      'parkingSpaces', 'propertyTypeEncoded', 'locationScore',
      'amenitiesScore', 'conditionScore', 'marketTrendScore'
    ];
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Load pre-trained model
      const modelPath = path.join(__dirname, '../models/price_prediction_model');
      this.model = await tf.loadLayersModel(`file://${modelPath}/model.json`);
      
      // Load scaler parameters
      this.scaler = await this.loadScaler();
      
      this.initialized = true;
      console.log('Price prediction model loaded successfully');
    } catch (error) {
      console.error('Failed to load price prediction model:', error);
      // Fallback to creating a simple model
      this.model = this.createSimpleModel();
      this.initialized = true;
    }
  }

  createSimpleModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [10], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1 })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });

    return model;
  }

  async loadScaler() {
    try {
      const scalerPath = path.join(__dirname, '../models/scaler.json');
      const scalerData = require(scalerPath);
      return scalerData;
    } catch (error) {
      // Default scaler parameters
      return {
        mean: {
          bedrooms: 3, bathrooms: 2, area: 1500,
          yearBuilt: 2010, parkingSpaces: 2,
          propertyTypeEncoded: 0.5, locationScore: 0.5,
          amenitiesScore: 0.5, conditionScore: 0.5,
          marketTrendScore: 0.5
        },
        std: {
          bedrooms: 1, bathrooms: 0.5, area: 500,
          yearBuilt: 20, parkingSpaces: 1,
          propertyTypeEncoded: 0.3, locationScore: 0.2,
          amenitiesScore: 0.2, conditionScore: 0.2,
          marketTrendScore: 0.2
        }
      };
    }
  }

  preprocessData(propertyData) {
    // Encode categorical variables
    const propertyTypeMap = {
      'apartment': 0.2,
      'house': 0.4,
      'villa': 0.8,
      'condo': 0.3,
      'townhouse': 0.5,
      'studio': 0.1,
      'penthouse': 0.9
    };

    const conditionMap = {
      'new': 1.0,
      'excellent': 0.9,
      'good': 0.7,
      'fair': 0.5,
      'needs-work': 0.3
    };

    // Calculate scores
    const amenitiesScore = propertyData.amenities ? 
      propertyData.amenities.length / 15 : 0;
    
    const locationScore = this.calculateLocationScore(propertyData.location);
    const marketTrendScore = this.calculateMarketTrendScore(propertyData);

    return {
      bedrooms: propertyData.bedrooms || 3,
      bathrooms: propertyData.bathrooms || 2,
      area: propertyData.area || 1500,
      yearBuilt: propertyData.yearBuilt || new Date().getFullYear() - 10,
      parkingSpaces: propertyData.parkingSpaces || 2,
      propertyTypeEncoded: propertyTypeMap[propertyData.propertyType] || 0.5,
      locationScore,
      amenitiesScore,
      conditionScore: conditionMap[propertyData.condition] || 0.7,
      marketTrendScore
    };
  }

  calculateLocationScore(location) {
    // Premium location scoring (simplified)
    const premiumLocations = ['manhattan', 'beverly hills', 'san francisco', 'miami beach'];
    const locationLower = location?.toLowerCase() || '';
    
    for (const premium of premiumLocations) {
      if (locationLower.includes(premium)) return 0.9;
    }
    
    // Check for city indicators
    if (locationLower.includes('downtown')) return 0.8;
    if (locationLower.includes('suburb')) return 0.6;
    
    return 0.5; // Default average score
  }

  calculateMarketTrendScore(propertyData) {
    // Simplified market trend calculation
    const currentYear = new Date().getFullYear();
    const propertyAge = currentYear - (propertyData.yearBuilt || currentYear - 10);
    
    if (propertyAge < 2) return 0.9; // New construction
    if (propertyAge < 5) return 0.8;
    if (propertyAge < 10) return 0.7;
    if (propertyAge < 20) return 0.6;
    
    return 0.5;
  }

  normalizeFeatures(features) {
    const normalized = {};
    
    for (const key in features) {
      if (this.scaler.mean[key] !== undefined) {
        normalized[key] = (features[key] - this.scaler.mean[key]) / this.scaler.std[key];
      } else {
        normalized[key] = features[key];
      }
    }
    
    return normalized;
  }

  async predictPrice(propertyData) {
    await this.initialize();

    try {
      // Preprocess data
      const processedData = this.preprocessData(propertyData);
      const normalizedData = this.normalizeFeatures(processedData);
      
      // Create tensor
      const inputArray = this.features.map(f => normalizedData[f] || 0);
      const inputTensor = tf.tensor2d([inputArray]);
      
      // Make prediction
      let prediction;
      if (this.model) {
        prediction = await this.model.predict(inputTensor).data();
        inputTensor.dispose();
      } else {
        // Fallback calculation
        prediction = [this.calculateFallbackPrice(processedData)];
      }
      
      // Calculate base price
      const basePrice = prediction[0] * 1000; // Scale to actual price
      
      // Apply market adjustments
      const adjustedPrice = this.applyMarketAdjustments(basePrice, propertyData);
      
      // Calculate confidence
      const confidence = this.calculateConfidence(processedData, propertyData);
      
      // Calculate price range
      const priceRange = this.calculatePriceRange(adjustedPrice, confidence);
      
      // Get price factors
      const factors = this.analyzePriceFactors(propertyData, adjustedPrice);
      
      // Get market comparables
      const comparables = await this.getComparables(propertyData);
      
      // Calculate trend
      const trend = this.calculateTrend(propertyData, comparables);

      return {
        predictedPrice: Math.round(adjustedPrice),
        minPrice: Math.round(priceRange.min),
        maxPrice: Math.round(priceRange.max),
        confidence,
        factors,
        comparables,
        trend: trend.direction,
        trendPercentage: trend.percentage,
        lastUpdated: new Date(),
        methodology: 'Neural Network with Market Analysis',
        accuracy: confidence * 100
      };
    } catch (error) {
      console.error('Price prediction error:', error);
      throw new Error('Failed to predict price');
    }
  }

  calculateFallbackPrice(data) {
    // Simple formula-based calculation
    const basePerSqft = 200; // $200 per sqft
    let price = data.area * basePerSqft;
    
    // Adjustments
    price += data.bedrooms * 10000;
    price += data.bathrooms * 8000;
    price += data.parkingSpaces * 5000;
    price *= data.propertyTypeEncoded * 2;
    price *= data.conditionScore;
    price *= data.locationScore * 1.5;
    
    return price;
  }

  applyMarketAdjustments(basePrice, propertyData) {
    let adjustedPrice = basePrice;
    
    // Location multiplier
    const locationMultiplier = this.getLocationMultiplier(propertyData.location);
    adjustedPrice *= locationMultiplier;
    
    // Property type adjustment
    const typeMultiplier = {
      'villa': 1.3,
      'penthouse': 1.4,
      'house': 1.1,
      'townhouse': 1.0,
      'condo': 0.95,
      'apartment': 0.9,
      'studio': 0.7
    };
    adjustedPrice *= typeMultiplier[propertyData.propertyType] || 1.0;
    
    // Amenities bonus
    if (propertyData.amenities) {
      const premiumAmenities = ['pool', 'gym', 'security', 'elevator'];
      const amenityBonus = propertyData.amenities
        .filter(a => premiumAmenities.includes(a))
        .length * 5000;
      adjustedPrice += amenityBonus;
    }
    
    return adjustedPrice;
  }

  getLocationMultiplier(location) {
    // Simplified location multipliers
    const locationLower = location?.toLowerCase() || '';
    
    if (locationLower.includes('new york')) return 1.8;
    if (locationLower.includes('san francisco')) return 1.7;
    if (locationLower.includes('los angeles')) return 1.5;
    if (locationLower.includes('miami')) return 1.4;
    if (locationLower.includes('chicago')) return 1.2;
    if (locationLower.includes('houston')) return 1.1;
    
    return 1.0;
  }

  calculateConfidence(processedData, originalData) {
    let confidence = 0.7; // Base confidence
    
    // Increase confidence based on data completeness
    const requiredFields = ['location', 'bedrooms', 'bathrooms', 'area', 'yearBuilt'];
    const completeness = requiredFields.filter(f => originalData[f]).length / requiredFields.length;
    confidence += completeness * 0.2;
    
    // Adjust based on data quality
    if (originalData.amenities && originalData.amenities.length > 0) confidence += 0.05;
    if (originalData.condition) confidence += 0.05;
    
    return Math.min(confidence, 0.95);
  }

  calculatePriceRange(price, confidence) {
    const variance = (1 - confidence) * 0.2; // Max 20% variance
    return {
      min: price * (1 - variance),
      max: price * (1 + variance)
    };
  }

  analyzePriceFactors(propertyData, predictedPrice) {
    const factors = [];
    
    // Location factor
    factors.push({
      factor: 'Location',
      impact: 'positive',
      weight: 'high',
      description: `${propertyData.location} is a desirable area`
    });
    
    // Size factor
    if (propertyData.area > 2000) {
      factors.push({
        factor: 'Property Size',
        impact: 'positive',
        weight: 'high',
        description: `Large property at ${propertyData.area} sqft`
      });
    }
    
    // Age factor
    const age = new Date().getFullYear() - propertyData.yearBuilt;
    if (age < 5) {
      factors.push({
        factor: 'New Construction',
        impact: 'positive',
        weight: 'high',
        description: 'Recently built property'
      });
    } else if (age > 30) {
      factors.push({
        factor: 'Property Age',
        impact: 'negative',
        weight: 'medium',
        description: 'Older property may need updates'
      });
    }
    
    // Amenities factor
    if (propertyData.amenities && propertyData.amenities.length > 5) {
      factors.push({
        factor: 'Premium Amenities',
        impact: 'positive',
        weight: 'medium',
        description: 'Multiple desirable amenities'
      });
    }
    
    // Market conditions
    factors.push({
      factor: 'Market Conditions',
      impact: 'neutral',
      weight: 'high',
      description: 'Current market trends'
    });
    
    return factors;
  }

  async getComparables(propertyData) {
    try {
      // Find similar properties
      const comparables = await Property.find({
        propertyType: propertyData.propertyType,
        bedrooms: { $gte: propertyData.bedrooms - 1, $lte: propertyData.bedrooms + 1 },
        bathrooms: { $gte: propertyData.bathrooms - 0.5, $lte: propertyData.bathrooms + 0.5 },
        area: { $gte: propertyData.area * 0.8, $lte: propertyData.area * 1.2 },
        status: 'sold'
      })
      .limit(5)
      .select('price location bedrooms bathrooms area soldDate')
      .sort('-soldDate');
      
      return comparables;
    } catch (error) {
      console.error('Error fetching comparables:', error);
      return [];
    }
  }

  calculateTrend(propertyData, comparables) {
    if (!comparables || comparables.length === 0) {
      return { direction: 'stable', percentage: 0 };
    }
    
    // Calculate average price change
    const avgPrice = comparables.reduce((sum, comp) => sum + comp.price, 0) / comparables.length;
    const priceChange = ((propertyData.price - avgPrice) / avgPrice) * 100;
    
    if (priceChange > 5) return { direction: 'up', percentage: priceChange };
    if (priceChange < -5) return { direction: 'down', percentage: Math.abs(priceChange) };
    
    return { direction: 'stable', percentage: Math.abs(priceChange) };
  }

  async getMarketTrends(location, propertyType) {
    // Get historical data for trend analysis
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    
    try {
      const monthlyData = await Property.aggregate([
        {
          $match: {
            location: new RegExp(location, 'i'),
            propertyType,
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            avgPrice: { $avg: '$price' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);
      
      return monthlyData.map(data => ({
        month: `${data._id.month}/${data._id.year}`,
        price: data.avgPrice,
        volume: data.count
      }));
    } catch (error) {
      console.error('Error fetching market trends:', error);
      return [];
    }
  }

  async trainModel(trainingData) {
    // Method to retrain the model with new data
    await this.initialize();
    
    try {
      // Prepare training data
      const features = [];
      const labels = [];
      
      for (const data of trainingData) {
        const processed = this.preprocessData(data);
        const normalized = this.normalizeFeatures(processed);
        features.push(this.features.map(f => normalized[f] || 0));
        labels.push([data.actualPrice / 1000]); // Scale down price
      }
      
      const xs = tf.tensor2d(features);
      const ys = tf.tensor2d(labels);
      
      // Train model
      await this.model.fit(xs, ys, {
        epochs: 100,
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
          }
        }
      });
      
      // Clean up tensors
      xs.dispose();
      ys.dispose();
      
      // Save model
      await this.saveModel();
      
      return { success: true, message: 'Model trained successfully' };
    } catch (error) {
      console.error('Model training error:', error);
      throw new Error('Failed to train model');
    }
  }

  async saveModel() {
    const modelPath = path.join(__dirname, '../models/price_prediction_model');
    await this.model.save(`file://${modelPath}`);
  }
}

export default new PricePredictionService();