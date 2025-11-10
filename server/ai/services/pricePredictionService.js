import * as tf from '@tensorflow/tfjs-node';
import { Matrix } from 'ml-matrix';
import MLR from 'ml-regression-multivariate-linear';
import Property from '../../models/Property.js';

class PricePredictionService {
  constructor() {
    this.model = null;
    this.scaler = { mean: null, std: null };
    this.featureNames = [
      'bedrooms',
      'bathrooms',
      'area',
      'yearBuilt',
      'latitude',
      'longitude',
    ];
  }

  // Prepare training data
  async prepareTrainingData() {
    try {
      const properties = await Property.find({
        price: { $exists: true, $gt: 0 },
      }).select('bedrooms bathrooms area yearBuilt price location');

      const features = [];
      const prices = [];

      for (const property of properties) {
        // Get coordinates from location (simplified - use geocoding service in production)
        const coords = await this.getCoordinates(property.location);
        
        features.push([
          property.bedrooms || 0,
          property.bathrooms || 0,
          property.area || 0,
          property.yearBuilt || new Date().getFullYear() - 10,
          coords.lat,
          coords.lng,
        ]);
        
        prices.push(property.price);
      }

      return { features, prices };
    } catch (error) {
      console.error('Data Preparation Error:', error);
      throw error;
    }
  }

  // Normalize features
  normalize(data) {
    const matrix = new Matrix(data);
    const mean = matrix.mean('column');
    const std = matrix.standardDeviation('column', { mean });

    this.scaler.mean = mean;
    this.scaler.std = std;

    const normalized = matrix.clone();
    for (let i = 0; i < normalized.rows; i++) {
      for (let j = 0; j < normalized.columns; j++) {
        normalized.set(i, j, (normalized.get(i, j) - mean[j]) / (std[j] || 1));
      }
    }

    return normalized.to2DArray();
  }

  // Train the model using TensorFlow
  async trainTensorFlowModel() {
    try {
      const { features, prices } = await this.prepareTrainingData();

      if (features.length < 10) {
        throw new Error('Insufficient training data');
      }

      // Normalize features
      const normalizedFeatures = this.normalize(features);

      // Create tensors
      const xs = tf.tensor2d(normalizedFeatures);
      const ys = tf.tensor2d(prices, [prices.length, 1]);

      // Build model
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({
            inputShape: [this.featureNames.length],
            units: 64,
            activation: 'relu',
          }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 32, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 16, activation: 'relu' }),
          tf.layers.dense({ units: 1 }),
        ],
      });

      // Compile model
      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'meanSquaredError',
        metrics: ['mae'],
      });

      // Train model
      await this.model.fit(xs, ys, {
        epochs: 100,
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            if (epoch % 10 === 0) {
              console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}`);
            }
          },
        },
      });

      // Save model
      await this.model.save('file://./ai/models/price-prediction');

      console.log('✅ Price prediction model trained successfully');

      return {
        success: true,
        samples: features.length,
      };
    } catch (error) {
      console.error('Model Training Error:', error);
      throw error;
    }
  }

  // Load trained model
  async loadModel() {
    try {
      this.model = await tf.loadLayersModel('file://./ai/models/price-prediction/model.json');
      console.log('✅ Price prediction model loaded');
    } catch (error) {
      console.log('⚠️ No trained model found, training new model...');
      await this.trainTensorFlowModel();
    }
  }

  // Predict price
  async predictPrice(propertyData) {
    try {
      if (!this.model) {
        await this.loadModel();
      }

      const coords = await this.getCoordinates(propertyData.location);

      const features = [
        [
          propertyData.bedrooms || 0,
          propertyData.bathrooms || 0,
          propertyData.area || 0,
          propertyData.yearBuilt || new Date().getFullYear(),
          coords.lat,
          coords.lng,
        ],
      ];

      // Normalize features
      const normalizedFeatures = this.normalizeInput(features[0]);

      // Predict
      const prediction = this.model.predict(tf.tensor2d([normalizedFeatures]));
      const predictedPrice = (await prediction.data())[0];

      // Calculate confidence interval
      const confidence = this.calculateConfidence(propertyData, predictedPrice);

      return {
        predictedPrice: Math.round(predictedPrice),
        minPrice: Math.round(predictedPrice * 0.9),
        maxPrice: Math.round(predictedPrice * 1.1),
        confidence: confidence,
        factors: this.analyzePriceFactors(propertyData),
      };
    } catch (error) {
      console.error('Price Prediction Error:', error);
      throw error;
    }
  }

  normalizeInput(features) {
    if (!this.scaler.mean || !this.scaler.std) {
      return features;
    }

    return features.map((value, idx) => {
      return (value - this.scaler.mean[idx]) / (this.scaler.std[idx] || 1);
    });
  }

  calculateConfidence(propertyData, predictedPrice) {
    // Simplified confidence calculation
    let confidence = 0.8;

    if (propertyData.yearBuilt) confidence += 0.05;
    if (propertyData.area > 0) confidence += 0.05;
    if (propertyData.location) confidence += 0.1;

    return Math.min(confidence, 0.95);
  }

  analyzePriceFactors(propertyData) {
    const factors = [];

    if (propertyData.bedrooms > 3) {
      factors.push({ factor: 'Bedrooms', impact: 'high', value: propertyData.bedrooms });
    }

    if (propertyData.area > 2000) {
      factors.push({ factor: 'Area', impact: 'high', value: propertyData.area });
    }

    if (propertyData.bathrooms > 2) {
      factors.push({ factor: 'Bathrooms', impact: 'medium', value: propertyData.bathrooms });
    }

    return factors;
  }

  async getCoordinates(location) {
    // Simplified - integrate with Google Maps Geocoding API in production
    const defaultCoords = { lat: 40.7128, lng: -74.006 }; // NYC default
    
    // You would call geocoding API here
    // const response = await geocodingService.getCoords(location);
    
    return defaultCoords;
  }

  // Market trend analysis
  async analyzeMarketTrend(location, timeframe = 30) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeframe);

      const properties = await Property.find({
        location: new RegExp(location, 'i'),
        createdAt: { $gte: startDate, $lte: endDate },
      }).select('price createdAt');

      if (properties.length < 5) {
        return {
          trend: 'insufficient_data',
          message: 'Not enough data for trend analysis',
        };
      }

      const prices = properties.map((p) => p.price);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      const maxPrice = Math.max(...prices);
      const minPrice = Math.min(...prices);

      // Simple linear regression for trend
      const trend = this.calculateTrend(properties);

      return {
        avgPrice,
        maxPrice,
        minPrice,
        trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable',
        trendPercentage: trend,
        dataPoints: properties.length,
        timeframe,
      };
    } catch (error) {
      console.error('Market Trend Error:', error);
      throw error;
    }
  }

  calculateTrend(properties) {
    if (properties.length < 2) return 0;

    const sorted = properties.sort((a, b) => a.createdAt - b.createdAt);
    const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
    const secondHalf = sorted.slice(Math.floor(sorted.length / 2));

    const firstAvg = firstHalf.reduce((sum, p) => sum + p.price, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, p) => sum + p.price, 0) / secondHalf.length;

    return ((secondAvg - firstAvg) / firstAvg) * 100;
  }
}

export default new PricePredictionService();