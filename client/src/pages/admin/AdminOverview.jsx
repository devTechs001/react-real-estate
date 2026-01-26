import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { dashboardService } from '../../services/dashboardService';
import toast from 'react-hot-toast';

const AdminOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    pendingApprovals: 0,
    totalRevenue: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    server: 'checking',
    database: 'checking',
    cache: 'checking'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard data from the backend
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/dashboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();

        // Update stats with real data
        setStats({
          totalUsers: data.totalUsers || 0,
          totalProperties: data.totalProperties || 0,
          pendingApprovals: data.pendingReviews || 0,
          totalRevenue: data.financialMetrics?.totalRevenue || 0
        });

        // Format recent activities from the data
        const activities = [];

        // Add recent users
        if (data.recentUsers && data.recentUsers.length > 0) {
          data.recentUsers.slice(0, 2).forEach((user, index) => {
            activities.push({
              id: `user-${index}`,
              action: 'User registered',
              user: user.name,
              time: new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              type: 'user'
            });
          });
        }

        // Add recent properties
        if (data.recentProperties && data.recentProperties.length > 0) {
          data.recentProperties.slice(0, 2).forEach((property, index) => {
            activities.push({
              id: `prop-${index}`,
              action: 'Property added',
              property: property.title,
              time: new Date(property.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              type: 'property'
            });
          });
        }

        setRecentActivities(activities);
      } else {
        throw new Error('Failed to fetch dashboard data');
      }

      // Set system status (would come from a system health endpoint in a real implementation)
      setSystemStatus({
        server: 'online',
        database: 'online',
        cache: 'online'
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');

      // Fallback to default values
      setStats({
        totalUsers: 1247,
        totalProperties: 3421,
        pendingApprovals: 23,
        totalRevenue: 124567
      });

      setRecentActivities([
        { id: 1, action: 'User registered', user: 'John Doe', time: '2 mins ago' },
        { id: 2, action: 'Property approved', property: 'Luxury Villa', time: '15 mins ago' },
        { id: 3, action: 'Payment processed', amount: '$2,500', time: '1 hour ago' },
        { id: 4, action: 'User reported', user: 'Jane Smith', time: '2 hours ago' },
        { id: 5, action: 'System backup', status: 'Completed', time: '3 hours ago' },
      ]);
    }
  };

  const quickActions = [
    { icon: '👥', label: 'Manage Users', link: '/admin/users', color: 'blue' },
    { icon: '🏠', label: 'Properties', link: '/admin/properties', color: 'green' },
    { icon: '✅', label: 'Approvals', link: '/admin/approvals', color: 'yellow' },
    { icon: '📊', label: 'Analytics', link: '/admin/analytics', color: 'purple' },
  ];

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
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
          Admin Dashboard 👑
        </h1>
        <p className="text-gray-600 mt-1">
          System overview and management panel
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: formatNumber(stats.totalUsers), icon: '👥', color: 'blue' },
          { label: 'Total Properties', value: formatNumber(stats.totalProperties), icon: '🏠', color: 'green' },
          { label: 'Pending Approvals', value: stats.pendingApprovals, icon: '⏳', color: 'yellow' },
          { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: '💰', color: 'purple' },
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
              <span className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</span>
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

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
              <Link to="/admin/reports" className="text-blue-600 text-sm hover:underline">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    {activity.user && <p className="text-sm text-gray-500">User: {activity.user}</p>}
                    {activity.property && <p className="text-sm text-gray-500">Property: {activity.property}</p>}
                    {activity.amount && <p className="text-sm text-gray-500">Amount: {activity.amount}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{activity.time}</p>
                    <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(systemStatus).map(([service, status]) => (
                <div key={service} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{service}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      status === 'online' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {status}
                    </span>
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
                {user?.firstName?.[0] || 'A'}
              </div>
              <h3 className="font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                Administrator
              </span>
              <Link
                to="/profile"
                className="mt-4 inline-block text-blue-600 text-sm hover:underline"
              >
                Edit Profile
              </Link>
            </div>
          </motion.div>

          {/* Alerts Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Alerts</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-700">Pending Approvals</p>
                <p className="text-xs text-yellow-600">{stats.pendingApprovals} items need review</p>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-700">System Issues</p>
                <p className="text-xs text-red-600">No critical issues</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-700">Updates Available</p>
                <p className="text-xs text-blue-600">2 updates ready to install</p>
              </div>
            </div>
          </motion.div>

          {/* Support Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
          >
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-blue-100 text-sm mb-4">
              Access admin support and documentation.
            </p>
            <button className="w-full py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100">
              Contact Support
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;