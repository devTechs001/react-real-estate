import { useState, useEffect } from 'react';
import {
  FaUsers,
  FaHome,
  FaExclamationTriangle,
  FaDollarSign,
  FaChartLine,
} from 'react-icons/fa';
import { Line, Bar } from 'react-chartjs-2';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data } = await api.get('/admin/dashboard-stats');
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
      color: 'primary',
      change: '+12%',
    },
    {
      icon: FaHome,
      label: 'Total Properties',
      value: stats.totalProperties,
      color: 'green',
      change: '+8%',
    },
    {
      icon: FaDollarSign,
      label: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      color: 'blue',
      change: '+25%',
    },
    {
      icon: FaExclamationTriangle,
      label: 'Pending Reviews',
      value: stats.pendingReviews,
      color: 'red',
      change: '-5%',
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
        ],
      },
    ],
  };

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`text-2xl text-${stat.color}-600`} />
              </div>
              <span
                className={`text-sm font-medium ${
                  stat.change.startsWith('+')
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <Line data={userGrowthData} options={{ responsive: true }} />
        </div>

        {/* Properties by Type */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Properties by Type</h3>
          <Bar data={propertyByTypeData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
          <div className="space-y-3">
            {stats.recentUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
              >
                <img
                  src={user.avatar || '/default-avatar.png'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
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
          <h3 className="text-lg font-semibold mb-4">Recent Properties</h3>
          <div className="space-y-3">
            {stats.recentProperties.map((property) => (
              <div
                key={property._id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
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
    </div>
  );
};

export default AdminDashboard;