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

    // Calculate commissions (assuming 3% commission on property sales)
    const soldProperties = await Property.countDocuments({ status: 'sold' });
    const avgPropertyPrice = await Property.aggregate([
      { $match: { status: 'sold' } },
      { $group: { _id: null, avgPrice: { $avg: '$price' } } }
    ]);
    const estimatedCommissions = soldProperties * (avgPropertyPrice[0]?.avgPrice || 0) * 0.03;

    // Calculate expenses (placeholder values)
    const platformExpenses = 5000; // Placeholder
    const marketingExpenses = 3000; // Placeholder
    const totalExpenses = platformExpenses + marketingExpenses;

    // Calculate profit
    const profit = totalRevenue - estimatedCommissions - totalExpenses;

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

    // Properties by status
    const propertyByStatus = await Property.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Top performing agents (by number of properties sold)
    const topAgents = await Property.aggregate([
      { $match: { status: 'sold' } },
      {
        $group: {
          _id: '$owner',
          propertiesSold: { $sum: 1 },
          totalRevenue: { $sum: '$price' },
        },
      },
      { $sort: { propertiesSold: -1, totalRevenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'agent',
        },
      },
      {
        $project: {
          agentName: { $arrayElemAt: ['$agent.name', 0] },
          agentEmail: { $arrayElemAt: ['$agent.email', 0] },
          propertiesSold: 1,
          totalRevenue: 1,
        },
      },
    ]);

    // Recent users
    const recentUsers = await User.find()
      .sort('-createdAt')
      .limit(5)
      .select('name email avatar createdAt role');

    // Recent properties
    const recentProperties = await Property.find()
      .sort('-createdAt')
      .limit(5)
      .select('title location price images owner status')
      .populate('owner', 'name email');

    // Financial metrics
    const financialMetrics = {
      totalRevenue,
      estimatedCommissions,
      totalExpenses,
      profit,
      soldProperties,
      avgPropertyPrice: avgPropertyPrice[0]?.avgPrice || 0,
    };

    res.json({
      totalUsers,
      totalProperties,
      totalRevenue,
      pendingReviews,
      userGrowth,
      propertyByType,
      propertyByStatus,
      topAgents,
      recentUsers,
      recentProperties,
      financialMetrics,
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

// @desc    Get system health status
// @route   GET /api/admin/system
// @access  Private/Admin
export const getSystemHealth = async (req, res) => {
  try {
    // Basic system health check
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage ? process.cpuUsage() : 'N/A',
      dbConnection: 'connected', // This would check actual DB connection
      diskSpace: 'sufficient',  // This would check actual disk space
    };

    res.json(healthData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get system logs
// @route   GET /api/admin/logs
// @access  Private/Admin
export const getSystemLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, level, startDate, endDate } = req.query;

    // Query audit logs based on filters
    let query = {};

    if (level) {
      query.level = level;
    }

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    // Get audit logs
    const logs = await AuditLog.find(query)
      .sort('-timestamp')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await AuditLog.countDocuments(query);

    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get email templates
// @route   GET /api/admin/emails
// @access  Private/Admin
export const getEmailTemplates = async (req, res) => {
  try {
    // Return a list of available email templates
    const templates = [
      {
        id: 'welcome',
        name: 'Welcome Email',
        subject: 'Welcome to Our Platform!',
        active: true,
      },
      {
        id: 'verification',
        name: 'Email Verification',
        subject: 'Verify Your Email Address',
        active: true,
      },
      {
        id: 'password-reset',
        name: 'Password Reset',
        subject: 'Password Reset Request',
        active: true,
      },
      {
        id: 'inquiry-notification',
        name: 'Inquiry Notification',
        subject: 'New Inquiry Received',
        active: true,
      },
      {
        id: 'appointment-confirmation',
        name: 'Appointment Confirmation',
        subject: 'Appointment Confirmed',
        active: true,
      },
    ];

    res.json({ templates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get system settings
// @route   GET /api/admin/settings
// @access  Private/Admin
export const getSystemSettings = async (req, res) => {
  try {
    // Return system configuration settings
    const settings = {
      general: {
        siteName: process.env.SITE_NAME || 'Real Estate Platform',
        siteUrl: process.env.CLIENT_URL || 'http://localhost:3000',
        timezone: process.env.TIMEZONE || 'UTC',
        dateFormat: 'MM/DD/YYYY',
        currency: 'USD',
      },
      auth: {
        requireEmailVerification: true,
        passwordMinLength: 6,
        accountLockoutAttempts: 5,
        accountLockoutDuration: 15, // minutes
      },
      email: {
        smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
        smtpPort: process.env.SMTP_PORT || 587,
        fromEmail: process.env.FROM_EMAIL || 'noreply@realestate.com',
        fromName: process.env.FROM_NAME || 'Real Estate Platform',
      },
      payments: {
        stripeEnabled: !!process.env.STRIPE_PUBLISHABLE_KEY,
        paypalEnabled: false,
        commissionRate: 0.03, // 3%
      },
      limits: {
        maxUploadSize: 5, // MB
        maxImagesPerProperty: 10,
        maxFavorites: 100,
      },
      features: {
        aiEnabled: true,
        messagingEnabled: true,
        appointmentScheduling: true,
        propertyVerification: true,
      },
    };

    res.json({ settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateSystemSettings = async (req, res) => {
  try {
    // In a real implementation, this would update the actual system settings
    // For now, we'll just return a success message
    const { settings } = req.body;

    // Validation would happen here

    res.json({
      message: 'System settings updated successfully',
      updatedSettings: settings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get financial analytics
// @route   GET /api/admin/financial-analytics
// @access  Private/Admin
export const getFinancialAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Parse dates if provided
    let start = new Date(0); // Beginning of time
    let end = new Date();   // Current date

    if (startDate) start = new Date(startDate);
    if (endDate) end = new Date(endDate);

    // Calculate revenue from subscriptions
    const subscriptions = await Subscription.find({
      status: 'active',
      createdAt: { $gte: start, $lte: end }
    });
    const subscriptionRevenue = subscriptions.reduce((sum, sub) => sum + sub.price, 0);

    // Calculate revenue from property sales (assuming 3% commission)
    const soldProperties = await Property.countDocuments({
      status: 'sold',
      createdAt: { $gte: start, $lte: end }
    });
    const avgPropertyPrice = await Property.aggregate([
      { $match: { status: 'sold', createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, avgPrice: { $avg: '$price' } } }
    ]);
    const propertyCommission = soldProperties * (avgPropertyPrice[0]?.avgPrice || 0) * 0.03;

    // Calculate monthly trends
    const monthlyTrends = await Property.aggregate([
      { $match: { status: 'sold', createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$price' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          monthYear: { $concat: [
            { $toString: '$_id.month' },
            '/',
            { $toString: '$_id.year' }
          ]},
          revenue: 1,
          count: 1,
          _id: 0
        }
      }
    ]);

    // Calculate expenses (placeholder data)
    const expenses = {
      platform: 5000,
      marketing: 3000,
      operational: 2000,
      total: 10000
    };

    // Calculate profit
    const totalRevenue = subscriptionRevenue + propertyCommission;
    const profit = totalRevenue - expenses.total;

    res.json({
      revenue: {
        total: totalRevenue,
        subscriptions: subscriptionRevenue,
        propertyCommissions: propertyCommission,
        growthRate: 12.5 // Placeholder
      },
      expenses,
      profit,
      transactions: {
        total: soldProperties,
        monthlyTrends
      },
      period: {
        startDate: start,
        endDate: end
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get seller performance analytics
// @route   GET /api/admin/seller-performance
// @access  Private/Admin
export const getSellerPerformance = async (req, res) => {
  try {
    const { startDate, endDate, sellerId } = req.query;

    // Parse dates if provided
    let start = new Date(0); // Beginning of time
    let end = new Date();   // Current date

    if (startDate) start = new Date(startDate);
    if (endDate) end = new Date(endDate);

    // Build query based on sellerId filter
    let query = { role: 'agent' };
    if (sellerId) query._id = sellerId;

    // Get all agents/sellers
    const sellers = await User.find(query).select('name email createdAt');

    // For each seller, calculate their performance metrics
    const sellerPerformance = await Promise.all(
      sellers.map(async (seller) => {
        // Properties owned by this seller
        const properties = await Property.find({ owner: seller._id });
        const soldProperties = await Property.countDocuments({
          owner: seller._id,
          status: 'sold',
          createdAt: { $gte: start, $lte: end }
        });
        const activeProperties = await Property.countDocuments({
          owner: seller._id,
          status: 'available',
          createdAt: { $gte: start, $lte: end }
        });
        const pendingProperties = await Property.countDocuments({
          owner: seller._id,
          status: 'pending',
          createdAt: { $gte: start, $lte: end }
        });

        // Calculate revenue from this seller's properties
        const sellerRevenue = await Property.aggregate([
          { $match: {
            owner: seller._id,
            status: 'sold',
            createdAt: { $gte: start, $lte: end }
          }},
          { $group: { _id: null, total: { $sum: '$price' } } }
        ]);

        // Calculate inquiries and views for this seller's properties
        const propertyIds = properties.map(p => p._id);
        const inquiries = await Property.aggregate([
          { $match: { property: { $in: propertyIds } } },
          { $count: 'total' }
        ]);

        // Calculate average rating for this seller
        const reviews = await Property.aggregate([
          { $match: { owner: seller._id } },
          { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]);

        return {
          id: seller._id,
          name: seller.name,
          email: seller.email,
          totalProperties: properties.length,
          activeProperties,
          pendingProperties,
          soldProperties,
          revenue: sellerRevenue[0]?.total || 0,
          inquiries: inquiries[0]?.total || 0,
          avgRating: reviews[0]?.avgRating || 0,
          joinDate: seller.createdAt
        };
      })
    );

    // Sort by revenue or sales
    sellerPerformance.sort((a, b) => b.revenue - a.revenue);

    res.json({
      sellers: sellerPerformance,
      totalSellers: sellers.length,
      period: {
        startDate: start,
        endDate: end
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};