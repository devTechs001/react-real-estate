// client/src/pages/client/ClientDashboard.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHeart,
  FaEye,
  FaCalendar,
  FaEnvelope,
  FaChartLine,
  FaSearch,
  FaBell,
  FaMapMarkerAlt,
  FaStar,
  FaBookmark,
  FaClock,
  FaFire,
  FaHome,
  FaDollarSign,
  FaBed,
  FaBath,
  FaExpand,
  FaPhone,
  FaShare,
  FaFilter,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
  FaSync,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaThumbsUp,
  FaComment,
  FaBuilding,
  FaUser,
  FaTrophy,
  FaGift
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
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
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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
  Title,
  Tooltip,
  Legend,
  Filler
);

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewProperty, setQuickViewProperty] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockData = {
        favorites: 12,
        favoritesChange: '+3',
        viewedCount: 45,
        viewedChange: '+8',
        appointments: 5,
        appointmentsChange: '+2',
        unreadMessages: 3,
        messagesChange: '+1',
        savedSearches: 8,
        savedSearchesChange: '+1',
        totalInquiries: 15,
        inquiriesChange: '+4',
        recommendedProperties: 24,
        budget: 750000,
        activityChart: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [5, 8, 6, 12, 9, 15, 10]
        },
        priceRangeChart: {
          labels: ['<300K', '300-500K', '500-700K', '700K-1M', '>1M'],
          data: [8, 15, 12, 7, 3]
        },
        propertyTypeData: {
          labels: ['House', 'Apartment', 'Condo', 'Villa'],
          data: [18, 12, 8, 7]
        },
        recentFavorites: [
          {
            id: 1,
            title: 'Luxury Ocean View Villa',
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
            price: 2500000,
            location: 'Miami Beach, FL',
            bedrooms: 5,
            bathrooms: 4,
            area: 4500,
            rating: 4.9,
            views: 245,
            addedDate: '2 days ago',
            priceChange: '+2.5%'
          },
          {
            id: 2,
            title: 'Modern Downtown Penthouse',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
            price: 1800000,
            location: 'New York, NY',
            bedrooms: 3,
            bathrooms: 3,
            area: 2800,
            rating: 4.8,
            views: 189,
            addedDate: '1 week ago',
            priceChange: '-1.2%'
          },
          {
            id: 3,
            title: 'Cozy Mountain Retreat',
            image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400',
            price: 680000,
            location: 'Aspen, CO',
            bedrooms: 4,
            bathrooms: 3,
            area: 3200,
            rating: 4.7,
            views: 156,
            addedDate: '3 days ago',
            priceChange: '0%'
          }
        ],
        recentlyViewed: [
          {
            id: 4,
            title: 'Suburban Family Home',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
            price: 450000,
            location: 'Austin, TX',
            bedrooms: 4,
            bathrooms: 2,
            area: 2400,
            viewedDate: '2 hours ago'
          },
          {
            id: 5,
            title: 'Beachfront Condo',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
            price: 890000,
            location: 'San Diego, CA',
            bedrooms: 2,
            bathrooms: 2,
            area: 1600,
            viewedDate: '5 hours ago'
          }
        ],
        upcomingAppointments: [
          {
            id: 1,
            property: 'Luxury Ocean View Villa',
            agent: 'Sarah Johnson',
            agentAvatar: 'https://i.pravatar.cc/150?img=1',
            date: '2024-02-15',
            time: '10:00 AM',
            status: 'confirmed',
            type: 'In-person viewing'
          },
          {
            id: 2,
            property: 'Modern Downtown Penthouse',
            agent: 'Mike Anderson',
            agentAvatar: 'https://i.pravatar.cc/150?img=2',
            date: '2024-02-16',
            time: '2:00 PM',
            status: 'pending',
            type: 'Virtual tour'
          }
        ],
        savedSearches: [
          {
            id: 1,
            name: '3BR Houses in Miami',
            criteria: '3 bedrooms • $500K-$800K • Miami, FL',
            newMatches: 5,
            totalMatches: 24,
            frequency: 'Daily',
            lastUpdate: '2 hours ago'
          },
          {
            id: 2,
            name: 'Luxury Condos NYC',
            criteria: '2+ bedrooms • $1M+ • New York, NY',
            newMatches: 2,
            totalMatches: 12,
            frequency: 'Weekly',
            lastUpdate: '1 day ago'
          }
        ],
        recommendedProperties: [
          {
            id: 6,
            title: 'Elegant Townhouse',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
            price: 725000,
            location: 'Boston, MA',
            bedrooms: 3,
            bathrooms: 2,
            area: 2200,
            matchScore: 95,
            reason: 'Matches your budget and preferences'
          },
          {
            id: 7,
            title: 'Garden Villa',
            image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400',
            price: 680000,
            location: 'Portland, OR',
            bedrooms: 4,
            bathrooms: 3,
            area: 2800,
            matchScore: 92,
            reason: 'Similar to your favorites'
          }
        ],
        recentActivity: [
          {
            id: 1,
            type: 'favorite',
            title: 'Added to favorites',
            property: 'Luxury Ocean View Villa',
            time: '2 hours ago',
            icon: FaHeart,
            color: 'red'
          },
          {
            id: 2,
            type: 'view',
            title: 'Viewed property',
            property: 'Suburban Family Home',
            time: '5 hours ago',
            icon: FaEye,
            color: 'blue'
          },
          {
            id: 3,
            type: 'appointment',
            title: 'Scheduled viewing',
            property: 'Modern Downtown Penthouse',
            time: '1 day ago',
            icon: FaCalendar,
            color: 'green'
          },
          {
            id: 4,
            type: 'message',
            title: 'Received message',
            property: 'From Sarah Johnson',
            time: '2 days ago',
            icon: FaEnvelope,
            color: 'purple'
          }
        ],
        marketInsights: {
          avgPrice: 675000,
          priceChange: '+3.2%',
          avgDaysOnMarket: 45,
          competitionLevel: 'High',
          bestTimeToView: 'Weekday mornings'
        }
      };

      setStats(mockData);

      // Mock notifications
      setNotifications([
        {
          id: 1,
          title: '5 new properties match your search',
          message: 'Check out new listings in Miami',
          type: 'info',
          time: '10 mins ago',
          read: false
        },
        {
          id: 2,
          title: 'Price drop alert!',
          message: 'Ocean View Villa reduced by $50K',
          type: 'success',
          time: '2 hours ago',
          read: false
        },
        {
          id: 3,
          title: 'Upcoming appointment reminder',
          message: 'Property viewing tomorrow at 10 AM',
          type: 'warning',
          time: '5 hours ago',
          read: true
        }
      ]);

      setLoading(false);
    } catch (error) {
      toast.error('Failed to load dashboard');
      console.error(error);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    toast.success('Dashboard refreshed!', { icon: '🔄' });
    setRefreshing(false);
  };

  const statCards = [
    {
      icon: FaHeart,
      label: 'Favorites',
      value: stats?.favorites || 0,
      change: stats?.favoritesChange || '+0',
      trend: 'up',
      link: '/client/favorites',
      color: 'red',
      gradient: 'from-red-500 to-pink-600',
      description: 'Saved properties'
    },
    {
      icon: FaEye,
      label: 'Viewed',
      value: stats?.viewedCount || 0,
      change: stats?.viewedChange || '+0',
      trend: 'up',
      link: '/client/view-history',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      description: 'Properties viewed'
    },
    {
      icon: FaCalendar,
      label: 'Appointments',
      value: stats?.appointments || 0,
      change: stats?.appointmentsChange || '+0',
      trend: 'up',
      link: '/client/appointments',
      color: 'green',
      gradient: 'from-green-500 to-emerald-600',
      description: 'Scheduled viewings'
    },
    {
      icon: FaEnvelope,
      label: 'Messages',
      value: stats?.unreadMessages || 0,
      change: stats?.messagesChange || '+0',
      trend: 'up',
      link: '/client/messages',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      description: 'Unread messages'
    },
    {
      icon: FaBookmark,
      label: 'Saved Searches',
      value: stats?.savedSearches || 0,
      change: stats?.savedSearchesChange || '+0',
      trend: 'up',
      link: '/client/saved-searches',
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
      description: 'Active searches'
    },
    {
      icon: FaComment,
      label: 'Inquiries',
      value: stats?.totalInquiries || 0,
      change: stats?.inquiriesChange || '+0',
      trend: 'up',
      link: '/client/inquiries',
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-600',
      description: 'Sent inquiries'
    }
  ];

  // Chart configurations
  const activityData = {
    labels: stats?.activityChart?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Property Views',
        data: stats?.activityChart?.data || [5, 8, 6, 12, 9, 15, 10],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const priceRangeData = {
    labels: stats?.priceRangeChart?.labels || ['<300K', '300-500K', '500-700K', '700K-1M', '>1M'],
    datasets: [
      {
        label: 'Properties Viewed',
        data: stats?.priceRangeChart?.data || [8, 15, 12, 7, 3],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const propertyTypeData = {
    labels: stats?.propertyTypeData?.labels || ['House', 'Apartment', 'Condo', 'Villa'],
    datasets: [
      {
        data: stats?.propertyTypeData?.data || [18, 12, 8, 7],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: '#fff',
        borderWidth: 3,
        hoverOffset: 15,
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
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        }
      }
    }
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
        }
      },
    },
    cutout: '65%',
  };

  if (loading) {
    return <Loader fullScreen />;
  }

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
                Welcome Back! 👋
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 flex items-center gap-2"
              >
                <FaClock className="text-gray-400" />
                Last login: {new Date().toLocaleString()}
              </motion.p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Period Selector */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-medium hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>

              {/* Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-medium hover:border-gray-300 transition-all flex items-center gap-2"
              >
                <FaSync className={`${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </motion.button>

              {/* Notifications */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all"
                >
                  <FaBell className="text-gray-600 text-xl" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </motion.button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                              !notif.read ? 'bg-blue-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                notif.type === 'success' ? 'bg-green-100' :
                                notif.type === 'warning' ? 'bg-yellow-100' :
                                'bg-blue-100'
                              }`}>
                                {notif.type === 'success' && <FaCheckCircle className="text-green-600" />}
                                {notif.type === 'warning' && <FaExclamationCircle className="text-yellow-600" />}
                                {notif.type === 'info' && <FaBell className="text-blue-600" />}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 text-sm">{notif.title}</p>
                                <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                              </div>
                              {!notif.read && (
                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Browse Properties Button */}
              <Link
                to="/properties"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-200 hover:shadow-xl transition-all flex items-center gap-2"
              >
                <FaSearch />
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom pt-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => navigate(card.link)}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />

                <div className="relative p-6">
                  {/* Icon & Change */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${card.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="text-white text-2xl" />
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

                  {/* Value & Label */}
                  <p className="text-gray-600 text-sm mb-1 font-medium">{card.label}</p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">{card.value}</p>
                  <p className="text-xs text-gray-500">{card.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts & Market Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Your Activity</h3>
                <p className="text-sm text-gray-500 mt-1">Daily property browsing trends</p>
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <Line data={activityData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Market Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center gap-2 mb-6">
              <FaChartLine className="text-3xl" />
              <h3 className="text-2xl font-bold">Market Insights</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm text-white/80 mb-1">Average Price</p>
                <p className="text-3xl font-bold">${(stats?.marketInsights?.avgPrice / 1000).toFixed(0)}K</p>
                <p className="text-sm text-green-300 flex items-center gap-1 mt-1">
                  <FaArrowUp className="text-xs" />
                  {stats?.marketInsights?.priceChange}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm text-white/80 mb-1">Avg. Days on Market</p>
                <p className="text-3xl font-bold">{stats?.marketInsights?.avgDaysOnMarket}</p>
                <p className="text-sm text-white/60 mt-1">Days</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm text-white/80 mb-1">Competition Level</p>
                <p className="text-xl font-bold">{stats?.marketInsights?.competitionLevel}</p>
                <div className="mt-2 bg-white/20 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm text-white/80 mb-1">💡 Best Time to View</p>
                <p className="text-sm font-medium">{stats?.marketInsights?.bestTimeToView}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Price Range & Property Type Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Price Range Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Price Range Preferences</h3>
              <p className="text-sm text-gray-500 mt-1">Properties viewed by price range</p>
            </div>
            <div style={{ height: '300px' }}>
              <Bar data={priceRangeData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Property Type Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Property Type Interest</h3>
              <p className="text-sm text-gray-500 mt-1">Your browsing preferences</p>
            </div>
            <div style={{ height: '300px' }}>
              <Doughnut data={propertyTypeData} options={doughnutOptions} />
            </div>
          </motion.div>
        </div>

        {/* Recent Favorites & Recently Viewed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Favorites */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaHeart className="text-red-600" />
                  Recent Favorites
                </h2>
                <p className="text-sm text-gray-500 mt-1">Your saved properties</p>
              </div>
              <Link to="/client/favorites" className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {stats?.recentFavorites?.slice(0, 3).map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/properties/${property.id}`)}
                >
                  <div className="flex gap-4">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{property.title}</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                        <FaMapMarkerAlt className="text-xs" />
                        {property.location}
                      </p>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <FaBed /> {property.bedrooms}
                        </span>
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <FaBath /> {property.bathrooms}
                        </span>
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <FaExpand /> {property.area} sqft
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-blue-600">
                          ${property.price.toLocaleString()}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          property.priceChange.startsWith('+') ? 'bg-red-100 text-red-700' :
                          property.priceChange.startsWith('-') ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {property.priceChange}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recently Viewed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaEye className="text-blue-600" />
                  Recently Viewed
                </h2>
                <p className="text-sm text-gray-500 mt-1">Your browsing history</p>
              </div>
              <Link to="/client/view-history" className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {stats?.recentlyViewed?.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/properties/${property.id}`)}
                >
                  <div className="flex gap-4">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{property.title}</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                        <FaMapMarkerAlt className="text-xs" />
                        {property.location}
                      </p>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-gray-600">{property.bedrooms} bed</span>
                        <span className="text-sm text-gray-600">{property.bathrooms} bath</span>
                        <span className="text-sm text-gray-600">{property.area} sqft</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-blue-600">
                          ${property.price.toLocaleString()}
                        </p>
                        <span className="text-xs text-gray-500">{property.viewedDate}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Saved Searches & Upcoming Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Saved Searches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FaBookmark className="text-orange-600" />
                  Saved Searches
                </h3>
                <p className="text-sm text-gray-500 mt-1">Your custom property alerts</p>
              </div>
              <Link to="/client/saved-searches" className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                Manage
              </Link>
            </div>
            <div className="space-y-4">
              {stats?.savedSearches?.map((search, index) => (
                <motion.div
                  key={search.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{search.name}</h4>
                    {search.newMatches > 0 && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                        <FaFire className="text-xs" />
                        {search.newMatches} new
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{search.criteria}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{search.totalMatches} total matches</span>
                    <span>•</span>
                    <span>{search.frequency}</span>
                    <span>•</span>
                    <span>Updated {search.lastUpdate}</span>
                  </div>
                </motion.div>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-orange-400 hover:text-orange-600 transition-colors flex items-center justify-center gap-2 font-medium">
                <FaPlus />
                Create New Search
              </button>
            </div>
          </motion.div>

          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FaCalendar className="text-green-600" />
                  Upcoming Appointments
                </h3>
                <p className="text-sm text-gray-500 mt-1">Scheduled property viewings</p>
              </div>
              <Link to="/client/appointments" className="text-green-600 hover:text-green-700 font-medium text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {stats?.upcomingAppointments?.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border-2 border-gray-100 rounded-xl hover:border-green-200 hover:bg-green-50/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{appointment.property}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={appointment.agentAvatar}
                          alt={appointment.agent}
                          className="w-6 h-6 rounded-full"
                        />
                        <p className="text-sm text-gray-600">{appointment.agent}</p>
                      </div>
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
                      <p className="text-xs text-gray-500 mt-2">{appointment.type}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {appointment.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors">
                      Join Meeting
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">
                      Reschedule
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recommended Properties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 hover:shadow-2xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FaTrophy className="text-yellow-500" />
                Recommended For You
              </h3>
              <p className="text-sm text-gray-500 mt-1">Properties matching your preferences</p>
            </div>
            <Link to="/properties?recommended=true" className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors">
              See All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats?.recommendedProperties?.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl overflow-hidden border-2 border-gray-100 hover:border-blue-300 transition-all cursor-pointer"
                onClick={() => navigate(`/properties/${property.id}`)}
              >
                <div className="flex gap-4 p-4">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-32 h-32 rounded-xl object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{property.title}</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                        {property.matchScore}% match
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                      <FaMapMarkerAlt className="text-xs" />
                      {property.location}
                    </p>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm text-gray-600">{property.bedrooms} bed</span>
                      <span className="text-sm text-gray-600">{property.bathrooms} bath</span>
                      <span className="text-sm text-gray-600">{property.area} sqft</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600 mb-2">
                      ${property.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 italic">{property.reason}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
        >
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaClock className="text-purple-600" />
              Recent Activity
            </h3>
            <p className="text-sm text-gray-500 mt-1">Your latest actions</p>
          </div>
          <div className="space-y-4">
            {stats?.recentActivity?.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.color === 'red' ? 'bg-red-100 text-red-600' :
                    activity.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    activity.color === 'green' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <Icon />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.property}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientDashboard;