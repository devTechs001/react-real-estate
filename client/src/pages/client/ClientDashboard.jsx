import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaEye, FaCalendar, FaEnvelope, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ClientDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get('/client/dashboard');
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
      icon: FaHeart,
      label: 'Favorites',
      value: stats?.favorites || 0,
      link: '/client/favorites',
      color: 'red',
    },
    {
      icon: FaEye,
      label: 'Properties Viewed',
      value: stats?.viewedCount || 0,
      link: '/client/view-history',
      color: 'blue',
    },
    {
      icon: FaCalendar,
      label: 'Appointments',
      value: stats?.appointments || 0,
      link: '/client/appointments',
      color: 'green',
    },
    {
      icon: FaEnvelope,
      label: 'Messages',
      value: stats?.unreadMessages || 0,
      link: '/client/messages',
      color: 'purple',
    },
  ];

  const activityData = {
    labels: stats?.activityChart?.labels || [],
    datasets: [
      {
        label: 'Property Views',
        data: stats?.activityChart?.data || [],
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Client Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your activity overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={card.link}
              className="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <card.icon className={`text-3xl text-${card.color}-500`} />
                <span className="text-3xl font-bold">{card.value}</span>
              </div>
              <p className="text-gray-600">{card.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Your Activity</h3>
          <Line data={activityData} options={{ responsive: true }} />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/properties" className="btn btn-primary w-full">
              Browse Properties
            </Link>
            <Link to="/client/favorites" className="btn btn-outline w-full">
              View Favorites
            </Link>
            <Link to="/client/appointments" className="btn btn-outline w-full">
              My Appointments
            </Link>
            <Link to="/client/saved-searches" className="btn btn-outline w-full">
              Saved Searches
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {stats?.recentActivity && stats.recentActivity.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-4 last:border-b-0"
              >
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
