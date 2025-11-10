import SavedSearch from '../models/SavedSearch.js';
import Property from '../models/Property.js';
import { sendEmail } from '../utils/emailService.js';

// @desc    Create saved search
// @route   POST /api/saved-searches
// @access  Private
export const createSavedSearch = async (req, res) => {
  try {
    const { name, criteria, emailAlerts, frequency } = req.body;

    const savedSearch = await SavedSearch.create({
      user: req.user._id,
      name,
      criteria,
      emailAlerts,
      frequency,
    });

    res.status(201).json(savedSearch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's saved searches
// @route   GET /api/saved-searches
// @access  Private
export const getSavedSearches = async (req, res) => {
  try {
    const searches = await SavedSearch.find({
      user: req.user._id,
      active: true,
    }).sort('-createdAt');

    res.json(searches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update saved search
// @route   PUT /api/saved-searches/:id
// @access  Private
export const updateSavedSearch = async (req, res) => {
  try {
    const savedSearch = await SavedSearch.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!savedSearch) {
      return res.status(404).json({ message: 'Saved search not found' });
    }

    res.json(savedSearch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete saved search
// @route   DELETE /api/saved-searches/:id
// @access  Private
export const deleteSavedSearch = async (req, res) => {
  try {
    const savedSearch = await SavedSearch.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!savedSearch) {
      return res.status(404).json({ message: 'Saved search not found' });
    }

    res.json({ message: 'Saved search deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get matching properties for saved search
// @route   GET /api/saved-searches/:id/matches
// @access  Private
export const getMatchingProperties = async (req, res) => {
  try {
    const savedSearch = await SavedSearch.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!savedSearch) {
      return res.status(404).json({ message: 'Saved search not found' });
    }

    const query = {};
    const { criteria } = savedSearch;

    if (criteria.propertyType) query.propertyType = criteria.propertyType;
    if (criteria.listingType) query.listingType = criteria.listingType;
    if (criteria.city) query.city = new RegExp(criteria.city, 'i');
    if (criteria.minPrice || criteria.maxPrice) {
      query.price = {};
      if (criteria.minPrice) query.price.$gte = criteria.minPrice;
      if (criteria.maxPrice) query.price.$lte = criteria.maxPrice;
    }
    if (criteria.bedrooms) query.bedrooms = { $gte: criteria.bedrooms };
    if (criteria.bathrooms) query.bathrooms = { $gte: criteria.bathrooms };

    const properties = await Property.find(query)
      .populate('owner', 'name email')
      .limit(20)
      .sort('-createdAt');

    // Update match count
    savedSearch.matchCount = properties.length;
    await savedSearch.save();

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};