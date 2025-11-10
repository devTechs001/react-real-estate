import Property from '../../models/Property.js';
import User from '../../models/User.js';

class RecommendationService {
  // Collaborative filtering
  async getPersonalizedRecommendations(userId, limit = 10) {
    try {
      const user = await User.findById(userId)
        .populate('viewedProperties')
        .populate('favoriteProperties');

      if (!user) {
        throw new Error('User not found');
      }

      // Get user preferences from history
      const preferences = await this.extractUserPreferences(user);

      // Find similar properties
      const recommendations = await this.findSimilarProperties(preferences, limit);

      // Score and rank recommendations
      const rankedRecommendations = this.rankRecommendations(
        recommendations,
        preferences
      );

      return rankedRecommendations;
    } catch (error) {
      console.error('Recommendation Error:', error);
      throw error;
    }
  }

  async extractUserPreferences(user) {
    const viewedProperties = user.viewedProperties || [];
    const favoriteProperties = user.favoriteProperties || [];

    if (viewedProperties.length === 0 && favoriteProperties.length === 0) {
      return this.getDefaultPreferences();
    }

    const allProperties = [...viewedProperties, ...favoriteProperties];

    // Calculate averages
    const avgPrice = this.calculateAverage(allProperties, 'price');
    const avgBedrooms = Math.round(this.calculateAverage(allProperties, 'bedrooms'));
    const avgBathrooms = Math.round(this.calculateAverage(allProperties, 'bathrooms'));
    const avgArea = this.calculateAverage(allProperties, 'area');

    // Extract common property types
    const propertyTypes = this.getMostCommon(allProperties, 'propertyType');
    const locations = this.getMostCommon(allProperties, 'city');
    const amenities = this.extractCommonAmenities(allProperties);

    return {
      priceRange: {
        min: avgPrice * 0.8,
        max: avgPrice * 1.2,
      },
      bedrooms: avgBedrooms,
      bathrooms: avgBathrooms,
      area: avgArea,
      preferredTypes: propertyTypes,
      preferredLocations: locations,
      preferredAmenities: amenities,
      weight: {
        favorites: 2,
        viewed: 1,
      },
    };
  }

  async findSimilarProperties(preferences, limit) {
    const query = {
      price: {
        $gte: preferences.priceRange.min,
        $lte: preferences.priceRange.max,
      },
    };

    if (preferences.preferredTypes.length > 0) {
      query.propertyType = { $in: preferences.preferredTypes };
    }

    if (preferences.preferredLocations.length > 0) {
      query.city = { $in: preferences.preferredLocations };
    }

    const properties = await Property.find(query)
      .limit(limit * 3) // Get more for ranking
      .populate('owner', 'name email');

    return properties;
  }

  rankRecommendations(properties, preferences) {
    return properties
      .map((property) => {
        let score = 0;

        // Price match score
        const priceDiff = Math.abs(
          property.price - (preferences.priceRange.min + preferences.priceRange.max) / 2
        );
        const priceRange = preferences.priceRange.max - preferences.priceRange.min;
        score += Math.max(0, 30 - (priceDiff / priceRange) * 30);

        // Bedrooms match
        if (property.bedrooms === preferences.bedrooms) score += 20;
        else score += Math.max(0, 20 - Math.abs(property.bedrooms - preferences.bedrooms) * 5);

        // Bathrooms match
        if (property.bathrooms === preferences.bathrooms) score += 15;
        else score += Math.max(0, 15 - Math.abs(property.bathrooms - preferences.bathrooms) * 3);

        // Area match
        const areaDiff = Math.abs(property.area - preferences.area);
        score += Math.max(0, 15 - (areaDiff / preferences.area) * 15);

        // Amenities match
        const matchingAmenities = property.amenities.filter((amenity) =>
          preferences.preferredAmenities.includes(amenity)
        );
        score += matchingAmenities.length * 2;

        // Location match
        if (preferences.preferredLocations.includes(property.city)) {
          score += 10;
        }

        return {
          property,
          score: Math.round(score),
          matchReasons: this.generateMatchReasons(property, preferences),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  generateMatchReasons(property, preferences) {
    const reasons = [];

    if (
      property.price >= preferences.priceRange.min &&
      property.price <= preferences.priceRange.max
    ) {
      reasons.push('In your price range');
    }

    if (property.bedrooms === preferences.bedrooms) {
      reasons.push('Matches bedroom preference');
    }

    if (preferences.preferredLocations.includes(property.city)) {
      reasons.push('In preferred location');
    }

    const matchingAmenities = property.amenities.filter((amenity) =>
      preferences.preferredAmenities.includes(amenity)
    );

    if (matchingAmenities.length > 0) {
      reasons.push(`Has ${matchingAmenities.length} preferred amenities`);
    }

    return reasons;
  }

  // Content-based filtering
  async getSimilarProperties(propertyId, limit = 5) {
    try {
      const property = await Property.findById(propertyId);

      if (!property) {
        throw new Error('Property not found');
      }

      const similar = await Property.find({
        _id: { $ne: propertyId },
        propertyType: property.propertyType,
        city: property.city,
        price: {
          $gte: property.price * 0.7,
          $lte: property.price * 1.3,
        },
        bedrooms: {
          $gte: property.bedrooms - 1,
          $lte: property.bedrooms + 1,
        },
      })
        .limit(limit)
        .populate('owner', 'name email');

      return similar;
    } catch (error) {
      console.error('Similar Properties Error:', error);
      throw error;
    }
  }

  // Helper methods
  calculateAverage(items, field) {
    if (items.length === 0) return 0;
    const sum = items.reduce((acc, item) => acc + (item[field] || 0), 0);
    return sum / items.length;
  }

  getMostCommon(items, field) {
    const counts = {};
    items.forEach((item) => {
      const value = item[field];
      counts[value] = (counts[value] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((entry) => entry[0]);
  }

  extractCommonAmenities(properties) {
    const amenityCounts = {};
    
    properties.forEach((property) => {
      (property.amenities || []).forEach((amenity) => {
        amenityCounts[amenity] = (amenityCounts[amenity] || 0) + 1;
      });
    });

    return Object.entries(amenityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((entry) => entry[0]);
  }

  getDefaultPreferences() {
    return {
      priceRange: { min: 100000, max: 500000 },
      bedrooms: 3,
      bathrooms: 2,
      area: 1500,
      preferredTypes: ['house', 'apartment'],
      preferredLocations: [],
      preferredAmenities: ['Parking', 'WiFi'],
      weight: { favorites: 1, viewed: 1 },
    };
  }
}

export default new RecommendationService();