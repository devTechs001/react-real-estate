import Property from '../models/Property.js';
import PropertyView from '../models/PropertyView.js';
import Inquiry from '../models/Inquiry.js';
import Appointment from '../models/Appointment.js';
import Favorite from '../models/Favorite.js';

// @desc    Get seller analytics
// @route   GET /api/analytics/seller
// @access  Private
export const getSellerAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const properties = await Property.find({ owner: req.user._id });
    const propertyIds = properties.map((p) => p._id);

    // Total views
    const totalViews = await PropertyView.countDocuments({
      property: { $in: propertyIds },
      createdAt: { $gte: startDate },
    });

    // Total favorites
    const totalFavorites = await Favorite.countDocuments({
      property: { $in: propertyIds },
      createdAt: { $gte: startDate },
    });

    // Total inquiries
    const totalInquiries = await Inquiry.countDocuments({
      property: { $in: propertyIds },
      createdAt: { $gte: startDate },
    });

    // Total appointments
    const totalAppointments = await Appointment.countDocuments({
      property: { $in: propertyIds },
      createdAt: { $gte: startDate },
    });

    // Views over time
    const viewsOverTime = await PropertyView.aggregate([
      {
        $match: {
          property: { $in: propertyIds },
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Top performing properties
    const topProperties = await Promise.all(
      properties.map(async (property) => {
        const views = await PropertyView.countDocuments({ property: property._id });
        const favorites = await Favorite.countDocuments({ property: property._id });
        const inquiries = await Inquiry.countDocuments({ property: property._id });

        return {
          _id: property._id,
          title: property.title,
          views,
          favorites,
          inquiries,
        };
      })
    );

    topProperties.sort((a, b) => b.views - a.views);

    // Status distribution
    const statusDistribution = [
      properties.filter((p) => p.status === 'available').length,
      properties.filter((p) => p.status === 'pending').length,
      properties.filter((p) => p.status === 'sold').length,
      properties.filter((p) => p.status === 'rented').length,
    ];

    res.json({
      totalViews,
      totalFavorites,
      totalInquiries,
      totalAppointments,
      viewsOverTime,
      topProperties: topProperties.slice(0, 5),
      statusDistribution,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track property view
// @route   POST /api/analytics/track-view/:propertyId
// @access  Public
export const trackPropertyView = async (req, res) => {
  try {
    const { propertyId } = req.params;

    await PropertyView.create({
      property: propertyId,
      user: req.user?._id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    // Increment property view count
    await Property.findByIdAndUpdate(propertyId, { $inc: { views: 1 } });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};