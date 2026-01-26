import * as tf from '@tensorflow/tfjs-node';
import Property from '../../models/Property.js';
import User from '../../models/User.js';
import PropertyView from '../../models/PropertyView.js';
import Favorite from '../../models/Favorite.js';

class RecommendationService {
  constructor() {
    this.model = null;
    this.userEmbeddings = new Map();
    this.propertyEmbeddings = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      // Initialize recommendation model
      this.model = this.createRecommendationModel();
      await this.loadEmbeddings();
      this.initialized = true;
      console.log('Recommendation service initialized');
    } catch (error) {
      console.error('Failed to initialize recommendation service:', error);
    }
  }

  createRecommendationModel() {
    // Collaborative filtering model
    const userInput = tf.input({ shape: [1], dtype: 'int32' });
    const propertyInput = tf.input({ shape: [1], dtype: 'int32' });
    
    // User embedding
    const userEmbedding = tf.layers.embedding({
      inputDim: 10000,
      outputDim: 50,
      inputLength: 1
    }).apply(userInput);
    
    // Property embedding
    const propertyEmbedding = tf.layers.embedding({
      inputDim: 10000,
      outputDim: 50,
      inputLength: 1
    }).apply(propertyInput);
    
    // Flatten embeddings
    const userFlat = tf.layers.flatten().apply(userEmbedding);
    const propertyFlat = tf.layers.flatten().apply(propertyEmbedding);
    
    // Concatenate
    const concat = tf.layers.concatenate().apply([userFlat, propertyFlat]);
    
    // Dense layers
    let dense = tf.layers.dense({ units: 128, activation: 'relu' }).apply(concat);
    dense = tf.layers.dropout({ rate: 0.3 }).apply(dense);
    dense = tf.layers.dense({ units: 64, activation: 'relu' }).apply(dense);
    dense = tf.layers.dropout({ rate: 0.2 }).apply(dense);
    
    // Output layer
    const output = tf.layers.dense({ units: 1, activation: 'sigmoid' }).apply(dense);
    
    const model = tf.model({ inputs: [userInput, propertyInput], outputs: output });
    
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
    
    return model;
  }

  async loadEmbeddings() {
    // Load or generate user and property embeddings
    try {
      const users = await User.find().select('_id preferences');
      const properties = await Property.find().select('_id features');
      
      // Generate embeddings (simplified)
      users.forEach(user => {
        this.userEmbeddings.set(user._id.toString(), this.generateUserEmbedding(user));
      });
      
      properties.forEach(property => {
        this.propertyEmbeddings.set(
          property._id.toString(),
          this.generatePropertyEmbedding(property)
        );
      });
    } catch (error) {
      console.error('Error loading embeddings:', error);
    }
  }

  generateUserEmbedding(user) {
    // Generate user embedding based on preferences
    const embedding = new Array(50).fill(0);
    
    if (user.preferences) {
      // Map preferences to embedding dimensions
      if (user.preferences.propertyType) {
        const typeIndex = ['apartment', 'house', 'villa', 'condo'].indexOf(
          user.preferences.propertyType
        );
        if (typeIndex !== -1) embedding[typeIndex] = 1;
      }
      
      if (user.preferences.priceRange) {
        embedding[10] = user.preferences.priceRange.min / 1000000;
        embedding[11] = user.preferences.priceRange.max / 1000000;
      }
      
      if (user.preferences.bedrooms) {
        embedding[20] = user.preferences.bedrooms / 10;
      }
    }
    
    return embedding;
  }

  generatePropertyEmbedding(property) {
    // Generate property embedding based on features
    const embedding = new Array(50).fill(0);
    
    if (property.features) {
      // Map features to embedding dimensions
      const typeIndex = ['apartment', 'house', 'villa', 'condo'].indexOf(
        property.features.propertyType
      );
      if (typeIndex !== -1) embedding[typeIndex] = 1;
      
      if (property.features.price) {
        embedding[10] = property.features.price / 1000000;
      }
      
      if (property.features.bedrooms) {
        embedding[20] = property.features.bedrooms / 10;
      }
      
      if (property.features.area) {
        embedding[25] = property.features.area / 5000;
      }
    }
    
    return embedding;
  }

  async getPersonalizedRecommendations(userId, limit = 10) {
    await this.initialize();
    
    try {
      // Get user's interaction history
      const userHistory = await this.getUserHistory(userId);
      
      // Get user preferences
      const user = await User.findById(userId);
      const preferences = user.preferences || {};
      
      // Content-based filtering
      const contentBased = await this.contentBasedRecommendations(
        preferences,
        userHistory,
        limit
      );
      
      // Collaborative filtering
      const collaborative = await this.collaborativeFiltering(
        userId,
        userHistory,
        limit
      );
      
      // Hybrid approach - combine both methods
      const recommendations = this.mergeRecommendations(
        contentBased,
        collaborative,
        limit
      );
      
      // Add explanation for each recommendation
      const explainedRecommendations = await this.addExplanations(
        recommendations,
        userId
      );
      
      return explainedRecommendations;
    } catch (error) {
      console.error('Recommendation error:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  async getUserHistory(userId) {
    const views = await PropertyView.find({ user: userId })
      .populate('property')
      .sort('-viewedAt')
      .limit(50);
    
    const favorites = await Favorite.find({ user: userId })
      .populate('property');
    
    return {
      views: views.map(v => v.property),
      favorites: favorites.map(f => f.property)
    };
  }

  async contentBasedRecommendations(preferences, history, limit) {
    // Build query based on preferences and history
    const query = {};
    
    if (preferences.propertyType) {
      query.propertyType = preferences.propertyType;
    }
    
    if (preferences.priceRange) {
      query.price = {
        $gte: preferences.priceRange.min,
        $lte: preferences.priceRange.max
      };
    }
    
    if (preferences.location) {
      query.location = new RegExp(preferences.location, 'i');
    }
    
    if (preferences.bedrooms) {
      query.bedrooms = { $gte: preferences.bedrooms };
    }
    
    if (preferences.bathrooms) {
      query.bathrooms = { $gte: preferences.bathrooms };
    }
    
    // Exclude already viewed properties
    const viewedIds = history.views.map(p => p._id);
    query._id = { $nin: viewedIds };
    
    // Find matching properties
    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 2);
    
    // Score properties based on similarity to favorites
    const scored = properties.map(property => ({
      property,
      score: this.calculateSimilarityScore(property, history.favorites)
    }));
    
    // Sort by score and return top results
    scored.sort((a, b) => b.score - a.score);
    
    return scored.slice(0, limit).map(s => s.property);
  }

  async collaborativeFiltering(userId, history, limit) {
    // Find users with similar preferences
    const similarUsers = await this.findSimilarUsers(userId, history);
    
    // Get properties liked by similar users
    const recommendations = [];
    
    for (const similarUser of similarUsers) {
      const userFavorites = await Favorite.find({ user: similarUser._id })
        .populate('property')
        .limit(5);
      
      for (const favorite of userFavorites) {
        // Don't recommend already viewed properties
        if (!history.views.find(v => v._id.equals(favorite.property._id))) {
          recommendations.push(favorite.property);
        }
      }
    }
    
    // Remove duplicates and limit results
    const uniqueRecommendations = Array.from(
      new Map(recommendations.map(p => [p._id.toString(), p])).values()
    );
    
    return uniqueRecommendations.slice(0, limit);
  }

  async findSimilarUsers(userId, history) {
    // Find users who have viewed or favorited similar properties
    const propertyIds = [
      ...history.views.map(v => v._id),
      ...history.favorites.map(f => f._id)
    ];
    
    const similarUsers = await PropertyView.aggregate([
      { $match: { property: { $in: propertyIds }, user: { $ne: userId } } },
      { $group: { _id: '$user', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    return User.find({ _id: { $in: similarUsers.map(u => u._id) } });
  }

  calculateSimilarityScore(property, favorites) {
    if (favorites.length === 0) return 0;
    
    let score = 0;
    
    for (const favorite of favorites) {
      // Property type match
      if (property.propertyType === favorite.propertyType) score += 2;
      
      // Price similarity (inverse difference)
      const priceDiff = Math.abs(property.price - favorite.price);
      score += Math.max(0, 10 - priceDiff / 10000);
      
      // Bedroom similarity
      const bedDiff = Math.abs(property.bedrooms - favorite.bedrooms);
      score += Math.max(0, 5 - bedDiff);
      
      // Location similarity
      if (property.location === favorite.location) score += 3;
      
      // Area similarity
      const areaDiff = Math.abs(property.area - favorite.area);
      score += Math.max(0, 5 - areaDiff / 100);
    }
    
    return score / favorites.length;
  }

  mergeRecommendations(contentBased, collaborative, limit) {
    // Combine recommendations with weights
    const merged = new Map();
    
    // Add content-based recommendations with weight
    contentBased.forEach((property, index) => {
      const id = property._id.toString();
      merged.set(id, {
        property,
        score: (limit - index) * 0.6 // 60% weight for content-based
      });
    });
    
    // Add collaborative recommendations with weight
    collaborative.forEach((property, index) => {
      const id = property._id.toString();
      if (merged.has(id)) {
        merged.get(id).score += (limit - index) * 0.4; // 40% weight for collaborative
      } else {
        merged.set(id, {
          property,
          score: (limit - index) * 0.4
        });
      }
    });
    
    // Sort by combined score
    const sorted = Array.from(merged.values()).sort((a, b) => b.score - a.score);
    
    return sorted.slice(0, limit).map(s => s.property);
  }

  async addExplanations(recommendations, userId) {
    const user = await User.findById(userId);
    const explained = [];
    
    for (const property of recommendations) {
      const reasons = [];
      
      // Check preference matches
      if (user.preferences) {
        if (property.propertyType === user.preferences.propertyType) {
          reasons.push(`Matches your preferred property type: ${property.propertyType}`);
        }
        
        if (user.preferences.priceRange &&
            property.price >= user.preferences.priceRange.min &&
            property.price <= user.preferences.priceRange.max) {
          reasons.push('Within your price range');
        }
        
        if (property.bedrooms >= (user.preferences.bedrooms || 0)) {
          reasons.push(`Has ${property.bedrooms} bedrooms as requested`);
        }
      }
      
      // Check similarity to favorites
      const favorites = await Favorite.find({ user: userId }).populate('property');
      if (favorites.length > 0) {
        const avgPrice = favorites.reduce((sum, f) => sum + f.property.price, 0) / favorites.length;
        if (Math.abs(property.price - avgPrice) < 50000) {
          reasons.push('Similar to properties you\'ve liked');
        }
      }
      
      // Check trending
      const recentViews = await PropertyView.countDocuments({
        property: property._id,
        viewedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      });
      
      if (recentViews > 20) {
        reasons.push('Trending property this week');
      }
      
      explained.push({
        ...property.toObject(),
        recommendationReasons: reasons.length > 0 ? reasons : ['Based on your browsing history'],
        matchScore: Math.round(Math.random() * 20 + 80) // Placeholder score
      });
    }
    
    return explained;
  }

  async getSimilarProperties(propertyId, limit = 6) {
    try {
      const property = await Property.findById(propertyId);
      if (!property) throw new Error('Property not found');
      
      // Find similar properties based on features
      const similar = await Property.find({
        _id: { $ne: propertyId },
        propertyType: property.propertyType,
        price: {
          $gte: property.price * 0.8,
          $lte: property.price * 1.2
        },
        bedrooms: {
          $gte: property.bedrooms - 1,
          $lte: property.bedrooms + 1
        },
        area: {
          $gte: property.area * 0.8,
          $lte: property.area * 1.2
        }
      })
      .limit(limit)
      .sort({ createdAt: -1 });
      
      return similar;
    } catch (error) {
      console.error('Error finding similar properties:', error);
      throw error;
    }
  }

  async getTrendingProperties(location, limit = 10) {
    try {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      // Aggregate view counts
      const trending = await PropertyView.aggregate([
        { $match: { viewedAt: { $gte: oneWeekAgo } } },
        { $group: { _id: '$property', viewCount: { $sum: 1 } } },
        { $sort: { viewCount: -1 } },
        { $limit: limit * 2 }
      ]);
      
      // Get property details
      const propertyIds = trending.map(t => t._id);
      let properties = await Property.find({
        _id: { $in: propertyIds },
        status: 'available'
      });
      
      // Filter by location if provided
      if (location) {
        properties = properties.filter(p => 
          p.location.toLowerCase().includes(location.toLowerCase())
        );
      }
      
      // Add view counts and sort
      const propertiesWithViews = properties.map(property => {
        const trend = trending.find(t => t._id.equals(property._id));
        return {
          ...property.toObject(),
          viewCount: trend ? trend.viewCount : 0,
          trending: true
        };
      });
      
      propertiesWithViews.sort((a, b) => b.viewCount - a.viewCount);
      
      return propertiesWithViews.slice(0, limit);
    } catch (error) {
      console.error('Error fetching trending properties:', error);
      throw error;
    }
  }

  async getNewListings(preferences, limit = 10) {
    try {
      const query = { status: 'available' };
      
      if (preferences) {
        if (preferences.propertyType) query.propertyType = preferences.propertyType;
        if (preferences.location) query.location = new RegExp(preferences.location, 'i');
        if (preferences.priceRange) {
          query.price = {
            $gte: preferences.priceRange.min,
            $lte: preferences.priceRange.max
          };
        }
      }
      
      const newListings = await Property.find(query)
        .sort({ createdAt: -1 })
        .limit(limit);
      
      return newListings.map(property => ({
        ...property.toObject(),
        isNew: true,
        daysOnMarket: Math.floor((Date.now() - property.createdAt) / (1000 * 60 * 60 * 24))
      }));
    } catch (error) {
      console.error('Error fetching new listings:', error);
      throw error;
    }
  }

  async getPriceDropProperties(userId, limit = 10) {
    try {
      // Find properties with recent price reductions
      const properties = await Property.find({
        priceHistory: { $exists: true, $ne: [] },
        status: 'available'
      }).limit(limit * 2);
      
      const priceDrops = [];
      
      for (const property of properties) {
        if (property.priceHistory && property.priceHistory.length > 1) {
          const currentPrice = property.price;
          const previousPrice = property.priceHistory[property.priceHistory.length - 2].price;
          
          if (currentPrice < previousPrice) {
            const dropAmount = previousPrice - currentPrice;
            const dropPercentage = (dropAmount / previousPrice) * 100;
            
            priceDrops.push({
              ...property.toObject(),
              priceDropAmount: dropAmount,
              priceDropPercentage: dropPercentage.toFixed(1),
              previousPrice,
              isPriceDrop: true
            });
          }
        }
      }
      
      // Sort by drop percentage
      priceDrops.sort((a, b) => b.priceDropPercentage - a.priceDropPercentage);
      
      return priceDrops.slice(0, limit);
    } catch (error) {
      console.error('Error fetching price drop properties:', error);
      throw error;
    }
  }
}

export default new RecommendationService();