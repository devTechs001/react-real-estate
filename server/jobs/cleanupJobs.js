import cron from 'node-cron';
import Property from '../models/Property.js';
import PropertyView from '../models/PropertyView.js';
import Notification from '../models/Notification.js';

// Clean up old property views (runs daily at 2 AM)
export const cleanupPropertyViews = cron.schedule('0 2 * * *', async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await PropertyView.deleteMany({
      createdAt: { $lt: thirtyDaysAgo },
    });

    console.log(`✅ Cleaned up ${result.deletedCount} old property views`);
  } catch (error) {
    console.error('❌ Cleanup property views job error:', error);
  }
});

// Clean up old notifications (runs daily at 3 AM)
export const cleanupNotifications = cron.schedule('0 3 * * *', async () => {
  try {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const result = await Notification.deleteMany({
      createdAt: { $lt: ninetyDaysAgo },
      isRead: true,
    });

    console.log(`✅ Cleaned up ${result.deletedCount} old notifications`);
  } catch (error) {
    console.error('❌ Cleanup notifications job error:', error);
  }
});

// Mark expired properties (runs daily at 1 AM)
export const markExpiredProperties = cron.schedule('0 1 * * *', async () => {
  try {
    const result = await Property.updateMany(
      {
        expiryDate: { $lt: new Date() },
        status: 'available',
      },
      {
        status: 'expired',
      }
    );

    console.log(`✅ Marked ${result.modifiedCount} properties as expired`);
  } catch (error) {
    console.error('❌ Mark expired properties job error:', error);
  }
});

export const startCleanupJobs = () => {
  cleanupPropertyViews.start();
  cleanupNotifications.start();
  markExpiredProperties.start();
  console.log('✅ Cleanup jobs started');
};