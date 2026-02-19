import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

// Helper function to extract first name from full name
const getFirstName = (fullName) => {
  if (!fullName) return '';
  return fullName.split(' ')[0];
};

const SellerOverview = () => {
  const { user } = useAuth();
  const firstName = getFirstName(user?.name);
  const [stats, setStats] = useState({
    totalProperties: 15,
    activeListings: 12,
    inquiries: 24,
    views: 1247
  });
  const [recentListings, setRecentListings] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);

  useEffect(() => {
    // Fetch seller dashboard data
    setRecentListings([
      { id: 1, title: 'Luxury Waterfront Villa', price: '$2,500,000', status: 'active', date: '2024-01-15' },
      { id: 2, title: 'Modern Downtown Penthouse', price: '$1,800,000', status: 'active', date: '2024-01-10' },
      { id: 3, title: 'Cozy Mountain Cabin', price: '$450,000', status: 'sold', date: '2024-01-05' },
    ]);

    setRecentInquiries([
      { id: 1, property: 'Luxury Waterfront Villa', name: 'John Smith', email: 'john@example.com', date: '2024-01-15' },
      { id: 2, property: 'Modern Downtown Penthouse', name: 'Sarah Johnson', email: 'sarah@example.com', date: '2024-01-14' },
      { id: 3, property: 'Luxury Waterfront Villa', name: 'Mike Williams', email: 'mike@example.com', date: '2024-01-12' },
    ]);
  }, []);

  const quickActions = [
    { icon: '🏠', label: 'Add New Property', link: '/seller/properties/new', color: 'blue' },
    { icon: '📊', label: 'View Analytics', link: '/seller/analytics', color: 'green' },
    { icon: '💬', label: 'Inquiries', link: '/seller/inquiries', color: 'purple' },
    { icon: '📅', label: 'Appointments', link: '/seller/appointments', color: 'orange' },
  ];

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
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
          Hello, {firstName || 'Seller'}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Here's your property management dashboard
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Properties', value: stats.totalProperties, icon: '🏠', color: 'blue' },
          { label: 'Active Listings', value: stats.activeListings, icon: '✅', color: 'green' },
          { label: 'Inquiries', value: stats.inquiries, icon: '💬', color: 'purple' },
          { label: 'Views', value: formatNumber(stats.views), icon: '👁️', color: 'orange' },
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

          {/* Recent Listings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Listings</h2>
              <Link to="/seller/properties" className="text-blue-600 text-sm hover:underline">
                View All
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">Property</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentListings.map((listing) => (
                    <tr key={listing.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{listing.title}</td>
                      <td className="py-3 px-4">{listing.price}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          listing.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {listing.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{listing.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Recent Inquiries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Inquiries</h2>
              <Link to="/seller/inquiries" className="text-blue-600 text-sm hover:underline">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">{inquiry.name}</p>
                    <p className="text-sm text-gray-500">{inquiry.email}</p>
                    <p className="text-sm text-gray-500">{inquiry.property}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{inquiry.date}</p>
                    <button className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                      Reply
                    </button>
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
                {firstName?.[0] || 'S'}
              </div>
              <h3 className="font-semibold text-gray-900">
                {user?.name || 'Seller'}
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

          {/* Performance Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <span className="text-sm font-medium">12%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Upgrade Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
          >
            <h3 className="font-semibold mb-2">Premium Features</h3>
            <p className="text-blue-100 text-sm mb-4">
              Boost your listings and reach more buyers.
            </p>
            <button className="w-full py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100">
              Upgrade Now
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SellerOverview;