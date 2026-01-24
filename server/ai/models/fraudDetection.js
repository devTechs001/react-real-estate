import Property from '../../models/Property.js';
import User from '../../models/User.js';

/**
 * Detect potential fraud in property listing
 */
export const detectFraud = async (propertyData) => {
  try {
    const fraudScore = await calculateFraudScore(propertyData);
    const flags = await identifyRedFlags(propertyData);

    return {
      isFraudulent: fraudScore > 70,
      fraudScore,
      riskLevel: getRiskLevel(fraudScore),
      flags,
      recommendation: getRecommendation(fraudScore),
    };
  } catch (error) {
    console.error('Fraud detection error:', error);
    throw error;
  }
};

/**
 * Calculate fraud score (0-100)
 */
const calculateFraudScore = async (propertyData) => {
  let score = 0;

  // Check price anomaly
  const priceScore = await checkPriceAnomaly(propertyData);
  score += priceScore * 0.3;

  // Check description quality
  const descScore = checkDescriptionQuality(propertyData.description);
  score += descScore * 0.2;

  // Check image quality
  const imageScore = checkImageQuality(propertyData.images);
  score += imageScore * 0.2;

  // Check user history
  if (propertyData.owner) {
    const userScore = await checkUserHistory(propertyData.owner);
    score += userScore * 0.3;
  }

  return Math.min(100, Math.max(0, score));
};

/**
 * Check if price is anomalous
 */
const checkPriceAnomaly = async (propertyData) => {
  try {
    const similarProperties = await Property.find({
      propertyType: propertyData.propertyType,
      bedrooms: propertyData.bedrooms,
      'location.city': propertyData.location?.city,
      price: { $exists: true, $gt: 0 },
    }).limit(20);

    if (similarProperties.length < 3) return 0;

    const prices = similarProperties.map((p) => p.price);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const stdDev = Math.sqrt(
      prices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / prices.length
    );

    const deviation = Math.abs(propertyData.price - avgPrice) / stdDev;

    // High deviation indicates potential fraud
    if (deviation > 3) return 80;
    if (deviation > 2) return 50;
    if (deviation > 1.5) return 30;
    return 0;
  } catch (error) {
    console.error('Price anomaly check error:', error);
    return 0;
  }
};

/**
 * Check description quality
 */
const checkDescriptionQuality = (description) => {
  if (!description || description.length < 50) return 60;
  if (description.length < 100) return 40;

  // Check for spam patterns
  const spamPatterns = [
    /click here/i,
    /call now/i,
    /limited time/i,
    /act fast/i,
    /guaranteed/i,
  ];

  const hasSpam = spamPatterns.some((pattern) => pattern.test(description));
  if (hasSpam) return 70;

  // Check for excessive caps
  const capsRatio = (description.match(/[A-Z]/g) || []).length / description.length;
  if (capsRatio > 0.3) return 50;

  return 0;
};

/**
 * Check image quality
 */
const checkImageQuality = (images) => {
  if (!images || images.length === 0) return 80;
  if (images.length < 3) return 40;
  if (images.length > 20) return 30; // Too many images can be suspicious
  return 0;
};

/**
 * Check user history
 */
const checkUserHistory = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return 50;

    // Check account age
    const accountAge = (Date.now() - user.createdAt) / (1000 * 60 * 60 * 24); // days
    if (accountAge < 7) return 60;
    if (accountAge < 30) return 30;

    // Check number of properties
    const propertyCount = await Property.countDocuments({ owner: userId });
    if (propertyCount > 50) return 40; // Too many properties
    if (propertyCount === 0) return 20; // First property

    return 0;
  } catch (error) {
    console.error('User history check error:', error);
    return 0;
  }
};

/**
 * Identify specific red flags
 */
const identifyRedFlags = async (propertyData) => {
  const flags = [];

  // Price check
  const priceScore = await checkPriceAnomaly(propertyData);
  if (priceScore > 50) {
    flags.push({
      type: 'price',
      severity: 'high',
      message: 'Price significantly deviates from market average',
    });
  }

  // Description check
  if (!propertyData.description || propertyData.description.length < 50) {
    flags.push({
      type: 'description',
      severity: 'medium',
      message: 'Description is too short or missing',
    });
  }

  // Images check
  if (!propertyData.images || propertyData.images.length < 3) {
    flags.push({
      type: 'images',
      severity: 'medium',
      message: 'Insufficient property images',
    });
  }

  // Contact info in description
  const hasContact = /\d{10}|@|email|phone/i.test(propertyData.description || '');
  if (hasContact) {
    flags.push({
      type: 'contact',
      severity: 'high',
      message: 'Contact information found in description',
    });
  }

  return flags;
};

/**
 * Get risk level from score
 */
const getRiskLevel = (score) => {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
};

/**
 * Get recommendation based on score
 */
const getRecommendation = (score) => {
  if (score >= 70) return 'Reject listing - high fraud risk';
  if (score >= 40) return 'Review manually - moderate fraud risk';
  return 'Approve listing - low fraud risk';
};

export default {
  detectFraud,
};
