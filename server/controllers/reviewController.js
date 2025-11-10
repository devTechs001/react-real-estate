import Review from '../models/Review.js';
import Property from '../models/Property.js';

// @desc    Get property reviews
// @route   GET /api/reviews/property/:propertyId
// @access  Public
export const getPropertyReviews = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const reviews = await Review.find({ property: propertyId })
      .populate('user', 'name avatar')
      .sort('-createdAt');

    // Calculate stats
    const total = reviews.length;
    const average = total > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / total
      : 0;

    const distribution = reviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {});

    res.json({
      reviews,
      stats: {
        total,
        average,
        distribution,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { property, rating, comment } = req.body;

    // Check if property exists
    const propertyExists = await Property.findById(property);
    if (!propertyExists) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      property,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You already reviewed this property' });
    }

    const review = await Review.create({
      property,
      user: req.user._id,
      rating,
      comment,
    });

    await review.populate('user', 'name avatar');

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();
    await review.populate('user', 'name avatar');

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.deleteOne();

    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user reviews
// @route   GET /api/reviews/user/my-reviews
// @access  Private
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('property', 'title images price')
      .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};