// client/src/pages/user/DashboardHome.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    savedProperties: 12,
    activeInquiries: 5,
    upcomingTours: 3,
    viewedProperties: 47
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'view', property: 'Luxury Waterfront Villa', time: '2 hours ago' },
    { id: 2, type: 'inquiry', property: 'Modern Downtown Penthouse', time: '1 day ago' },
    { id: 3, type: 'save', property: 'Cozy Studio Apartment', time: '2 days ago' },
  ]);

  const [recommendations, setRecommendations] = useState([
    { id: 1, title: 'Modern Condo', price: 450000, location: 'Miami, FL', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400', match: 95 },
    { id: 2, title: 'Luxury Apartment', price: 520000, location: 'New York, NY', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400', match: 92 },
    { id: 3, title: 'Family Home', price: 380000, location: 'Austin, TX', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', match: 88 },
  ]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'view': return '👁️';
      case 'inquiry': return '💬';
      case 'save': return '❤️';
      default: return '📋';
    }
  };

  return (
    <>
      <SEO title="Dashboard - HomeScape" />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back! 👋</h1>
        <p className="text-gray-600">Here's what's happening with your property search</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Saved Properties', value: stats.savedProperties, icon: '❤️', color: 'red', link: '/favorites' },
          { label: 'Active Inquiries', value: stats.activeInquiries, icon: '💬', color: 'blue', link: '/inquiries' },
          { label: 'Upcoming Tours', value: stats.upcomingTours, icon: '📅', color: 'green', link: '/appointments' },
          { label: 'Properties Viewed', value: stats.viewedProperties, icon: '👁️', color: 'purple', link: '#' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={stat.link}
              className="block bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{stat.icon}</span>
                <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-gray-600">{stat.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* AI Recommendations */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">AI Recommendations</h2>
                <p className="text-sm text-gray-500">Based on your preferences</p>
              </div>
              <Link to="/properties" className="text-blue-600 text-sm hover:underline">
                View All
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {recommendations.map((property) => (
                <Link
                  key={property.id}
                  to={`/properties/${property.id}`}
                  className="group"
                >
                  <div className="relative rounded-xl overflow-hidden mb-3">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
                      {property.match}% Match
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-500">{property.location}</p>
                  <p className="text-blue-600 font-semibold">
                    ${property.price.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <span className="text-xl">{getActivityIcon(activity.type)}</span>
                  <div>
                    <p className="text-sm text-gray-900">
                      {activity.type === 'view' && 'Viewed '}
                      {activity.type === 'inquiry' && 'Inquired about '}
                      {activity.type === 'save' && 'Saved '}
                      <span className="font-medium">{activity.property}</span>
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-1">Find Your Dream Home Today</h3>
            <p className="text-blue-100">Browse thousands of verified properties</p>
          </div>
          <Link
            to="/properties"
            className="px-6 py-3 bg-white text-blue-600 rounded-xl font-medium hover:bg-gray-100 transition-colors"
          >
            Start Searching
          </Link>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;