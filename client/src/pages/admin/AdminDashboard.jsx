// client/src/pages/admin/AdminDashboard.jsx
import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaCreditCard,
  FaChartBar,
  FaCog,
  FaBell,
  FaSearch,
  FaDownload,
  FaFilter,
  FaEllipsisV,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaEye,
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCalendar,
  FaClock,
  FaStar,
  FaFire,
  FaTrophy,
  FaShieldAlt,
  FaSync,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
  FaExpand,
  FaCompress
} from 'react-icons/fa';
import {
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
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';
import '../../styles/admin/AdminDashboard.css';

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

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [refreshing, setRefreshing] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [stats, setStats] = useState({
    totalUsers: 8543,
    totalUsersChange: '+12.5%',
    totalProperties: 15420,
    totalPropertiesChange: '+8.3%',
    totalRevenue: 1250000,
    totalRevenueChange: '+15.7%',
    activeListings: 12350,
    activeListingsChange: '+5.2%',
    pendingApprovals: 45,
    pendingApprovalsChange: '-2',
    reportedContent: 12,
    reportedContentChange: '+3',
    totalTransactions: 3450,
    avgPropertyPrice: 425000,
    conversionRate: 3.2,
    userGrowth: 12.5,
    revenueGrowth: 15.7,
    systemHealth: 98.5
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const navItems = [
    { path: '/admin', label: 'Overview', icon: FaChartBar, badge: null },
    { path: '/admin/users', label: 'Users', icon: FaUsers, badge: '8.5K' },
    { path: '/admin/properties', label: 'Properties', icon: FaBuilding, badge: '15K' },
    { path: '/admin/transactions', label: 'Transactions', icon: FaCreditCard, badge: null },
    { path: '/admin/reports', label: 'Reports', icon: FaChartBar, badge: null },
    { path: '/admin/settings', label: 'Settings', icon: FaCog, badge: null },
  ];

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

      setRecentUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'https://i.pravatar.cc/150?img=1', role: 'buyer', status: 'active', joined: '2024-01-15', properties: 3 },
        { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', avatar: 'https://i.pravatar.cc/150?img=2', role: 'seller', status: 'active', joined: '2024-01-14', properties: 8 },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', avatar: 'https://i.pravatar.cc/150?img=3', role: 'buyer', status: 'pending', joined: '2024-01-13', properties: 0 },
        { id: 4, name: 'Emma Wilson', email: 'emma@example.com', avatar: 'https://i.pravatar.cc/150?img=4', role: 'seller', status: 'active', joined: '2024-01-12', properties: 5 },
        { id: 5, name: 'David Brown', email: 'david@example.com', avatar: 'https://i.pravatar.cc/150?img=5', role: 'agent', status: 'active', joined: '2024-01-11', properties: 12 },
      ]);

      setRecentProperties([
        { id: 1, title: 'Luxury Villa', seller: 'Jane Doe', price: 2500000, status: 'pending', date: '2024-01-15', views: 245, favorites: 34, image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400' },
        { id: 2, title: 'Downtown Apartment', seller: 'Bob Smith', price: 450000, status: 'active', date: '2024-01-14', views: 189, favorites: 28, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400' },
        { id: 3, title: 'Beach House', seller: 'Alice Brown', price: 1200000, status: 'pending', date: '2024-01-13', views: 312, favorites: 45, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400' },
        { id: 4, title: 'Mountain Cabin', seller: 'Tom Wilson', price: 680000, status: 'rejected', date: '2024-01-12', views: 156, favorites: 19, image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400' },
        { id: 5, title: 'Urban Loft', seller: 'Lisa Garcia', price: 890000, status: 'active', date: '2024-01-11', views: 278, favorites: 41, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400' },
      ]);

      setRecentTransactions([
        { id: 1, property: 'Ocean View Villa', buyer: 'John Smith', seller: 'Sarah Johnson', amount: 1250000, status: 'completed', date: '2024-01-15', commission: 62500 },
        { id: 2, property: 'City Apartment', buyer: 'Mike Brown', seller: 'Emma Davis', amount: 450000, status: 'pending', date: '2024-01-14', commission: 22500 },
        { id: 3, property: 'Suburban House', buyer: 'Lisa White', seller: 'Tom Garcia', amount: 780000, status: 'completed', date: '2024-01-13', commission: 39000 },
      ]);

      setTopSellers([
        { id: 1, name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?img=10', properties: 24, revenue: 12500000, rating: 4.9 },
        { id: 2, name: 'Mike Anderson', avatar: 'https://i.pravatar.cc/150?img=11', properties: 19, revenue: 9800000, rating: 4.8 },
        { id: 3, name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?img=12', properties: 16, revenue: 8200000, rating: 4.7 },
        { id: 4, name: 'David Lee', avatar: 'https://i.pravatar.cc/150?img=13', properties: 14, revenue: 7100000, rating: 4.8 },
      ]);

      setRecentActivity([
        { id: 1, type: 'user', action: 'New user registered', user: 'John Doe', time: '5 mins ago', icon: FaUserPlus, color: 'green' },
        { id: 2, type: 'property', action: 'Property submitted for review', user: 'Sarah Smith', time: '12 mins ago', icon: FaBuilding, color: 'blue' },
        { id: 3, type: 'transaction', action: 'Transaction completed', user: 'Mike Johnson', time: '25 mins ago', icon: FaCheckCircle, color: 'green' },
        { id: 4, type: 'report', action: 'Content reported', user: 'Anonymous', time: '45 mins ago', icon: FaExclamationCircle, color: 'red' },
        { id: 5, type: 'property', action: 'Property approved', user: 'Admin', time: '1 hour ago', icon: FaCheckCircle, color: 'green' },
      ]);

      setNotifications([
        { id: 1, title: '45 properties pending approval', message: 'Review and approve pending listings', type: 'warning', time: '10 mins ago', read: false },
        { id: 2, title: '12 reported contents', message: 'Investigate reported properties and users', type: 'error', time: '30 mins ago', read: false },
        { id: 3, title: 'System backup completed', message: 'Daily backup successful', type: 'success', time: '2 hours ago', read: true },
        { id: 4, title: 'New feature update available', message: 'Update to version 2.1.0', type: 'info', time: '5 hours ago', read: true },
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    toast.success('Dashboard refreshed!', { icon: '🔄' });
    setRefreshing(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  // Chart Data
  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Users',
        data: [4200, 5100, 5800, 6500, 7200, 7800, 8543],
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

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue',
        data: [850000, 920000, 980000, 1050000, 1150000, 1200000, 1250000],
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(34, 197, 94, 0.8)');
          gradient.addColorStop(1, 'rgba(34, 197, 94, 0.1)');
          return gradient;
        },
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const propertyStatusData = {
    labels: ['Active', 'Pending', 'Sold', 'Rejected', 'Expired'],
    datasets: [
      {
        data: [12350, 45, 2800, 125, 100],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderColor: '#fff',
        borderWidth: 3,
        hoverOffset: 15,
      },
    ],
  };

  const userRolesData = {
    labels: ['Buyers', 'Sellers', 'Agents', 'Admin'],
    datasets: [
      {
        data: [5200, 2100, 1200, 43],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(251, 146, 60, 0.8)',
        ],
        borderColor: '#fff',
        borderWidth: 3,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Admin Dashboard - HomeScape" description="Admin control panel" />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
        {/* Enhanced Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: sidebarCollapsed ? '80px' : '280px' }}
          className="bg-gradient-to-b from-slate-900 to-slate-800 text-white fixed h-full shadow-2xl z-50 overflow-hidden"
        >
          {/* Logo Section */}
          <div className="p-6 border-b border-slate-700">
            <Link to="/" className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg"
              >
                <FaHome className="text-white text-2xl" />
              </motion.div>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="text-xl font-bold">HomeScape</span>
                  <span className="block text-xs text-gray-400">Admin Panel v2.0</span>
                </motion.div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="mt-8 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative flex items-center gap-4 px-4 py-3 mb-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className={`text-xl ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          isActive ? 'bg-white/20' : 'bg-slate-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Collapse Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute top-20 -right-4 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
          >
            <motion.div
              animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.div>
          </button>

          {/* User Profile */}
          {!sidebarCollapsed && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
              <div className="bg-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-lg">
                      A
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-700 rounded-full"></span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Admin User</p>
                    <p className="text-xs text-gray-400">admin@homescape.com</p>
                  </div>
                  <button className="text-gray-400 hover:text-white">
                    <FaEllipsisV />
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-[280px]'}`}>
          {/* Top Header Bar */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
            <div className="px-8 py-4">
              <div className="flex items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 max-w-2xl">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users, properties, transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-3 ml-6">
                  {/* Period Selector */}
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-medium hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 cursor-pointer"
                  >
                    <option value="24hours">Last 24 Hours</option>
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
                    className="p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all"
                  >
                    <FaSync className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
                  </motion.button>

                  {/* Fullscreen Toggle */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleFullscreen}
                    className="p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all"
                  >
                    {fullscreen ? <FaCompress className="text-gray-600" /> : <FaExpand className="text-gray-600" />}
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
                                    notif.type === 'error' ? 'bg-red-100' :
                                    notif.type === 'warning' ? 'bg-yellow-100' :
                                    notif.type === 'success' ? 'bg-green-100' :
                                    'bg-blue-100'
                                  }`}>
                                    {notif.type === 'error' && <FaExclamationCircle className="text-red-600" />}
                                    {notif.type === 'warning' && <FaExclamationCircle className="text-yellow-600" />}
                                    {notif.type === 'success' && <FaCheckCircle className="text-green-600" />}
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

                  {/* Export Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-200 hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    <FaDownload />
                    Export
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Welcome Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                      Dashboard Overview
                    </h1>
                    <p className="text-gray-600 flex items-center gap-2">
                      <FaClock className="text-gray-400" />
                      Last updated: {new Date().toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* System Health Indicator */}
                    <div className="px-6 py-3 bg-green-50 border-2 border-green-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <div>
                          <p className="text-xs text-gray-600">System Health</p>
                          <p className="text-lg font-bold text-green-600">{stats.systemHealth}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards Grid - Enhanced */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { 
                    label: 'Total Users', 
                    value: stats.totalUsers.toLocaleString(), 
                    change: stats.totalUsersChange,
                    trend: 'up',
                    icon: FaUsers, 
                    color: 'blue',
                    gradient: 'from-blue-500 to-blue-600',
                    description: 'Active accounts'
                  },
                  { 
                    label: 'Properties', 
                    value: stats.totalProperties.toLocaleString(), 
                    change: stats.totalPropertiesChange,
                    trend: 'up',
                    icon: FaBuilding, 
                    color: 'green',
                    gradient: 'from-green-500 to-emerald-600',
                    description: 'Total listings'
                  },
                  { 
                    label: 'Revenue', 
                    value: `$${(stats.totalRevenue / 1000000).toFixed(1)}M`, 
                    change: stats.totalRevenueChange,
                    trend: 'up',
                    icon: FaDollarSign, 
                    color: 'purple',
                    gradient: 'from-purple-500 to-purple-600',
                    description: 'This month'
                  },
                  { 
                    label: 'Active Listings', 
                    value: stats.activeListings.toLocaleString(), 
                    change: stats.activeListingsChange,
                    trend: 'up',
                    icon: FaCheckCircle, 
                    color: 'teal',
                    gradient: 'from-teal-500 to-cyan-600',
                    description: 'Currently live'
                  },
                  { 
                    label: 'Pending Approval', 
                    value: stats.pendingApprovals, 
                    change: stats.pendingApprovalsChange,
                    trend: 'down',
                    icon: FaClock, 
                    color: 'orange',
                    gradient: 'from-orange-500 to-orange-600',
                    description: 'Needs review'
                  },
                  { 
                    label: 'Reported', 
                    value: stats.reportedContent, 
                    change: stats.reportedContentChange,
                    trend: 'up',
                    icon: FaExclamationCircle, 
                    color: 'red',
                    gradient: 'from-red-500 to-red-600',
                    description: 'Flagged content'
                  },
                  { 
                    label: 'Transactions', 
                    value: stats.totalTransactions.toLocaleString(), 
                    change: '+6.2%',
                    trend: 'up',
                    icon: FaCreditCard, 
                    color: 'indigo',
                    gradient: 'from-indigo-500 to-indigo-600',
                    description: 'Completed'
                  },
                  { 
                    label: 'Avg. Price', 
                    value: `$${(stats.avgPropertyPrice / 1000).toFixed(0)}K`, 
                    change: '+2.1%',
                    trend: 'up',
                    icon: FaChartBar, 
                    color: 'pink',
                    gradient: 'from-pink-500 to-pink-600',
                    description: 'Property value'
                  },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                    >
                      {/* Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                      
                      <div className="relative p-6">
                        {/* Icon & Change */}
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-14 h-14 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                            <Icon className="text-white text-2xl" />
                          </div>
                          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold ${
                            stat.trend === 'up' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {stat.trend === 'up' ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
                            {stat.change}
                          </div>
                        </div>

                        {/* Value & Label */}
                        <p className="text-gray-600 text-sm mb-1 font-medium">{stat.label}</p>
                        <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.description}</p>

                        {/* Sparkline or Mini Chart */}
                        <div className="mt-4 h-8 flex items-end gap-1">
                          {[...Array(12)].map((_, i) => (
                            <div
                              key={i}
                              className={`flex-1 bg-gradient-to-t ${stat.gradient} opacity-30 rounded-t`}
                              style={{ height: `${Math.random() * 100}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* User Growth Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">User Growth</h3>
                      <p className="text-sm text-gray-500 mt-1">Monthly user registration trends</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium">
                        Users
                      </button>
                      <button className="px-4 py-2 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">
                        Revenue
                      </button>
                    </div>
                  </div>
                  <div style={{ height: '350px' }}>
                    <Line data={userGrowthData} options={chartOptions} />
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
                </motion.div>
              </div>

              {/* Revenue & User Roles */}
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
                      +{stats.revenueGrowth}%
                    </div>
                  </div>
                  <div style={{ height: '300px' }}>
                    <Line data={revenueData} options={chartOptions} />
                  </div>
                </motion.div>

                {/* User Roles Pie Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">User Roles</h3>
                    <p className="text-sm text-gray-500 mt-1">Distribution by role</p>
                  </div>
                  <div style={{ height: '300px' }}>
                    <Pie data={userRolesData} options={doughnutOptions} />
                  </div>
                </motion.div>
              </div>

              {/* Tables Section */}
              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Recent Users */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FaUsers className="text-blue-600" />
                        Recent Users
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">Latest registrations</p>
                    </div>
                    <Link to="/admin/users" className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
                      View All
                    </Link>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {recentUsers.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  user.role === 'seller' ? 'bg-purple-100 text-purple-700' :
                                  user.role === 'buyer' ? 'bg-blue-100 text-blue-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {user.role}
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">{user.properties} properties</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {user.status}
                            </span>
                            <p className="text-xs text-gray-500 mt-2">{user.joined}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Pending Properties */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FaClock className="text-orange-600" />
                        Pending Approvals
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">Properties awaiting review</p>
                    </div>
                    <Link to="/admin/properties" className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg text-sm font-medium transition-colors">
                      View All
                    </Link>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {recentProperties.filter(p => p.status === 'pending').map((property, index) => (
                      <motion.div
                        key={property.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-20 h-20 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{property.title}</p>
                            <p className="text-sm text-gray-500">by {property.seller}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-sm font-bold text-blue-600">
                                ${property.price.toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <FaEye /> {property.views}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <FaHeart /> {property.favorites}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 font-medium"
                            >
                              Approve
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-red-100 text-red-600 text-xs rounded-lg hover:bg-red-200 font-medium"
                            >
                              Reject
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Top Sellers & Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Sellers */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FaTrophy className="text-yellow-500" />
                        Top Sellers
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Best performing sellers</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {topSellers.map((seller, index) => (
                      <motion.div
                        key={seller.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="relative">
                          <img
                            src={seller.avatar}
                            alt={seller.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                          />
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{seller.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-gray-600">{seller.properties} properties</span>
                            <span className="text-xs text-gray-400">•</span>
                            <div className="flex items-center gap-1">
                              <FaStar className="text-yellow-500 text-xs" />
                              <span className="text-sm font-medium">{seller.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            ${(seller.revenue / 1000000).toFixed(1)}M
                          </p>
                          <p className="text-xs text-gray-500">Revenue</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <FaClock className="text-purple-600" />
                      Recent Activity
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Latest system events</p>
                  </div>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-4"
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            activity.color === 'green' ? 'bg-green-100 text-green-600' :
                            activity.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                            activity.color === 'red' ? 'bg-red-100 text-red-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            <Icon />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-600">{activity.user}</p>
                            <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              {/* Quick Actions Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mt-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Manage Users', icon: FaUsers, link: '/admin/users', color: 'blue', count: '8.5K' },
                    { label: 'Review Properties', icon: FaBuilding, link: '/admin/properties', color: 'green', count: '45' },
                    { label: 'Transactions', icon: FaCreditCard, link: '/admin/transactions', color: 'purple', count: '3.4K' },
                    { label: 'Reports', icon: FaChartBar, link: '/admin/reports', color: 'orange', count: 'New' },
                    { label: 'System Settings', icon: FaCog, link: '/admin/settings', color: 'gray', count: null },
                    { label: 'Security', icon: FaShieldAlt, link: '/admin/security', color: 'red', count: null },
                    { label: 'Analytics', icon: FaChartBar, link: '/admin/analytics', color: 'indigo', count: null },
                    { label: 'Support', icon: FaBell, link: '/admin/support', color: 'teal', count: '12' },
                  ].map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={index}
                        to={action.link}
                        className="relative group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all text-center overflow-hidden"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 opacity-0 group-hover:opacity-10 transition-opacity`} />
                        <div className="relative">
                          <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                            <Icon className="text-white text-2xl" />
                          </div>
                          <p className="font-semibold text-gray-900 mb-1">{action.label}</p>
                          {action.count && (
                            <span className={`inline-block px-3 py-1 bg-${action.color}-100 text-${action.color}-700 text-xs rounded-full font-bold`}>
                              {action.count}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;