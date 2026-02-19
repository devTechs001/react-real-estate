import { useState, useEffect, useRef } from 'react';
import { 
  FaHome, 
  FaEye, 
  FaHeart, 
  FaCalendar, 
  FaDollarSign, 
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
  FaFilter,
  FaBell,
  FaMapMarkerAlt,
  FaUsers,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaStar,
  FaShare,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSync
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Line, 
  Bar, 
  Doughnut, 
  Radar,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import api from '../../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SellerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const chartRefs = useRef({});

  useEffect(() => {
    fetchDashboardData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const fetchDashboardData = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) setRefreshing(true);
      const { data } = await api.get(`/seller/dashboard?period=${selectedPeriod}`);
      setStats(data);
      if (showRefreshIndicator) {
        toast.success('Dashboard refreshed!', { icon: '🔄' });
      }
    } catch (error) {
      toast.error('Failed to load dashboard');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const exportData = () => {
    // Export dashboard data as CSV/PDF
    toast.success('Exporting data...', { icon: '📊' });
    // Implementation here
  };

  if (loading) return <Loader fullScreen />;

  // Enhanced stat cards with trends
  const statCards = [
    {
      icon: FaHome,
      label: 'Total Properties',
      value: stats?.totalProperties || 0,
      change: stats?.propertyChange || '+5.2%',
      trend: 'up',
      color: 'blue',
      bgGradient: 'from-blue-500 to-blue-600',
      description: 'Active listings',
      link: '/seller/properties'
    },
    {
      icon: FaEye,
      label: 'Total Views',
      value: (stats?.totalViews || 0).toLocaleString(),
      change: stats?.viewsChange || '+12.5%',
      trend: 'up',
      color: 'purple',
      bgGradient: 'from-purple-500 to-purple-600',
      description: 'Last 30 days',
      link: '/seller/analytics'
    },
    {
      icon: FaHeart,
      label: 'Favorites',
      value: stats?.totalFavorites || 0,
      change: stats?.favoritesChange || '+8.3%',
      trend: 'up',
      color: 'red',
      bgGradient: 'from-red-500 to-pink-600',
      description: 'Saved by users',
      link: '/seller/favorites'
    },
    {
      icon: FaDollarSign,
      label: 'Total Revenue',
      value: `$${((stats?.totalRevenue || 0) / 1000).toFixed(1)}K`,
      change: stats?.revenueChange || '+15.7%',
      trend: 'up',
      color: 'green',
      bgGradient: 'from-green-500 to-emerald-600',
      description: 'This month',
      link: '/seller/revenue'
    },
    {
      icon: FaCalendar,
      label: 'Appointments',
      value: stats?.totalAppointments || 0,
      change: stats?.appointmentsChange || '+3',
      trend: 'up',
      color: 'indigo',
      bgGradient: 'from-indigo-500 to-indigo-600',
      description: 'Scheduled',
      link: '/seller/appointments'
    },
    {
      icon: FaUsers,
      label: 'Inquiries',
      value: stats?.totalInquiries || 0,
      change: stats?.inquiriesChange || '+9.1%',
      trend: 'up',
      color: 'orange',
      bgGradient: 'from-orange-500 to-orange-600',
      description: 'Pending responses',
      link: '/seller/inquiries'
    },
    {
      icon: FaChartLine,
      label: 'Conversion Rate',
      value: `${stats?.conversionRate || 3.2}%`,
      change: stats?.conversionChange || '+0.8%',
      trend: 'up',
      color: 'teal',
      bgGradient: 'from-teal-500 to-teal-600',
      description: 'Views to inquiries',
      link: '/seller/analytics'
    },
    {
      icon: FaStar,
      label: 'Avg. Rating',
      value: stats?.averageRating || 4.8,
      change: stats?.ratingChange || '+0.2',
      trend: 'up',
      color: 'yellow',
      bgGradient: 'from-yellow-500 to-yellow-600',
      description: 'From reviews',
      link: '/seller/reviews'
    },
  ];

  // Enhanced chart configurations
  const viewsData = {
    labels: stats?.viewsChart?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Property Views',
        data: stats?.viewsChart?.data || [120, 190, 150, 220, 180, 250, 200],
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(14, 165, 233)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Inquiries',
        data: stats?.inquiriesChart?.data || [30, 45, 35, 50, 42, 58, 48],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(168, 85, 247)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.parsed.y.toLocaleString();
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  };

  const propertyPerformanceData = {
    labels: stats?.topProperties?.map((p) => p.title.substring(0, 15) + '...') || 
            ['Property 1', 'Property 2', 'Property 3', 'Property 4', 'Property 5'],
    datasets: [
      {
        label: 'Views',
        data: stats?.topProperties?.map((p) => p.views) || [450, 380, 320, 280, 240],
        backgroundColor: 'rgba(14, 165, 233, 0.8)',
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Favorites',
        data: stats?.topProperties?.map((p) => p.favorites) || [120, 95, 80, 65, 55],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  const propertyStatusData = {
    labels: ['Active', 'Pending', 'Sold', 'Inactive'],
    datasets: [
      {
        data: stats?.propertyStatus || [12, 5, 8, 3],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderColor: '#fff',
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
      }
    },
    cutout: '65%',
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: stats?.revenueChart || [12000, 15000, 13500, 18000, 16500, 21000],
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(34, 197, 94, 0.8)');
          gradient.addColorStop(1, 'rgba(34, 197, 94, 0.1)');
          return gradient;
        },
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  // Quick Actions
  const quickActions = [
    {
      icon: FaPlus,
      label: 'Add Property',
      color: 'blue',
      action: () => window.location.href = '/seller/properties/add'
    },
    {
      icon: FaEnvelope,
      label: 'Messages',
      color: 'purple',
      badge: stats?.unreadMessages || 0,
      action: () => window.location.href = '/seller/messages'
    },
    {
      icon: FaCalendar,
      label: 'Schedule',
      color: 'green',
      action: () => window.location.href = '/seller/schedule'
    },
    {
      icon: FaChartLine,
      label: 'Analytics',
      color: 'orange',
      action: () => window.location.href = '/seller/analytics'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12">
      {/* Header Section */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container-custom py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
              >
                Seller Dashboard
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 flex items-center gap-2"
              >
                <FaClock className="text-gray-400" />
                Last updated: {new Date().toLocaleString()}
              </motion.p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Period Filter */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-medium hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
              >
                <option value="24hours">Last 24 Hours</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="12months">Last 12 Months</option>
              </select>

              {/* Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-medium hover:border-gray-300 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <FaSync className={`${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </motion.button>

              {/* Export Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportData}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-200 hover:shadow-xl transition-all flex items-center gap-2"
              >
                <FaDownload />
                <span className="hidden sm:inline">Export</span>
              </motion.button>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all"
              >
                <FaBell className="text-xl text-gray-600" />
                {stats?.notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {stats.notifications}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom pt-8">
        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.action}
              className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all group"
            >
              <div className={`w-12 h-12 bg-gradient-to-r from-${action.color}-500 to-${action.color}-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="text-white text-xl" />
              </div>
              <p className="font-semibold text-gray-900">{action.label}</p>
              {action.badge > 0 && (
                <span className="absolute top-4 right-4 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {action.badge}
                </span>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() => window.location.href = card.link}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              {/* Card Content */}
              <div className="relative p-6">
                {/* Icon & Change */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-r ${card.bgGradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <card.icon className="text-white text-2xl" />
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold ${
                    card.trend === 'up' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {card.trend === 'up' ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
                    {card.change}
                  </div>
                </div>

                {/* Label & Value */}
                <p className="text-gray-600 text-sm mb-1 font-medium">{card.label}</p>
                <p className="text-4xl font-bold text-gray-900 mb-2">{card.value}</p>
                <p className="text-xs text-gray-500">{card.description}</p>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Views & Inquiries Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Performance Trends</h3>
                <p className="text-sm text-gray-500 mt-1">Views and inquiries over time</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                  Week
                </button>
                <button className="px-4 py-2 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Month
                </button>
              </div>
            </div>
            <div style={{ height: '350px' }}>
              <Line data={viewsData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Property Status Doughnut */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Property Status</h3>
              <p className="text-sm text-gray-500 mt-1">Current distribution</p>
            </div>
            <div style={{ height: '300px' }}>
              <Doughnut data={propertyStatusData} options={doughnutOptions} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stats?.propertyStatus?.[0] || 12}</p>
                <p className="text-xs text-gray-600">Active</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{stats?.propertyStatus?.[1] || 5}</p>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Revenue & Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Revenue Growth</h3>
                <p className="text-sm text-gray-500 mt-1">Monthly earnings</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg font-bold">
                <FaArrowUp />
                +15.7%
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <Line data={revenueData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Top Performing Properties */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Top Properties</h3>
              <p className="text-sm text-gray-500 mt-1">Most viewed & favorited</p>
            </div>
            <div style={{ height: '300px' }}>
              <Bar data={propertyPerformanceData} options={barChartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Inquiries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FaEnvelope className="text-blue-600" />
                  Recent Inquiries
                </h3>
                <p className="text-sm text-gray-500 mt-1">Latest messages from buyers</p>
              </div>
              <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {stats?.recentInquiries && stats.recentInquiries.length > 0 ? (
                stats.recentInquiries.slice(0, 5).map((inquiry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group p-4 border-2 border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {inquiry.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{inquiry.name || 'Anonymous'}</p>
                          <p className="text-sm text-gray-600">{inquiry.property}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <FaClock className="text-gray-400" />
                        {inquiry.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2 mb-2">{inquiry.message}</p>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center gap-1">
                        <FaEnvelope className="text-xs" />
                        Reply
                      </button>
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors flex items-center gap-1">
                        <FaPhone className="text-xs" />
                        Call
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No recent inquiries</p>
                  <p className="text-sm text-gray-400 mt-1">New messages will appear here</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FaCalendar className="text-green-600" />
                  Upcoming Appointments
                </h3>
                <p className="text-sm text-gray-500 mt-1">Scheduled viewings</p>
              </div>
              <button className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg text-sm font-medium transition-colors">
                Calendar
              </button>
            </div>

            <div className="space-y-4">
              {stats?.upcomingAppointments && stats.upcomingAppointments.length > 0 ? (
                stats.upcomingAppointments.slice(0, 5).map((appointment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group p-4 border-2 border-gray-100 rounded-xl hover:border-green-200 hover:bg-green-50/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 mb-1">{appointment.property}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                          <FaUsers className="text-gray-400" />
                          Client: {appointment.client}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1.5 text-gray-700">
                            <FaCalendar className="text-green-600" />
                            {appointment.date}
                          </span>
                          <span className="flex items-center gap-1.5 text-gray-700">
                            <FaClock className="text-blue-600" />
                            {appointment.time}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {appointment.status === 'confirmed' ? (
                            <><FaCheckCircle className="inline mr-1" />Confirmed</>
                          ) : (
                            <><FaExclamationCircle className="inline mr-1" />Pending</>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                      <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors">
                        Start Meeting
                      </button>
                      <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">
                        Reschedule
                      </button>
                      <button className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No upcoming appointments</p>
                  <p className="text-sm text-gray-400 mt-1">Scheduled viewings will appear here</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
        >
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaClock className="text-purple-600" />
              Recent Activity
            </h3>
            <p className="text-sm text-gray-500 mt-1">Your latest actions and updates</p>
          </div>

          <div className="space-y-4">
            {stats?.recentActivity?.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'new' ? 'bg-green-100 text-green-600' :
                  activity.type === 'update' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'inquiry' ? 'bg-purple-100 text-purple-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {activity.type === 'new' && <FaPlus />}
                  {activity.type === 'update' && <FaEdit />}
                  {activity.type === 'inquiry' && <FaEnvelope />}
                  {activity.type === 'view' && <FaEye />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
              </motion.div>
            )) || (
              <div className="text-center py-8">
                <FaClock className="text-5xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerDashboard;