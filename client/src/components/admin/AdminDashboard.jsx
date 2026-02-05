import { useState, useEffect } from 'react';
import {
  FaUsers,
  FaHome,
  FaDollarSign,
  FaExclamationTriangle,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaBell,
  FaDownload,
  FaRefresh,
  FaEye,
} from 'react-icons/fa';
import Loader from '../common/Loader';
import { dashboardService } from '../../services/dashboardService';
import toast from 'react-hot-toast';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');
  const [realTimeStats, setRealTimeStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchDashboardStats();
    fetchNotifications();
  }, [timeRange]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchDashboardStats();
        fetchRealTimeStats();
      }, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchDashboardStats = async () => {
    try {
      const dashboardData = await dashboardService.getDashboardData();
      setStats(dashboardData.stats);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchRealTimeStats = async () => {
    try {
      const data = await dashboardService.getRealTimeStats();
      setRealTimeStats(data);
    } catch (error) {
      console.error('Error fetching real-time stats:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await dashboardService.getAdminNotifications();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleExportData = async (type) => {
    try {
      const data = await dashboardService.exportData(type);
      const blob = new Blob([data], { 
        type: type === 'csv' ? 'text/csv' : 'application/vnd.ms-excel' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-${type}-${new Date().toISOString().split('T')[0]}.${type}`;
      a.click();
      toast.success(`Data exported as ${type.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  if (loading) return <Loader fullScreen />;

  const statCards = [
    {
      icon: FaUsers,
      label: 'Total Users',
      value: stats.totalUsers,
      change: stats.userGrowth?.length > 0 ? '+12%' : '0%',
      trend: 'up',
      color: 'primary',
      realTime: realTimeStats?.activeUsers || 0,
      realTimeLabel: 'Active Now',
    },
    {
      icon: FaHome,
      label: 'Total Properties',
      value: stats.totalProperties,
      change: '+8%',
      trend: 'up',
      color: 'green',
      realTime: realTimeStats?.newPropertiesToday || 0,
      realTimeLabel: 'New Today',
    },
    {
      icon: FaDollarSign,
      label: 'Revenue',
      value: stats.totalRevenue ? `$${stats.totalRevenue.toLocaleString()}` : '$0',
      change: '+25%',
      trend: 'up',
      color: 'blue',
      realTime: realTimeStats?.revenueToday || 0,
      realTimeLabel: "Today's Revenue",
    },
    {
      icon: FaExclamationTriangle,
      label: 'Pending Reviews',
      value: stats.pendingReviews || 0,
      change: '-5%',
      trend: 'down',
      color: 'red',
      realTime: notifications.filter(n => n.type === 'urgent').length,
      realTimeLabel: 'Urgent',
    },
  ];

  const userGrowthData = {
    labels: stats.userGrowth?.map((d) => d.month) || [],
    datasets: [
      {
        label: 'New Users',
        data: stats.userGrowth?.map((d) => d.count) || [],
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const propertyByTypeData = {
    labels: stats.propertyByType?.map((d) => d.type) || [],
    datasets: [
      {
        label: 'Properties',
        data: stats.propertyByType?.map((d) => d.count) || [],
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
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Auto Refresh"
            >
              <FaRefresh className={autoRefresh ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => handleExportData('csv')}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              title="Export CSV"
            >
              <FaDownload />
            </button>
            <button
              onClick={() => handleExportData('excel')}
              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
              title="Export Excel"
            >
              <FaDownload />
            </button>
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
      </div>

      {/* Notifications Bar */}
      {notifications.length > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaBell className="text-yellow-600" />
              <span className="font-medium text-yellow-800">
                {notifications.length} New Notification{notifications.length > 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={() => window.location.href = '/admin/notifications'}
              className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="mt-2 space-y-1">
            {notifications.slice(0, 3).map((notification, index) => (
              <div key={index} className="text-sm text-yellow-700">
                {notification.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`text-2xl text-${stat.color}-600`} />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  {stat.trend === 'up' ? (
                    <FaArrowUp className="text-green-600" />
                  ) : (
                    <FaArrowDown className="text-red-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                {stat.realTime !== undefined && (
                  <div className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">{stat.realTime}</span> {stat.realTimeLabel}
                  </div>
                )}
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Interactive Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">User Growth</h3>
            <button
              onClick={() => window.location.href = '/admin/analytics'}
              className="text-primary-600 hover:text-primary-700"
            >
              <FaEye />
            </button>
          </div>
          <div className="h-64">
            {stats.userGrowth && stats.userGrowth.length > 0 ? (
              <Line data={userGrowthData} options={chartOptions} />
            ) : (
              <div className="h-full bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Properties by Type */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Properties by Type</h3>
            <button
              onClick={() => window.location.href = '/admin/properties'}
              className="text-primary-600 hover:text-primary-700"
            >
              <FaEye />
            </button>
          </div>
          <div className="h-64">
            {stats.propertyByType && stats.propertyByType.length > 0 ? (
              <Doughnut data={propertyByTypeData} options={chartOptions} />
            ) : (
              <div className="h-full bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
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
            {(stats.recentUsers || []).map((user) => (
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
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
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
            {(stats.recentProperties || []).map((property) => (
              <div
                key={property._id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <img
                  src={property.images?.[0] || '/default-property.jpg'}
                  alt={property.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium line-clamp-1">{property.title}</p>
                  <p className="text-sm text-gray-600">{property.location}</p>
                </div>
                <span className="text-sm font-semibold text-primary-600">
                  {property.price ? `$${property.price.toLocaleString()}` : ''}
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

      {/* Advanced Analytics */}
      <div className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Advanced Analytics</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <a
            href="/admin/financial-analytics"
            className="bg-white/20 hover:bg-white/30 p-4 rounded-lg text-center transition-colors"
          >
            <FaDollarSign className="text-3xl mx-auto mb-2" />
            <p className="font-medium">Financial Analytics</p>
          </a>
          <a
            href="/admin/seller-performance"
            className="bg-white/20 hover:bg-white/30 p-4 rounded-lg text-center transition-colors"
          >
            <FaChartLine className="text-3xl mx-auto mb-2" />
            <p className="font-medium">Seller Performance</p>
          </a>
          <a
            href="/admin/system"
            className="bg-white/20 hover:bg-white/30 p-4 rounded-lg text-center transition-colors"
          >
            <FaChartLine className="text-3xl mx-auto mb-2" />
            <p className="font-medium">System Health</p>
          </a>
          <a
            href="/admin/logs"
            className="bg-white/20 hover:bg-white/30 p-4 rounded-lg text-center transition-colors"
          >
            <FaExclamationTriangle className="text-3xl mx-auto mb-2" />
            <p className="font-medium">System Logs</p>
          </a>
        </div>
      </div>

      {/* Developer/Admin Tools */}
      <div className="mt-8 bg-gray-800 rounded-xl p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Developer Tools</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <a
            href="/admin/emails"
            className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center transition-colors"
          >
            <FaChartLine className="text-3xl mx-auto mb-2" />
            <p className="font-medium">Email Templates</p>
          </a>
          <a
            href="/admin/settings"
            className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center transition-colors"
          >
            <FaChartLine className="text-3xl mx-auto mb-2" />
            <p className="font-medium">System Settings</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;