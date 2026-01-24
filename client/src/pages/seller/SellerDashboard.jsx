import { useState, useEffect } from 'react';
import { FaHome, FaEye, FaHeart, FaCalendar, FaDollarSign, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import api from '../../services/api';

const SellerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get('/seller/dashboard');
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
      icon: FaHome,
      label: 'Total Properties',
      value: stats?.totalProperties || 0,
      color: 'blue',
      change: '+5%',
    },
    {
      icon: FaEye,
      label: 'Total Views',
      value: stats?.totalViews || 0,
      color: 'purple',
      change: '+12%',
    },
    {
      icon: FaHeart,
      label: 'Total Favorites',
      value: stats?.totalFavorites || 0,
      color: 'red',
      change: '+8%',
    },
    {
      icon: FaCalendar,
      label: 'Appointments',
      value: stats?.appointments || 0,
      color: 'green',
      change: '+3',
    },
  ];

  const viewsData = {
    labels: stats?.viewsChart?.labels || [],
    datasets: [
      {
        label: 'Property Views',
        data: stats?.viewsChart?.data || [],
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const propertyPerformanceData = {
    labels: stats?.topProperties?.map((p) => p.title.substring(0, 20)) || [],
    datasets: [
      {
        label: 'Views',
        data: stats?.topProperties?.map((p) => p.views) || [],
        backgroundColor: 'rgba(14, 165, 233, 0.8)',
      },
    ],
  };

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
        <p className="text-gray-600">Track your property performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon className={`text-3xl text-${card.color}-500`} />
              <span className="text-green-600 text-sm font-medium">{card.change}</span>
            </div>
            <p className="text-gray-600 mb-2">{card.label}</p>
            <p className="text-3xl font-bold">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Views Over Time</h3>
          <Line data={viewsData} options={{ responsive: true }} />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Top Performing Properties</h3>
          <Bar data={propertyPerformanceData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Inquiries</h3>
          {stats?.recentInquiries && stats.recentInquiries.length > 0 ? (
            <div className="space-y-4">
              {stats.recentInquiries.map((inquiry, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <p className="font-medium">{inquiry.property}</p>
                  <p className="text-sm text-gray-600">{inquiry.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{inquiry.time}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent inquiries</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Upcoming Appointments</h3>
          {stats?.upcomingAppointments && stats.upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {stats.upcomingAppointments.map((appointment, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <p className="font-medium">{appointment.property}</p>
                  <p className="text-sm text-gray-600">
                    <FaCalendar className="inline mr-2" />
                    {appointment.date} at {appointment.time}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Client: {appointment.client}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming appointments</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
