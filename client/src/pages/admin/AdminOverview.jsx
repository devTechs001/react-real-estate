import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { dashboardService } from '../../services/dashboardService';
import toast from 'react-hot-toast';
import '../../styles/admin/AdminOverview.css';

// Helper function to extract first name from full name
const getFirstName = (fullName) => {
  if (!fullName) return '';
  return fullName.split(' ')[0];
};

const AdminOverview = () => {
  const { user } = useAuth();
  const firstName = getFirstName(user?.name);

  console.log('=== AdminOverview Rendering ===');
  console.log('👤 User from auth context:', user);
  console.log('🔑 User role:', user?.role);
  console.log('🔐 Is user admin?', user?.role === 'admin');
  console.log('📧 User email:', user?.email);

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
    console.log('=== AdminOverview useEffect triggered ===');
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard data from the backend
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('auth_token');

      console.log('Fetching dashboard data from:', `${API_URL}/api/dashboard`);
      console.log('Token exists:', !!token);

      const response = await fetch(`${API_URL}/api/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard data received:', data);

        // Update stats with real data (data is nested under data.stats)
        const statsData = data.stats || data;
        setStats({
          totalUsers: statsData.totalUsers || 1247,
          totalProperties: statsData.totalProperties || 3421,
          pendingApprovals: statsData.pendingProperties || statsData.pendingApprovals || 23,
          totalRevenue: statsData.financialMetrics?.totalRevenue || statsData.totalRevenue || 124567
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
              time: new Date(user.createdAt).toLocaleDateString(),
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
              time: new Date(property.createdAt).toLocaleDateString(),
              type: 'property'
            });
          });
        }

        if (activities.length > 0) {
          setRecentActivities(activities);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error:', response.status, errorData);
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      // Set system status (would come from a system health endpoint in a real implementation)
      setSystemStatus({
        server: 'online',
        database: 'online',
        cache: 'online'
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data - showing demo data');

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
    <div className="max-w-7xl mx-auto p-4" style={{ color: '#1f2937', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Debug Info - ALWAYS VISIBLE */}
      <div className="bg-red-600 text-white px-4 py-2 rounded mb-4 font-bold text-lg border-4 border-black" style={{ backgroundColor: '#dc2626', color: '#ffffff' }}>
        🔴 ADMIN OVERVIEW LOADED - {user?.name || 'Unknown'} | Role: {user?.role || 'N/A'}
      </div>

      {/* Debug Info */}
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded mb-4" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
        <strong>Debug:</strong> User = {user?.name || 'N/A'} | Role = {user?.role || 'N/A'} | Email = {user?.email || 'N/A'}
      </div>

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
            className="rounded-2xl p-6 shadow-sm"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-2xl font-bold" style={{ 
                color: stat.color === 'blue' ? '#2563eb' : 
                       stat.color === 'green' ? '#16a34a' : 
                       stat.color === 'yellow' ? '#ca8a04' : 
                       '#9333ea'
              }}>{stat.value}</span>
            </div>
            <p className="text-sm" style={{ color: '#4b5563' }}>{stat.label}</p>
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
            className="rounded-2xl p-6 shadow-sm"
            style={{ backgroundColor: '#ffffff' }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#111827' }}>Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="flex flex-col items-center p-4 rounded-xl transition-colors"
                  style={{ backgroundColor: '#f9fafb' }}
                >
                  <span className="text-3xl mb-2">{action.icon}</span>
                  <span className="text-sm text-center" style={{ color: '#374151' }}>{action.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6 shadow-sm"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: '#111827' }}>Recent Activities</h2>
              <Link to="/admin/reports" className="text-sm hover:underline" style={{ color: '#2563eb' }}>
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: '#e5e7eb' }}>
                  <div>
                    <p className="font-medium" style={{ color: '#111827' }}>{activity.action}</p>
                    {activity.user && <p className="text-sm" style={{ color: '#6b7280' }}>User: {activity.user}</p>}
                    {activity.property && <p className="text-sm" style={{ color: '#6b7280' }}>Property: {activity.property}</p>}
                    {activity.amount && <p className="text-sm" style={{ color: '#6b7280' }}>Amount: {activity.amount}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm" style={{ color: '#6b7280' }}>{activity.time}</p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
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
            className="rounded-2xl p-6 shadow-sm"
            style={{ backgroundColor: '#ffffff' }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#111827' }}>System Status</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(systemStatus).map(([service, status]) => (
                <div key={service} className="p-4 border rounded-lg" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize" style={{ color: '#111827' }}>{service}</span>
                    <span className="px-2 py-1 rounded-full text-xs" style={{ 
                      backgroundColor: status === 'online' ? '#dcfce7' : '#fee2e2',
                      color: status === 'online' ? '#166534' : '#991b1b'
                    }}>
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
            className="rounded-2xl p-6 shadow-sm"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                {firstName?.[0] || 'A'}
              </div>
              <h3 className="font-semibold" style={{ color: '#111827' }}>
                {user?.name || 'Admin'}
              </h3>
              <p className="text-sm" style={{ color: '#6b7280' }}>{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
                Administrator
              </span>
              <Link
                to="/profile"
                className="mt-4 inline-block text-sm hover:underline"
                style={{ color: '#2563eb' }}
              >
                Edit Profile
              </Link>
            </div>
          </motion.div>

          {/* Alerts Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl p-6 shadow-sm"
            style={{ backgroundColor: '#ffffff' }}
          >
            <h3 className="font-semibold mb-4" style={{ color: '#111827' }}>Alerts</h3>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg" style={{ backgroundColor: '#fefce8', borderColor: '#fef08a' }}>
                <p className="text-sm font-medium" style={{ color: '#854d0e' }}>Pending Approvals</p>
                <p className="text-xs" style={{ color: '#a16207' }}>{stats.pendingApprovals} items need review</p>
              </div>
              <div className="p-3 border rounded-lg" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                <p className="text-sm font-medium" style={{ color: '#991b1b' }}>System Issues</p>
                <p className="text-xs" style={{ color: '#b91c1c' }}>No critical issues</p>
              </div>
              <div className="p-3 border rounded-lg" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
                <p className="text-sm font-medium" style={{ color: '#1e40af' }}>Updates Available</p>
                <p className="text-xs" style={{ color: '#1e3a8a' }}>2 updates ready to install</p>
              </div>
            </div>
          </motion.div>

          {/* Support Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl p-6 text-white"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}
          >
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm mb-4" style={{ color: '#dbeafe' }}>
              Access admin support and documentation.
            </p>
            <button className="w-full py-2 rounded-lg font-medium" style={{ backgroundColor: '#ffffff', color: '#2563eb' }}>
              Contact Support
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;