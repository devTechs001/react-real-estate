import User from '../models/User.js';
import Property from '../models/Property.js';
import Subscription from '../models/Subscription.js';
import AuditLog from '../models/Auditlog.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const pendingReviews = await Property.countDocuments({
      moderationStatus: 'pending',
    });

    // Calculate revenue
    const subscriptions = await Subscription.find({ status: 'active' });
    const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.price, 0);

    // User growth (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          month: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Properties by type
    const propertyByType = await Property.aggregate([
      {
        $group: {
          _id: '$propertyType',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          type: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Recent users
    const recentUsers = await User.find()
      .sort('-createdAt')
      .limit(5)
      .select('name email avatar createdAt');

    // Recent properties
    const recentProperties = await Property.find()
      .sort('-createdAt')
      .limit(5)
      .select('title location price images');

    res.json({
      totalUsers,
      totalProperties,
      totalRevenue,
      pendingReviews,
      userGrowth,
      propertyByType,
      recentUsers,
      recentProperties,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const query = role ? { role } : {};

    const users = await User.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password');

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log action
    await AuditLog.create({
      user: req.user._id,
      action: 'user_role_update',
      resource: 'User',
      resourceId: user._id,
      details: { oldRole: user.role, newRole: role },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await AuditLog.create({
      user: req.user._id,
      action: 'user_status_update',
      resource: 'User',
      resourceId: user._id,
      details: { isActive },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's properties
    await Property.deleteMany({ owner: user._id });

    await user.deleteOne();

    await AuditLog.create({
      user: req.user._id,
      action: 'user_delete',
      resource: 'User',
      resourceId: user._id,
      details: { deletedUser: user.email },
    });

    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all properties for moderation
// @route   GET /api/admin/properties
// @access  Private/Admin
export const getProperties = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { moderationStatus: status } : {};

    const properties = await Property.find(query)
      .populate('owner', 'name email')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Property.countDocuments(query);

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

// @desc    Approve property
// @route   PUT /api/admin/properties/:id/approve
// @access  Private/Admin
export const approveProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { moderationStatus: 'approved' },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await AuditLog.create({
      user: req.user._id,
      action: 'property_approve',
      resource: 'Property',
      resourceId: property._id,
    });

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject property
// @route   PUT /api/admin/properties/:id/reject
// @access  Private/Admin
export const rejectProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { moderationStatus: 'rejected' },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await AuditLog.create({
      user: req.user._id,
      action: 'property_reject',
      resource: 'Property',
      resourceId: property._id,
    });

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/admin/properties/:id
// @access  Private/Admin
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await property.deleteOne();

    await AuditLog.create({
      user: req.user._id,
      action: 'property_delete',
      resource: 'Property',
      resourceId: property._id,
    });

    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};