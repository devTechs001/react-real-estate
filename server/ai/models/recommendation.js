import Property from '../../models/Property.js';
import User from '../../models/User.js';
import Favorite from '../../models/Favorite.js';
import PropertyView from '../../models/PropertyView.js';

/**
 * Get personalized property recommendations for user
 */
export const getRecommendations = async (userId, limit = 10) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // Get user's favorites and views
    const favorites = await Favorite.find({ user: userId }).populate('property');
    const views = await PropertyView.find({ user: userId }).populate('property');

    // Extract user preferences
    const preferences = extractUserPreferences(favorites, views);

    // Find recommended properties
    const recommendations = await findRecommendedProperties(preferences, userId, limit);

    return {
      recommendations,
      preferences,
      count: recommendations.length,
    };
  } catch (error) {
    console.error('Recommendation error:', error);
    throw error;
  }
};

/**
 * Extract user preferences from history
 */
const extractUserPreferences = (favorites, views) => {
  const allProperties = [
    ...favorites.map((f) => f.property),
    ...views.map((v) => v.property),
  ].filter(Boolean);

  if (allProperties.length === 0) {
    return {
      propertyTypes: [],
      priceRange: { min: 0, max: Infinity },
      bedrooms: [],
      locations: [],
    };
  }

  // Extract property types
  const propertyTypes = [...new Set(allProperties.map((p) => p.propertyType))];

  // Calculate price range
  const prices = allProperties.map((p) => p.price).filter((p) => p > 0);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const priceRange = {
    min: Math.round(avgPrice * 0.7),
    max: Math.round(avgPrice * 1.3),
  };

  // Extract bedrooms preference
  const bedrooms = [...new Set(allProperties.map((p) => p.bedrooms))];

  // Extract locations
  const locations = [...new Set(allProperties.map((p) => p.location?.city).filter(Boolean))];

  return {
    propertyTypes,
    priceRange,
    bedrooms,
    locations,
  };
};

/**
 * Find recommended properties based on preferences
 */
const findRecommendedProperties = async (preferences, userId, limit) => {
  try {
    const query = {
      status: 'available',
    };

    // Add property type filter
    if (preferences.propertyTypes.length > 0) {
      query.propertyType = { $in: preferences.propertyTypes };
    }

    // Add price range filter
    if (preferences.priceRange.min > 0) {
      query.price = {
        $gte: preferences.priceRange.min,
        $lte: preferences.priceRange.max,
      };
    }

    // Add bedrooms filter
    if (preferences.bedrooms.length > 0) {
      query.bedrooms = { $in: preferences.bedrooms };
    }

    // Add location filter
    if (preferences.locations.length > 0) {
      query['location.city'] = { $in: preferences.locations };
    }

    // Exclude user's own properties and already favorited
    const favorites = await Favorite.find({ user: userId }).select('property');
    const favoritedIds = favorites.map((f) => f.property);
    query._id = { $nin: favoritedIds };
    query.owner = { $ne: userId };

    const properties = await Property.find(query)
      .sort({ views: -1, createdAt: -1 })
      .limit(limit)
      .populate('owner', 'name avatar');

    return properties;
  } catch (error) {
    console.error('Find recommended properties error:', error);
    return [];
  }
};

/**
 * Get similar properties
 */
export const getSimilarProperties = async (propertyId, limit = 5) => {
  try {
    const property = await Property.findById(propertyId);
    if (!property) throw new Error('Property not found');

    const similarProperties = await Property.find({
      _id: { $ne: propertyId },
      propertyType: property.propertyType,
      bedrooms: { $gte: property.bedrooms - 1, $lte: property.bedrooms + 1 },
      price: {
        $gte: property.price * 0.8,
        $lte: property.price * 1.2,
      },
      status: 'available',
    })
      .sort({ views: -1 })
      .limit(limit)
      .populate('owner', 'name avatar');

    return similarProperties;
  } catch (error) {
    console.error('Similar properties error:', error);
    return [];
  }
};

export default {
  getRecommendations,
  getSimilarProperties,
};
