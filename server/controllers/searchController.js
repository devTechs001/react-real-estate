import Property from '../models/Property.js';
import SavedSearch from '../models/SavedSearch.js';

// @desc    Advanced search
// @route   GET /api/search
// @access  Public
export const advancedSearch = async (req, res) => {
  try {
    const {
      q, // text search
      type,
      listingType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      amenities,
      city,
      state,
      zipCode,
      latitude,
      longitude,
      radius, // in miles
      sortBy = '-createdAt',
      page = 1,
      limit = 12,
    } = req.query;

    let query = { status: 'available' };

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Property type
    if (type) {
      query.propertyType = type;
    }

    // Listing type
    if (listingType) {
      query.listingType = listingType;
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Bedrooms
    if (bedrooms) {
      query.bedrooms = { $gte: Number(bedrooms) };
    }

    // Bathrooms
    if (bathrooms) {
      query.bathrooms = { $gte: Number(bathrooms) };
    }

    // Area range
    if (minArea || maxArea) {
      query.area = {};
      if (minArea) query.area.$gte = Number(minArea);
      if (maxArea) query.area.$lte = Number(maxArea);
    }

    // Amenities
    if (amenities) {
      const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
      query.amenities = { $all: amenitiesArray };
    }

    // Location
    if (city) query.city = new RegExp(city, 'i');
    if (state) query.state = new RegExp(state, 'i');
    if (zipCode) query.zipCode = zipCode;

    // Geospatial search
    if (latitude && longitude && radius) {
      const radiusInRadians = radius / 3963.2; // Earth radius in miles
      query.location = {
        $geoWithin: {
          $centerSphere: [[Number(longitude), Number(latitude)], radiusInRadians],
        },
      };
    }

    // Execute query
    const properties = await Property.find(query)
      .populate('owner', 'name email phone avatar')
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Property.countDocuments(query);

    res.json({
      properties,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
      filters: req.query,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get search suggestions
// @route   GET /api/search/suggestions
// @access  Public
export const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json([]);
    }

    const suggestions = await Property.aggregate([
      {
        $search: {
          index: 'properties',
          autocomplete: {
            query: q,
            path: 'title',
            fuzzy: {
              maxEdits: 2,
            },
          },
        },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          title: 1,
          city: 1,
          state: 1,
          price: 1,
        },
      },
    ]);

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get popular searches
// @route   GET /api/search/popular
// @access  Public
export const getPopularSearches = async (req, res) => {
  try {
    const popularSearches = await SavedSearch.aggregate([
      {
        $group: {
          _id: '$criteria',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json(popularSearches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};