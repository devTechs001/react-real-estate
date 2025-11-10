import cron from 'node-cron';
import Property from '../models/Property.js';
import PropertyView from '../models/PropertyView.js';
import User from '../models/User.js';

// Generate daily analytics (runs at midnight)
export const generateDailyAnalytics = cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Count new users
    const newUsers = await User.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    // Count new properties
    const newProperties = await Property.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    // Count total views
    const totalViews = await PropertyView.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    console.log('📊 Daily Analytics:');
    console.log(`- New Users: ${newUsers}`);
    console.log(`- New Properties: ${newProperties}`);
    console.log(`- Total Views: ${totalViews}`);

    // Store in database or send to analytics service
  } catch (error) {
    console.error('❌ Daily analytics job error:', error);
  }
});

export const startAnalyticsJobs = () => {
  generateDailyAnalytics.start();
  console.log('✅ Analytics jobs started');
};