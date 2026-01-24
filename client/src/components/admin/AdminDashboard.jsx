import { useState, useEffect } from 'react';
import {
  FaUsers,
  FaHome,
  FaDollarSign,
  FaExclamationTriangle,
  FaChartLine,
  FaTrendingUp,
  FaTrendingDown,
} from 'react-icons/fa';
import Loader from '../common/Loader';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    fetchDashboardStats();
  }, [timeRange]);

  const fetchDashboardStats = async () => {
    try {
      const { data } = await api.get(`/admin/dashboard-stats?days=${timeRange}`);
      setStats(data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  const statCards = [
    {
      icon: FaUsers,
      label: 'Total Users',
      value: stats.totalUsers,
      change: stats.userGrowth.length > 0 ? '+12%' : '0%',
      trend: 'up',
      color: 'primary',
    },
    {
      icon: FaHome,
      label: 'Total Properties',
      value: stats.totalProperties,
      change: '+8%',
      trend: 'up',
      color: 'green',
    },
    {
      icon: FaDollarSign,
      label: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: '+25%',
      trend: 'up',
      color: 'blue',
    },
    {
      icon: FaExclamationTriangle,
      label: 'Pending Reviews',
      value: stats.pendingReviews,
      change: '-5%',
      trend: 'down',
      color: 'red',
    },
  ];

  const userGrowthData = {
    labels: stats.userGrowth.map((d) => d.month),
    datasets: [
      {
        label: 'New Users',
        data: stats.userGrowth.map((d) => d.count),
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const propertyByTypeData = {
    labels: stats.propertyByType.map((d) => d.type),
    datasets: [
      {
        label: 'Properties',
        data: stats.propertyByType.map((d) => d.count),
        backgroundColor: [
          'rgba(14, 165, 233, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Platform overview and statistics</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="input"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`text-2xl text-${stat.color}-600`} />
              </div>
              <div className="flex items-center gap-1">
                {stat.trend === 'up' ? (
                  <FaTrendingUp className="text-green-600" />
                ) : (
                  <FaTrendingDown className="text-red-600" />
                )}
                <span
                  className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts - Using placeholders since chart libraries are not installed */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Chart visualization would appear here</p>
          </div>
        </div>

        {/* Properties by Type */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Properties by Type</h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Chart visualization would appear here</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Users</h3>
            <a href="/admin/users" className="text-primary-600 text-sm hover:underline">
              View All →
            </a>
          </div>
          <div className="space-y-3">
            {stats.recentUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <img
                  src={user.avatar || '/default-avatar.png'}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Properties</h3>
            <a
              href="/admin/properties"
              className="text-primary-600 text-sm hover:underline"
            >
              View All →
            </a>
          </div>
          <div className="space-y-3">
            {stats.recentProperties.map((property) => (
              <div
                key={property._id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium line-clamp-1">{property.title}</p>
                  <p className="text-sm text-gray-600">{property.location}</p>
                </div>
                <span className="text-sm font-semibold text-primary-600">
                  ${property.price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <a
            href="/admin/users"
            className="bg-white/20 hover:bg-white/30 p-4 rounded-lg text-center transition-colors"
          >
            <FaUsers className="text-3xl mx-auto mb-2" />
            <p className="font-medium">Manage Users</p>
          </a>
          <a
            href="/admin/properties"
            className="bg-white/20 hover:bg-white/30 p-4 rounded-lg text-center transition-colors"
          >
            <FaHome className="text-3xl mx-auto mb-2" />
            <p className="font-medium">Review Properties</p>
          </a>
          <a
            href="/admin/analytics"
            className="bg-white/20 hover:bg-white/30 p-4 rounded-lg text-center transition-colors"
          >
            <FaChartLine className="text-3xl mx-auto mb-2" />
            <p className="font-medium">View Analytics</p>
          </a>
          <a
            href="/admin/reports"
            className="bg-white/20 hover:bg-white/30 p-4 rounded-lg text-center transition-colors"
          >
            <FaExclamationTriangle className="text-3xl mx-auto mb-2" />
            <p className="font-medium">Reports</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;