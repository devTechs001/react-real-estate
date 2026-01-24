import { useState, useEffect } from 'react';
import { FaEye, FaHeart, FaEnvelope, FaCalendar, FaChartLine } from 'react-icons/fa';
import { analyticsService } from '../../services/analyticService';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const data = await analyticsService.getSellerAnalytics(timeRange);
      setAnalytics(data);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!analytics) return null;

  const stats = [
    {
      icon: FaEye,
      label: 'Total Views',
      value: analytics.totalViews,
      color: 'primary',
      change: '+12%',
    },
    {
      icon: FaHeart,
      label: 'Favorites',
      value: analytics.totalFavorites,
      color: 'red',
      change: '+8%',
    },
    {
      icon: FaEnvelope,
      label: 'Inquiries',
      value: analytics.totalInquiries,
      color: 'blue',
      change: '+15%',
    },
    {
      icon: FaCalendar,
      label: 'Appointments',
      value: analytics.totalAppointments,
      color: 'green',
      change: '+20%',
    },
  ];

  const viewsChartData = {
    labels: analytics.viewsOverTime.map((d) => d.date),
    datasets: [
      {
        label: 'Property Views',
        data: analytics.viewsOverTime.map((d) => d.count),
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const propertyPerformanceData = {
    labels: analytics.topProperties.map((p) => p.title),
    datasets: [
      {
        label: 'Views',
        data: analytics.topProperties.map((p) => p.views),
        backgroundColor: 'rgba(14, 165, 233, 0.8)',
      },
    ],
  };

  const statusDistributionData = {
    labels: ['Available', 'Pending', 'Sold', 'Rented'],
    datasets: [
      {
        data: analytics.statusDistribution,
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(99, 102, 241, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your property performance</p>
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
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 bg-${stat.color}-100 rounded-lg`}
              >
                <stat.icon className={`text-2xl text-${stat.color}-600`} />
              </div>
              <span className="text-sm text-green-600 font-medium">
                {stat.change}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Charts - Using placeholders since chart libraries are not installed */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Views Over Time */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Views Over Time</h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Chart visualization would appear here</p>
          </div>
        </div>

        {/* Property Status Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Property Status</h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Chart visualization would appear here</p>
          </div>
        </div>
      </div>

      {/* Top Performing Properties */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Top Performing Properties</h3>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-500">Chart visualization would appear here</p>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Property Performance Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Property</th>
                <th className="text-right py-3 px-4">Views</th>
                <th className="text-right py-3 px-4">Favorites</th>
                <th className="text-right py-3 px-4">Inquiries</th>
                <th className="text-right py-3 px-4">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topProperties.map((property) => (
                <tr key={property._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{property.title}</td>
                  <td className="text-right py-3 px-4">{property.views}</td>
                  <td className="text-right py-3 px-4">{property.favorites}</td>
                  <td className="text-right py-3 px-4">{property.inquiries}</td>
                  <td className="text-right py-3 px-4">
                    {((property.inquiries / property.views) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;