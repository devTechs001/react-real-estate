import User from '../models/User.js';
import Property from '../models/Property.js';
import Inquiry from '../models/Inquiry.js';
import Appointment from '../models/Appointment.js';
import Favorite from '../models/Favorite.js';
import { USER_ROLES } from '../config/constants.js';

/**
 * Get dashboard data based on user role
 * @route GET /api/dashboard
 * @access Private
 */
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    switch (userRole) {
      case USER_ROLES.ADMIN:
        return await getAdminDashboardData(req, res);
      case USER_ROLES.AGENT:
        return await getAgentDashboardData(req, res);
      case USER_ROLES.USER:
        return await getUserDashboardData(req, res);
      default:
        return res.status(400).json({ message: 'Invalid user role' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Admin Dashboard Data
 */
const getAdminDashboardData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const pendingProperties = await Property.countDocuments({
      moderationStatus: 'pending',
    });
    const totalInquiries = await Inquiry.countDocuments();

    // Revenue calculation
    // Assuming there's a subscription model - adjust based on actual implementation
    let totalRevenue = 0;
    // const subscriptions = await Subscription.find({ status: 'active' });
    // totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.price, 0);

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

    // Recent activities
    const recentUsers = await User.find()
      .sort('-createdAt')
      .limit(5)
      .select('name email avatar createdAt role');

    const recentProperties = await Property.find()
      .sort('-createdAt')
      .limit(5)
      .select('title location price images owner')
      .populate('owner', 'name email');

    const recentInquiries = await Inquiry.find()
      .sort('-createdAt')
      .limit(5)
      .select('property user message createdAt')
      .populate('property', 'title')
      .populate('user', 'name email');

    res.json({
      role: USER_ROLES.ADMIN,
      stats: {
        totalUsers,
        totalProperties,
        pendingProperties,
        totalInquiries,
        totalRevenue,
      },
      userGrowth,
      propertyByType,
      recentUsers,
      recentProperties,
      recentInquiries,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Agent Dashboard Data
 */
const getAgentDashboardData = async (req, res) => {
  try {
    const agentId = req.user._id;

    // Agent's properties
    const agentProperties = await Property.find({ owner: agentId });
    const publishedProperties = agentProperties.filter(p => p.status === 'available').length;
    const pendingProperties = agentProperties.filter(p => p.moderationStatus === 'pending').length;
    const totalViews = agentProperties.reduce((sum, prop) => sum + (prop.views || 0), 0);

    // Inquiries for agent's properties
    const inquiriesForAgent = await Inquiry.find({ 
      property: { $in: agentProperties.map(p => p._id) } 
    });
    const unreadInquiries = inquiriesForAgent.filter(i => !i.read).length;

    // Appointments for agent's properties
    const appointments = await Appointment.find({
      property: { $in: agentProperties.map(p => p._id) }
    });
    const upcomingAppointments = appointments.filter(a => 
      new Date(a.date) >= new Date() && a.status === 'confirmed'
    ).length;

    // Recent properties
    const recentProperties = await Property.find({ owner: agentId })
      .sort('-createdAt')
      .limit(5)
      .select('title price location status moderationStatus views createdAt');

    // Property performance
    const propertyPerformance = agentProperties.map(property => ({
      title: property.title,
      views: property.views || 0,
      inquiries: inquiriesForAgent.filter(i => i.property.toString() === property._id.toString()).length,
      appointments: appointments.filter(a => a.property.toString() === property._id.toString()).length,
    }));

    res.json({
      role: USER_ROLES.AGENT,
      stats: {
        totalProperties: agentProperties.length,
        publishedProperties,
        pendingProperties,
        totalViews,
        unreadInquiries,
        upcomingAppointments,
      },
      recentProperties,
      propertyPerformance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * User Dashboard Data
 */
const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // User's saved properties
    const savedProperties = await Favorite.find({ user: userId })
      .populate('property', 'title price location images status')
      .populate('property.owner', 'name email');
    
    // User's inquiries
    const userInquiries = await Inquiry.find({ user: userId })
      .populate('property', 'title location')
      .populate('property.owner', 'name email');

    // User's appointments
    const userAppointments = await Appointment.find({ user: userId })
      .populate('property', 'title location')
      .populate('property.owner', 'name email');

    // Recently viewed properties
    // Note: This assumes there's a PropertyView model tracking views
    // If not available, we can skip this or implement later
    let recentlyViewed = [];
    // Uncomment when PropertyView model is available
    // recentlyViewed = await PropertyView.find({ user: userId })
    //   .populate('property', 'title price location images')
    //   .sort('-viewedAt')
    //   .limit(5);

    // Recommended properties based on user's interests
    // This could be based on saved properties, inquiries, or location preferences
    const recommendedProperties = await Property.find({ 
      status: 'available',
      _id: { $nin: savedProperties.map(sp => sp.property._id) }
    })
    .limit(5)
    .select('title price location images owner')
    .populate('owner', 'name');

    res.json({
      role: USER_ROLES.USER,
      stats: {
        savedProperties: savedProperties.length,
        inquiries: userInquiries.length,
        appointments: userAppointments.length,
      },
      savedProperties: savedProperties.map(sp => sp.property),
      inquiries: userInquiries,
      appointments: userAppointments,
      recentlyViewed,
      recommendedProperties,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get dashboard statistics for a specific role
 * @route GET /api/dashboard/stats
 * @access Private
 */
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let stats = {};

    switch (userRole) {
      case USER_ROLES.ADMIN:
        stats = await getAdminStats();
        break;
      case USER_ROLES.AGENT:
        stats = await getAgentStats(userId);
        break;
      case USER_ROLES.USER:
        stats = await getUserStats(userId);
        break;
      default:
        return res.status(400).json({ message: 'Invalid user role' });
    }

    res.json({
      role: userRole,
      stats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper functions for stats
const getAdminStats = async () => {
  const [totalUsers, totalProperties, pendingProperties, totalInquiries] = await Promise.all([
    User.countDocuments(),
    Property.countDocuments(),
    Property.countDocuments({ moderationStatus: 'pending' }),
    Inquiry.countDocuments(),
  ]);

  return {
    totalUsers,
    totalProperties,
    pendingProperties,
    totalInquiries,
  };
};

const getAgentStats = async (agentId) => {
  const agentProperties = await Property.find({ owner: agentId });
  const publishedProperties = agentProperties.filter(p => p.status === 'available').length;
  const pendingProperties = agentProperties.filter(p => p.moderationStatus === 'pending').length;
  const totalViews = agentProperties.reduce((sum, prop) => sum + (prop.views || 0), 0);

  const inquiriesForAgent = await Inquiry.find({ 
    property: { $in: agentProperties.map(p => p._id) } 
  });
  const unreadInquiries = inquiriesForAgent.filter(i => !i.read).length;

  const appointments = await Appointment.find({
    property: { $in: agentProperties.map(p => p._id) }
  });
  const upcomingAppointments = appointments.filter(a => 
    new Date(a.date) >= new Date() && a.status === 'confirmed'
  ).length;

  return {
    totalProperties: agentProperties.length,
    publishedProperties,
    pendingProperties,
    totalViews,
    unreadInquiries,
    upcomingAppointments,
  };
};

const getUserStats = async (userId) => {
  const [savedProperties, inquiries, appointments] = await Promise.all([
    Favorite.countDocuments({ user: userId }),
    Inquiry.countDocuments({ user: userId }),
    Appointment.countDocuments({ user: userId }),
  ]);

  return {
    savedProperties,
    inquiries,
    appointments,
  };
};