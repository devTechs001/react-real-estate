import User from '../models/User.js';
import Property from '../models/Property.js';
import Favorite from '../models/Favorite.js';
import { sanitizeUser } from '../utils/helpers.js';

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's properties count
    const propertiesCount = await Property.countDocuments({ owner: user._id });

    // Get user's stats
    const stats = {
      propertiesCount,
      joinedDate: user.createdAt,
      isVerified: user.isVerified,
    };

    res.json({
      user: sanitizeUser(user),
      stats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's public properties
// @route   GET /api/users/:id/properties
// @access  Public
export const getUserProperties = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;

    const properties = await Property.find({
      owner: req.params.id,
      status: 'available',
    })
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Property.countDocuments({
      owner: req.params.id,
      status: 'available',
    });

    res.json({
      properties,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
export const updatePreferences = async (req, res) => {
  try {
    const { emailNotifications, smsNotifications, newsletter, theme } = req.body;

    const user = await User.findById(req.user._id);

    user.preferences = {
      emailNotifications: emailNotifications ?? user.preferences?.emailNotifications ?? true,
      smsNotifications: smsNotifications ?? user.preferences?.smsNotifications ?? false,
      newsletter: newsletter ?? user.preferences?.newsletter ?? true,
      theme: theme ?? user.preferences?.theme ?? 'light',
    };

    await user.save();

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard-stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [propertiesCount, favoritesCount, viewsCount] = await Promise.all([
      Property.countDocuments({ owner: userId }),
      Favorite.countDocuments({ user: userId }),
      Property.aggregate([
        { $match: { owner: userId } },
        { $group: { _id: null, totalViews: { $sum: '$views' } } },
      ]),
    ]);

    const recentProperties = await Property.find({ owner: userId })
      .sort('-createdAt')
      .limit(5)
      .select('title price images createdAt');

    res.json({
      propertiesCount,
      favoritesCount,
      totalViews: viewsCount[0]?.totalViews || 0,
      recentProperties,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Follow user
// @route   POST /api/users/:id/follow
// @access  Private
export const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    if (currentUser.following?.includes(req.params.id)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    currentUser.following = currentUser.following || [];
    currentUser.following.push(req.params.id);
    await currentUser.save();

    userToFollow.followers = userToFollow.followers || [];
    userToFollow.followers.push(req.user._id);
    await userToFollow.save();

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unfollow user
// @route   DELETE /api/users/:id/follow
// @access  Private
export const unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== req.params.id
    );
    await currentUser.save();

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    await userToUnfollow.save();

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};