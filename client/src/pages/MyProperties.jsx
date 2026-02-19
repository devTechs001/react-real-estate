// client/src/pages/MyProperties.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaHeart,
  FaChartLine,
  FaDownload,
  FaFilter,
  FaSearch,
  FaSort,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaExpand,
  FaDollarSign,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaPause,
  FaPlay,
  FaCopy,
  FaShare,
  FaEllipsisV,
  FaThLarge,
  FaList,
  FaTable,
  FaStar,
  FaComment,
  FaCalendar,
  FaSync,
  FaTimes,
  FaCheck,
  FaExclamation,
  FaArrowUp,
  FaArrowDown,
  FaImage,
  FaVideo,
  FaHome
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { propertyService } from '../services/PropertyService';
import PropertyCard from '../components/property/PropertyCard';
import Loader from '../components/common/Loader';
import SEO from '../components/common/SEO';
import toast from 'react-hot-toast';
import '../styles/MyProperties.css';

const MyProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    sold: 0,
    rented: 0,
    paused: 0,
    totalViews: 0,
    totalFavorites: 0,
    totalInquiries: 0,
    avgPrice: 0,
    totalRevenue: 0
  });

  // Advanced filters
  const [advancedFilters, setAdvancedFilters] = useState({
    priceMin: '',
    priceMax: '',
    bedrooms: 'any',
    propertyType: 'all',
    featured: false,
    hasVirtualTour: false
  });

  useEffect(() => {
    fetchMyProperties();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [properties, filter, sortBy, searchQuery, advancedFilters]);

  useEffect(() => {
    calculateStats();
  }, [properties]);

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockProperties = [
        {
          _id: 1,
          title: 'Luxury Ocean View Villa',
          description: 'Stunning waterfront property with panoramic ocean views',
          price: 2500000,
          location: 'Miami Beach, FL',
          city: 'Miami',
          state: 'Florida',
          bedrooms: 5,
          bathrooms: 4,
          area: 4500,
          propertyType: 'Villa',
          status: 'active',
          featured: true,
          images: [
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
          ],
          views: 1245,
          favorites: 89,
          inquiries: 34,
          rating: 4.9,
          hasVirtualTour: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-20T15:30:00Z',
          daysOnMarket: 12,
          priceChange: 0,
          viewsThisWeek: 245,
          impressions: 5420
        },
        {
          _id: 2,
          title: 'Modern Downtown Penthouse',
          description: 'Luxurious penthouse in the heart of the city',
          price: 1800000,
          location: 'New York, NY',
          city: 'New York',
          state: 'New York',
          bedrooms: 3,
          bathrooms: 3,
          area: 2800,
          propertyType: 'Penthouse',
          status: 'active',
          featured: true,
          images: [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
          ],
          views: 2341,
          favorites: 156,
          inquiries: 67,
          rating: 4.8,
          hasVirtualTour: true,
          createdAt: '2024-01-10T14:00:00Z',
          updatedAt: '2024-01-18T09:15:00Z',
          daysOnMarket: 8,
          priceChange: -50000,
          viewsThisWeek: 456,
          impressions: 8930
        },
        {
          _id: 3,
          title: 'Cozy Studio Apartment',
          description: 'Perfect starter home in vibrant neighborhood',
          price: 350000,
          location: 'Austin, TX',
          city: 'Austin',
          state: 'Texas',
          bedrooms: 1,
          bathrooms: 1,
          area: 600,
          propertyType: 'Apartment',
          status: 'pending',
          featured: false,
          images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
          ],
          views: 567,
          favorites: 23,
          inquiries: 12,
          rating: 4.5,
          hasVirtualTour: false,
          createdAt: '2024-01-20T08:00:00Z',
          updatedAt: '2024-01-20T08:00:00Z',
          daysOnMarket: 3,
          priceChange: 0,
          viewsThisWeek: 156,
          impressions: 2340
        },
        {
          _id: 4,
          title: 'Suburban Family Home',
          description: 'Spacious 4-bedroom home with large backyard',
          price: 650000,
          location: 'Portland, OR',
          city: 'Portland',
          state: 'Oregon',
          bedrooms: 4,
          bathrooms: 3,
          area: 3200,
          propertyType: 'House',
          status: 'sold',
          featured: false,
          images: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
          ],
          views: 890,
          favorites: 45,
          inquiries: 28,
          rating: 4.7,
          hasVirtualTour: true,
          createdAt: '2023-12-05T11:00:00Z',
          updatedAt: '2024-01-15T16:00:00Z',
          daysOnMarket: 45,
          priceChange: -25000,
          soldDate: '2024-01-15',
          soldPrice: 625000,
          viewsThisWeek: 0,
          impressions: 12450
        },
        {
          _id: 5,
          title: 'Mountain View Cabin',
          description: 'Rustic cabin with breathtaking mountain views',
          price: 450000,
          location: 'Aspen, CO',
          city: 'Aspen',
          state: 'Colorado',
          bedrooms: 3,
          bathrooms: 2,
          area: 1800,
          propertyType: 'Cabin',
          status: 'paused',
          featured: false,
          images: [
            'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800'
          ],
          views: 412,
          favorites: 34,
          inquiries: 15,
          rating: 4.6,
          hasVirtualTour: false,
          createdAt: '2024-01-12T13:00:00Z',
          updatedAt: '2024-01-19T10:00:00Z',
          daysOnMarket: 15,
          priceChange: 0,
          viewsThisWeek: 89,
          impressions: 3210
        },
        {
          _id: 6,
          title: 'Beachfront Condo',
          description: 'Direct beach access with stunning sunset views',
          price: 890000,
          location: 'San Diego, CA',
          city: 'San Diego',
          state: 'California',
          bedrooms: 2,
          bathrooms: 2,
          area: 1600,
          propertyType: 'Condo',
          status: 'rented',
          featured: true,
          images: [
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
          ],
          views: 1567,
          favorites: 112,
          inquiries: 45,
          rating: 4.9,
          hasVirtualTour: true,
          createdAt: '2023-11-20T09:00:00Z',
          updatedAt: '2023-12-01T14:00:00Z',
          daysOnMarket: 11,
          rentedDate: '2023-12-01',
          monthlyRent: 4500,
          viewsThisWeek: 234,
          impressions: 18920
        }
      ];

      setProperties(mockProperties);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load properties');
      console.error(error);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMyProperties();
    toast.success('Properties refreshed!', { icon: '🔄' });
    setRefreshing(false);
  };

  const calculateStats = () => {
    const total = properties.length;
    const active = properties.filter(p => p.status === 'active').length;
    const pending = properties.filter(p => p.status === 'pending').length;
    const sold = properties.filter(p => p.status === 'sold').length;
    const rented = properties.filter(p => p.status === 'rented').length;
    const paused = properties.filter(p => p.status === 'paused').length;
    
    const totalViews = properties.reduce((sum, p) => sum + p.views, 0);
    const totalFavorites = properties.reduce((sum, p) => sum + p.favorites, 0);
    const totalInquiries = properties.reduce((sum, p) => sum + p.inquiries, 0);
    
    const avgPrice = properties.length > 0 
      ? properties.reduce((sum, p) => sum + p.price, 0) / properties.length 
      : 0;
    
    const totalRevenue = properties
      .filter(p => p.status === 'sold')
      .reduce((sum, p) => sum + (p.soldPrice || p.price), 0);

    setStats({
      total,
      active,
      pending,
      sold,
      rented,
      paused,
      totalViews,
      totalFavorites,
      totalInquiries,
      avgPrice,
      totalRevenue
    });
  };

  const applyFiltersAndSort = () => {
    let filtered = [...properties];

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(p => p.status === filter);
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply advanced filters
    if (advancedFilters.priceMin) {
      filtered = filtered.filter(p => p.price >= Number(advancedFilters.priceMin));
    }
    if (advancedFilters.priceMax) {
      filtered = filtered.filter(p => p.price <= Number(advancedFilters.priceMax));
    }
    if (advancedFilters.bedrooms !== 'any') {
      filtered = filtered.filter(p => p.bedrooms >= Number(advancedFilters.bedrooms));
    }
    if (advancedFilters.propertyType !== 'all') {
      filtered = filtered.filter(p => p.propertyType === advancedFilters.propertyType);
    }
    if (advancedFilters.featured) {
      filtered = filtered.filter(p => p.featured);
    }
    if (advancedFilters.hasVirtualTour) {
      filtered = filtered.filter(p => p.hasVirtualTour);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'favorites':
        filtered.sort((a, b) => b.favorites - a.favorites);
        break;
      case 'inquiries':
        filtered.sort((a, b) => b.inquiries - a.inquiries);
        break;
      default:
        break;
    }

    setFilteredProperties(filtered);
  };

  const handleDelete = async (id) => {
    setPropertyToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await propertyService.deleteProperty(propertyToDelete);
      setProperties(properties.filter((p) => p._id !== propertyToDelete));
      setSelectedProperties(selectedProperties.filter(id => id !== propertyToDelete));
      toast.success('Property deleted successfully');
      setShowDeleteModal(false);
      setPropertyToDelete(null);
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedProperties.length} selected properties?`)) return;

    try {
      await Promise.all(
        selectedProperties.map(id => propertyService.deleteProperty(id))
      );
      setProperties(properties.filter(p => !selectedProperties.includes(p._id)));
      setSelectedProperties([]);
      toast.success(`${selectedProperties.length} properties deleted`);
    } catch (error) {
      toast.error('Failed to delete properties');
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    try {
      // Simulate API calls
      const updatedProperties = properties.map(p =>
        selectedProperties.includes(p._id) ? { ...p, status: newStatus } : p
      );
      setProperties(updatedProperties);
      setSelectedProperties([]);
      toast.success(`${selectedProperties.length} properties updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update properties');
    }
  };

  const toggleSelectProperty = (id) => {
    setSelectedProperties(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedProperties.length === filteredProperties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(filteredProperties.map(p => p._id));
    }
  };

  const duplicateProperty = (property) => {
    navigate('/add-property', { state: { duplicate: property } });
  };

  const shareProperty = (property) => {
    const url = `${window.location.origin}/properties/${property._id}`;
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const exportProperties = () => {
    // Simulate export
    toast.success('Exporting properties...', { icon: '📊' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'sold':
        return 'blue';
      case 'rented':
        return 'purple';
      case 'paused':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return FaCheckCircle;
      case 'pending':
        return FaExclamationCircle;
      case 'sold':
        return FaCheckCircle;
      case 'rented':
        return FaCheckCircle;
      case 'paused':
        return FaPause;
      default:
        return FaTimesCircle;
    }
  };

  const statCards = [
    {
      label: 'Total Properties',
      value: stats.total,
      icon: FaHome,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Active Listings',
      value: stats.active,
      icon: FaCheckCircle,
      color: 'green',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      label: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: FaEye,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Total Favorites',
      value: stats.totalFavorites,
      icon: FaHeart,
      color: 'red',
      gradient: 'from-red-500 to-pink-600'
    },
    {
      label: 'Total Inquiries',
      value: stats.totalInquiries,
      icon: FaComment,
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      label: 'Avg. Price',
      value: `$${(stats.avgPrice / 1000).toFixed(0)}K`,
      icon: FaDollarSign,
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-600'
    }
  ];

  if (loading) return <Loader fullScreen />;

  return (
    <>
      <SEO title="My Properties - HomeScape" description="Manage your property listings" />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container-custom py-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-5xl font-bold mb-3"
                >
                  My Properties
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl text-blue-100"
                >
                  Manage and track your property listings
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  to="/add-property"
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 text-lg group"
                >
                  <FaPlus className="group-hover:rotate-90 transition-transform" />
                  Add New Property
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="container-custom pt-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className="text-white text-xl" />
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Filters & Actions Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            {/* Status Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {[
                { value: 'all', label: 'All', count: stats.total },
                { value: 'active', label: 'Active', count: stats.active },
                { value: 'pending', label: 'Pending', count: stats.pending },
                { value: 'sold', label: 'Sold', count: stats.sold },
                { value: 'rented', label: 'Rented', count: stats.rented },
                { value: 'paused', label: 'Paused', count: stats.paused }
              ].map((status) => (
                <motion.button
                  key={status.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(status.value)}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    filter === status.value
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.label}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    filter === status.value ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {status.count}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Search & Controls */}
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 w-full lg:w-auto">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search properties by title, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Advanced Filters */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    showFilters
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FaFilter />
                  Filters
                </motion.button>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="views">Most Viewed</option>
                  <option value="favorites">Most Favorited</option>
                  <option value="inquiries">Most Inquiries</option>
                </select>

                {/* View Mode */}
                <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
                  {[
                    { mode: 'grid', icon: FaThLarge },
                    { mode: 'list', icon: FaList },
                    { mode: 'table', icon: FaTable }
                  ].map(({ mode, icon: Icon }) => (
                    <motion.button
                      key={mode}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode(mode)}
                      className={`p-3 transition-all ${
                        viewMode === mode
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon />
                    </motion.button>
                  ))}
                </div>

                {/* Refresh */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all"
                >
                  <FaSync className={`${refreshing ? 'animate-spin' : ''}`} />
                </motion.button>

                {/* Export */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportProperties}
                  className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium shadow-lg shadow-green-200 flex items-center gap-2"
                >
                  <FaDownload />
                  Export
                </motion.button>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 mt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      {/* Price Range */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={advancedFilters.priceMin}
                            onChange={(e) => setAdvancedFilters({ ...advancedFilters, priceMin: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={advancedFilters.priceMax}
                            onChange={(e) => setAdvancedFilters({ ...advancedFilters, priceMax: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                          />
                        </div>
                      </div>

                      {/* Bedrooms */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
                        <select
                          value={advancedFilters.bedrooms}
                          onChange={(e) => setAdvancedFilters({ ...advancedFilters, bedrooms: e.target.value })}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                        >
                          <option value="any">Any</option>
                          <option value="1">1+</option>
                          <option value="2">2+</option>
                          <option value="3">3+</option>
                          <option value="4">4+</option>
                          <option value="5">5+</option>
                        </select>
                      </div>

                      {/* Property Type */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
                        <select
                          value={advancedFilters.propertyType}
                          onChange={(e) => setAdvancedFilters({ ...advancedFilters, propertyType: e.target.value })}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                        >
                          <option value="all">All Types</option>
                          <option value="House">House</option>
                          <option value="Apartment">Apartment</option>
                          <option value="Villa">Villa</option>
                          <option value="Condo">Condo</option>
                          <option value="Penthouse">Penthouse</option>
                          <option value="Cabin">Cabin</option>
                        </select>
                      </div>

                      {/* Additional Filters */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Additional</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={advancedFilters.featured}
                              onChange={(e) => setAdvancedFilters({ ...advancedFilters, featured: e.target.checked })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm">Featured Only</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={advancedFilters.hasVirtualTour}
                              onChange={(e) => setAdvancedFilters({ ...advancedFilters, hasVirtualTour: e.target.checked })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm">Virtual Tour</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setAdvancedFilters({
                          priceMin: '',
                          priceMax: '',
                          bedrooms: 'any',
                          propertyType: 'all',
                          featured: false,
                          hasVirtualTour: false
                        })}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                      >
                        Clear Filters
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bulk Actions */}
            <AnimatePresence>
              {selectedProperties.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pt-6 mt-6 border-t border-gray-200"
                >
                  <div className="flex items-center justify-between bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <FaCheckCircle className="text-blue-600 text-xl" />
                      <span className="font-semibold text-gray-900">
                        {selectedProperties.length} properties selected
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleBulkStatusChange('active')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                      >
                        Mark Active
                      </button>
                      <button
                        onClick={() => handleBulkStatusChange('paused')}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700"
                      >
                        Pause
                      </button>
                      <button
                        onClick={handleBulkDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setSelectedProperties([])}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing <span className="font-bold text-gray-900">{filteredProperties.length}</span> of{' '}
              <span className="font-bold text-gray-900">{properties.length}</span> properties
            </p>
            {filteredProperties.length > 0 && (
              <button
                onClick={selectAll}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                {selectedProperties.length === filteredProperties.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>

          {/* Properties List */}
          {filteredProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-16 text-center"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaHome className="text-5xl text-gray-300" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">No Properties Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {filter === 'all'
                  ? searchQuery
                    ? `No properties match "${searchQuery}"`
                    : "You haven't added any properties yet. Start by adding your first listing!"
                  : `No ${filter} properties found. Try adjusting your filters.`}
              </p>
              {filter === 'all' && !searchQuery && (
                <Link
                  to="/add-property"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all"
                >
                  <FaPlus />
                  Add Your First Property
                </Link>
              )}
            </motion.div>
          ) : (
            <>
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property, index) => (
                    <PropertyGridCard
                      key={property._id}
                      property={property}
                      index={index}
                      selected={selectedProperties.includes(property._id)}
                      onSelect={toggleSelectProperty}
                      onDelete={handleDelete}
                      onDuplicate={duplicateProperty}
                      onShare={shareProperty}
                      getStatusColor={getStatusColor}
                      getStatusIcon={getStatusIcon}
                    />
                  ))}
                </div>
              )}

              {viewMode === 'list' && (
                <div className="space-y-4">
                  {filteredProperties.map((property, index) => (
                    <PropertyListCard
                      key={property._id}
                      property={property}
                      index={index}
                      selected={selectedProperties.includes(property._id)}
                      onSelect={toggleSelectProperty}
                      onDelete={handleDelete}
                      onDuplicate={duplicateProperty}
                      onShare={shareProperty}
                      getStatusColor={getStatusColor}
                      getStatusIcon={getStatusIcon}
                    />
                  ))}
                </div>
              )}

              {viewMode === 'table' && (
                <PropertyTable
                  properties={filteredProperties}
                  selectedProperties={selectedProperties}
                  onSelect={toggleSelectProperty}
                  onDelete={handleDelete}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaTrash className="text-3xl text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">Delete Property?</h3>
              <p className="text-gray-600 text-center mb-8">
                This action cannot be undone. The property will be permanently deleted from your listings.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Grid Card Component
const PropertyGridCard = ({ property, index, selected, onSelect, onDelete, onDuplicate, onShare, getStatusColor, getStatusIcon }) => {
  const [showActions, setShowActions] = useState(false);
  const StatusIcon = getStatusIcon(property.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all ${
        selected ? 'ring-4 ring-blue-500' : ''
      }`}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Checkbox */}
        <div className="absolute top-4 left-4 z-10">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(property._id)}
            className="w-5 h-5 rounded cursor-pointer"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {property.featured && (
            <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold flex items-center gap-1">
              <FaStar /> Featured
            </span>
          )}
          <span className={`px-3 py-1 bg-${getStatusColor(property.status)}-500 text-white rounded-full text-xs font-bold flex items-center gap-1`}>
            <StatusIcon className="text-xs" />
            {property.status}
          </span>
        </div>

        {/* Quick Stats */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FaEye /> {property.views}
            </span>
            <span className="flex items-center gap-1">
              <FaHeart /> {property.favorites}
            </span>
            <span className="flex items-center gap-1">
              <FaComment /> {property.inquiries}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{property.title}</h3>
        <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
          <FaMapMarkerAlt className="text-xs" />
          {property.location}
        </p>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <FaBed /> {property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <FaBath /> {property.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <FaExpand /> {property.area} sqft
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-2xl font-bold text-blue-600">
            ${property.price.toLocaleString()}
          </p>
          {property.hasVirtualTour && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold flex items-center gap-1">
              <FaVideo /> Tour
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Link
            to={`/properties/${property._id}`}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
          >
            <FaEye /> View
          </Link>
          <Link
            to={`/edit-property/${property._id}`}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
          >
            <FaEdit /> Edit
          </Link>
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <FaEllipsisV />
            </button>
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-10"
                >
                  <button
                    onClick={() => {
                      onDuplicate(property);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FaCopy /> Duplicate
                  </button>
                  <button
                    onClick={() => {
                      onShare(property);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FaShare /> Share
                  </button>
                  <button
                    onClick={() => {
                      onDelete(property._id);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                  >
                    <FaTrash /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// List Card Component
const PropertyListCard = ({ property, index, selected, onSelect, onDelete, onDuplicate, onShare, getStatusColor, getStatusIcon }) => {
  const StatusIcon = getStatusIcon(property.status);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all flex ${
        selected ? 'ring-4 ring-blue-500' : ''
      }`}
    >
      {/* Checkbox */}
      <div className="flex items-center pl-6">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(property._id)}
          className="w-5 h-5 rounded cursor-pointer"
        />
      </div>

      {/* Image */}
      <div className="w-72 h-48 flex-shrink-0 relative overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover hover:scale-110 transition-transform"
        />
        {property.featured && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
            ⭐ Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h3>
            <p className="text-gray-500 flex items-center gap-1">
              <FaMapMarkerAlt className="text-sm" />
              {property.location}
            </p>
          </div>
          <span className={`px-4 py-2 bg-${getStatusColor(property.status)}-100 text-${getStatusColor(property.status)}-700 rounded-full text-sm font-bold flex items-center gap-2`}>
            <StatusIcon />
            {property.status}
          </span>
        </div>

        <div className="flex items-center gap-6 mb-4 text-gray-600">
          <span className="flex items-center gap-2">
            <FaBed className="text-gray-400" />
            {property.bedrooms} Beds
          </span>
          <span className="flex items-center gap-2">
            <FaBath className="text-gray-400" />
            {property.bathrooms} Baths
          </span>
          <span className="flex items-center gap-2">
            <FaExpand className="text-gray-400" />
            {property.area} sqft
          </span>
          <span className="flex items-center gap-2">
            <FaEye className="text-gray-400" />
            {property.views} views
          </span>
          <span className="flex items-center gap-2">
            <FaHeart className="text-gray-400" />
            {property.favorites}
          </span>
          <span className="flex items-center gap-2">
            <FaComment className="text-gray-400" />
            {property.inquiries}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-blue-600">
            ${property.price.toLocaleString()}
          </p>
          <div className="flex gap-2">
            <Link
              to={`/properties/${property._id}`}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
            >
              <FaEye className="inline mr-2" />
              View
            </Link>
            <Link
              to={`/edit-property/${property._id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              <FaEdit className="inline mr-2" />
              Edit
            </Link>
            <button
              onClick={() => onShare(property)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
            >
              <FaShare />
            </button>
            <button
              onClick={() => onDelete(property._id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Table Component
const PropertyTable = ({ properties, selectedProperties, onSelect, onDelete, getStatusColor, getStatusIcon }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedProperties.length === properties.length}
                  onChange={() => {}}
                  className="w-5 h-5 rounded"
                />
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Property</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Price</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Views</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Favorites</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Inquiries</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {properties.map((property) => {
              const StatusIcon = getStatusIcon(property.status);
              return (
                <tr key={property._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProperties.includes(property._id)}
                      onChange={() => onSelect(property._id)}
                      className="w-5 h-5 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{property.title}</p>
                        <p className="text-sm text-gray-500">{property.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 bg-${getStatusColor(property.status)}-100 text-${getStatusColor(property.status)}-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit`}>
                      <StatusIcon />
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-blue-600">${property.price.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{property.views.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{property.favorites}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{property.inquiries}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/edit-property/${property._id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => onDelete(property._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyProperties;