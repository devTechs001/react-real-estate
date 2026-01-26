// client/src/pages/seller/SellerHome.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import SEO from '../../components/common/SEO';
import { useAuth } from '../../hooks/useAuth';

const SellerHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProperties: 12,
    activeListings: 8,
    totalViews: 15420,
    totalInquiries: 156,
    scheduledTours: 23,
    conversionRate: 14.8
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [topProperties, setTopProperties] = useState([]);

  useEffect(() => {
    // Fetch seller dashboard data
    setRecentActivity([
      { id: 1, type: 'inquiry', property: 'Luxury Villa', user: 'John D.', time: '5 min ago' },
      { id: 2, type: 'view', property: 'Downtown Penthouse', count: 15, time: '1 hour ago' },
      { id: 3, type: 'tour', property: 'Beach House', user: 'Sarah M.', time: '2 hours ago' },
      { id: 4, type: 'favorite', property: 'Mountain Cabin', count: 8, time: '3 hours ago' },
    ]);

    setTopProperties([
      { id: 1, title: 'Luxury Waterfront Villa', views: 2450, inquiries: 32, image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400' },
      { id: 2, title: 'Modern Downtown Penthouse', views: 1890, inquiries: 28, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400' },
      { id: 3, title: 'Cozy Mountain Cabin', views: 1560, inquiries: 21, image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400' },
    ]);
  }, []);

  const quickActions = [
    { icon: '➕', label: 'Add Property', link: '/seller/properties/new', color: 'blue' },
    { icon: '📊', label: 'View Analytics', link: '/seller/analytics', color: 'purple' },
    { icon: '💬', label: 'Messages', link: '/seller/messages', color: 'green' },
    { icon: '💳', label: 'Subscription', link: '/seller/subscriptions', color: 'orange' },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'inquiry': return '💬';
      case 'view': return '👁️';
      case 'tour': return '📅';
      case 'favorite': return '❤️';
      default: return '📋';
    }
  };

  return (
    <>
      <SEO title="Seller Dashboard - HomeScape" description="Manage your property listings" />

      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.firstName || 'Seller'}! 👋
                </h1>
                <p className="text-gray-600 mt-1">
                  Here's an overview of your property listings
                </p>
              </div>
              <Link
                to="/seller/properties/new"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
              >
                <span>➕</span> Add New Property
              </Link>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: 'Total Properties', value: stats.totalProperties, icon: '🏠', color: 'blue' },
              { label: 'Active Listings', value: stats.activeListings, icon: '✅', color: 'green' },
              { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: '👁️', color: 'purple' },
              { label: 'Total Inquiries', value: stats.totalInquiries, icon: '💬', color: 'orange' },
              { label: 'Scheduled Tours', value: stats.scheduledTours, icon: '📅', color: 'teal' },
              { label: 'Conversion Rate', value: `${stats.conversionRate}%`, icon: '📈', color: 'pink' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      to={action.link}
                      className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-3xl mb-2">{action.icon}</span>
                      <span className="text-sm text-gray-700 text-center">{action.label}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Top Performing Properties */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Top Performing Properties</h2>
                  <Link to="/seller/analytics" className="text-blue-600 text-sm hover:underline">
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {topProperties.map((property, index) => (
                    <div key={property.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50">
                      <span className="text-lg font-bold text-gray-400 w-6">#{index + 1}</span>
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{property.title}</h3>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>👁️ {property.views.toLocaleString()} views</span>
                          <span>💬 {property.inquiries} inquiries</span>
                        </div>
                      </div>
                      <Link
                        to={`/seller/properties/${property.id}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Manage
                      </Link>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Performance Chart Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Views & Inquiries Trend</h2>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <span className="text-4xl block mb-2">📊</span>
                    <p>Chart visualization would go here</p>
                    <p className="text-sm">Integrate with Chart.js or Recharts</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <span className="text-xl">{getActivityIcon(activity.type)}</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          {activity.type === 'inquiry' && (
                            <><strong>{activity.user}</strong> inquired about <strong>{activity.property}</strong></>
                          )}
                          {activity.type === 'view' && (
                            <><strong>{activity.property}</strong> received {activity.count} new views</>
                          )}
                          {activity.type === 'tour' && (
                            <><strong>{activity.user}</strong> scheduled a tour for <strong>{activity.property}</strong></>
                          )}
                          {activity.type === 'favorite' && (
                            <><strong>{activity.property}</strong> was saved {activity.count} times</>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 text-blue-600 text-sm hover:underline">
                  View All Activity
                </button>
              </motion.div>

              {/* Subscription Status */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Pro Plan</h3>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs">Active</span>
                </div>
                <div className="mb-4">
                  <p className="text-blue-100 text-sm">Listings Used</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-white rounded-full" />
                    </div>
                    <span className="text-sm">8/12</span>
                  </div>
                </div>
                <p className="text-blue-100 text-sm mb-4">Renews on Feb 15, 2024</p>
                <Link
                  to="/seller/subscriptions"
                  className="block w-full py-2 bg-white text-blue-600 text-center rounded-lg font-medium hover:bg-gray-100"
                >
                  Manage Subscription
                </Link>
              </motion.div>

              {/* Tips */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h3 className="font-semibold text-gray-900 mb-4">💡 Seller Tips</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>• Add high-quality photos to increase views by 40%</p>
                  <p>• Complete all property details for better search ranking</p>
                  <p>• Respond to inquiries within 24 hours</p>
                  <p>• Update prices regularly based on market trends</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default SellerHome;