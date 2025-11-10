import Favorite from '../models/Favorite.js';
import Property from '../models/Property.js';

// @desc    Add to favorites
// @route   POST /api/favorites
// @access  Private
export const addFavorite = async (req, res) => {
  try {
    const { propertyId, notes, tags } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      property: propertyId,
    });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Property already in favorites' });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      property: propertyId,
      notes,
      tags,
    });

    await favorite.populate('property', 'title images price location');

    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get favorites
// @route   GET /api/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate('property')
      .sort('-createdAt');

    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove favorite
// @route   DELETE /api/favorites/:propertyId
// @access  Private
export const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      property: req.params.propertyId,
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update favorite
// @route   PUT /api/favorites/:id
// @access  Private
export const updateFavorite = async (req, res) => {
  try {
    const { notes, tags } = req.body;

    const favorite = await Favorite.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { notes, tags },
      { new: true }
    ).populate('property');

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.json(favorite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if property is favorited
// @route   GET /api/favorites/check/:propertyId
// @access  Private
export const checkFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      user: req.user._id,
      property: req.params.propertyId,
    });

    res.json({ isFavorited: !!favorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};