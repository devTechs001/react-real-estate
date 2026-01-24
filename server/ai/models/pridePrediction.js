// Note: Filename has typo - should be "pricePrediction.js"
// This file provides price prediction model functionality

import tensorFlowService from '../services/tensorFlowService.js';
import Property from '../../models/Property.js';

/**
 * Predict property price using machine learning
 */
export const predictPropertyPrice = async (propertyData) => {
  try {
    // Use TensorFlow service for prediction
    const predictedPrice = await tensorFlowService.predictPrice(propertyData);

    // Get similar properties for comparison
    const similarProperties = await findSimilarProperties(propertyData);
    const avgSimilarPrice = calculateAveragePrice(similarProperties);

    // Combine ML prediction with market data
    const finalPrice = (predictedPrice * 0.7) + (avgSimilarPrice * 0.3);

    return {
      predictedPrice: Math.round(finalPrice),
      mlPrediction: Math.round(predictedPrice),
      marketAverage: Math.round(avgSimilarPrice),
      confidence: calculateConfidence(predictedPrice, avgSimilarPrice),
      priceRange: {
        min: Math.round(finalPrice * 0.9),
        max: Math.round(finalPrice * 1.1),
      },
      similarProperties: similarProperties.slice(0, 5),
    };
  } catch (error) {
    console.error('Price prediction error:', error);
    throw error;
  }
};

/**
 * Find similar properties for comparison
 */
const findSimilarProperties = async (propertyData) => {
  try {
    const query = {
      propertyType: propertyData.propertyType,
      bedrooms: { $gte: propertyData.bedrooms - 1, $lte: propertyData.bedrooms + 1 },
      bathrooms: { $gte: propertyData.bathrooms - 0.5, $lte: propertyData.bathrooms + 0.5 },
      area: { $gte: propertyData.area * 0.8, $lte: propertyData.area * 1.2 },
      price: { $exists: true, $gt: 0 },
    };

    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title price bedrooms bathrooms area location');

    return properties;
  } catch (error) {
    console.error('Find similar properties error:', error);
    return [];
  }
};

/**
 * Calculate average price from properties
 */
const calculateAveragePrice = (properties) => {
  if (properties.length === 0) return 0;
  const total = properties.reduce((sum, p) => sum + p.price, 0);
  return total / properties.length;
};

/**
 * Calculate prediction confidence
 */
const calculateConfidence = (mlPrice, marketPrice) => {
  if (marketPrice === 0) return 50;
  const difference = Math.abs(mlPrice - marketPrice) / marketPrice;
  const confidence = Math.max(0, Math.min(100, 100 - difference * 100));
  return Math.round(confidence);
};

/**
 * Get price trends for location
 */
export const getPriceTrends = async (location, months = 6) => {
  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const properties = await Property.find({
      'location.city': location,
      createdAt: { $gte: startDate },
      price: { $exists: true, $gt: 0 },
    }).sort({ createdAt: 1 });

    // Group by month
    const monthlyData = {};
    properties.forEach((p) => {
      const month = p.createdAt.toISOString().slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { prices: [], count: 0 };
      }
      monthlyData[month].prices.push(p.price);
      monthlyData[month].count++;
    });

    // Calculate averages
    const trends = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      averagePrice: Math.round(data.prices.reduce((a, b) => a + b, 0) / data.count),
      count: data.count,
    }));

    return trends;
  } catch (error) {
    console.error('Price trends error:', error);
    return [];
  }
};

export default {
  predictPropertyPrice,
  getPriceTrends,
};
