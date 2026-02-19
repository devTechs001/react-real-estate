import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { dashboardService } from '../../services/dashboardService';
import toast from 'react-hot-toast';
import '../../styles/user/DashboardHome.css';

// Helper function to extract first name from full name
const getFirstName = (fullName) => {
  if (!fullName) return '';
  return fullName.split(' ')[0];
};

const DashboardHome = () => {
  const { user } = useAuth();
  const firstName = getFirstName(user?.name);

  const [stats, setStats] = useState({
    savedProperties: 0,
    inquiries: 0,
    appointments: 0,
    viewedProperties: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Try to get dashboard data from the new endpoint first
      const dashboardData = await dashboardService.getDashboardData();
      if (dashboardData.role === 'user') {
        setStats(dashboardData.stats);

        // Map the received data to the format expected by the UI
        if (dashboardData.savedProperties) {
          setRecommendations(dashboardData.savedProperties.slice(0, 3).map(prop => ({
            id: prop._id,
            title: prop.title,
            price: prop.price,
            location: prop.location,
            image: prop.images?.[0] || 'https://via.placeholder.com/400x300',
            match: 85 // Default match percentage
          })));
        }

        if (dashboardData.inquiries) {
          setRecentActivity(dashboardData.inquiries.slice(0, 4).map((inquiry, idx) => ({
            id: idx + 1,
            type: 'inquiry',
            property: inquiry.property?.title || 'Unknown Property',
            time: new Date(inquiry.createdAt).toLocaleDateString()
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');

      // Fallback to default values
      setRecentActivity([
        { id: 1, type: 'view', property: 'Luxury Waterfront Villa', time: '2 hours ago' },
        { id: 2, type: 'inquiry', property: 'Modern Downtown Penthouse', time: '1 day ago' },
        { id: 3, type: 'save', property: 'Cozy Studio Apartment', time: '2 days ago' },
        { id: 4, type: 'appointment', property: 'Beachfront Paradise', time: '3 days ago' },
      ]);

      setRecommendations([
        {
          id: 1,
          title: 'Modern Condo with City Views',
          price: 450000,
          location: 'Miami, FL',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
          match: 95
        },
        {
          id: 2,
          title: 'Luxury Apartment Complex',
          price: 520000,
          location: 'New York, NY',
          image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
          match: 92
        },
        {
          id: 3,
          title: 'Suburban Family Home',
          price: 380000,
          location: 'Austin, TX',
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
          match: 88
        },
      ]);
    }
  };

  const quickActions = [
    { icon: '🔍', label: 'Search Properties', link: '/properties', color: 'blue' },
    { icon: '❤️', label: 'View Favorites', link: '/favorites', color: 'red' },
    { icon: '📅', label: 'My Appointments', link: '/appointments', color: 'green' },
    { icon: '💬', label: 'Messages', link: '/inquiries', color: 'purple' },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'view': return '👁️';
      case 'inquiry': return '💬';
      case 'save': return '❤️';
      case 'appointment': return '📅';
      default: return '📋';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {firstName || 'User'}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your property search
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Saved Properties', value: stats.savedProperties, icon: '❤️', color: 'red' },
          { label: 'Active Inquiries', value: stats.inquiries, icon: '💬', color: 'blue' },
          { label: 'Upcoming Tours', value: stats.appointments, icon: '📅', color: 'green' },
          { label: 'Properties Viewed', value: stats.viewedProperties, icon: '👁️', color: 'purple' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</span>
            </div>
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

          {/* AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
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
                  <div className="relative rounded-xl overflow-hidden mb-2">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                      {property.match}% Match
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm group-hover:text-blue-600 line-clamp-1">
                    {property.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{property.location}</p>
                  <p className="text-blue-600 font-semibold">
                    ${property.price.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                  <div className="flex-1">
                    <p className="text-gray-900">
                      {activity.type === 'view' && 'Viewed '}
                      {activity.type === 'inquiry' && 'Sent inquiry for '}
                      {activity.type === 'save' && 'Saved '}
                      {activity.type === 'appointment' && 'Scheduled tour for '}
                      <span className="font-medium">{activity.property}</span>
                    </p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                {firstName?.[0] || 'U'}
              </div>
              <h3 className="font-semibold text-gray-900">
                {user?.name || 'User'}
              </h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <Link
                to="/profile"
                className="mt-4 inline-block text-blue-600 text-sm hover:underline"
              >
                Edit Profile
              </Link>
            </div>
          </motion.div>

          {/* Saved Searches */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Saved Searches</h3>
            <div className="space-y-3">
              {[
                { name: 'Miami Beach Condos', count: 24 },
                { name: '3+ Bed Houses NYC', count: 18 },
                { name: 'Under $500K Austin', count: 31 },
              ].map((search, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700 text-sm">{search.name}</span>
                  <span className="text-xs text-gray-500">{search.count} new</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-blue-600 text-sm hover:underline">
              Manage Searches
            </button>
          </motion.div>

          {/* Upgrade Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
          >
            <h3 className="font-semibold mb-2">Upgrade to Pro</h3>
            <p className="text-blue-100 text-sm mb-4">
              Get unlimited favorites, priority support, and more.
            </p>
            <button className="w-full py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100">
              Learn More
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;