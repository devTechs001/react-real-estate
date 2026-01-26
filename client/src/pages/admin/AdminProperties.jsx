// client/src/pages/admin/AdminProperties.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setProperties([
      {
        id: 1,
        title: 'Luxury Waterfront Villa',
        description: 'Stunning waterfront property with panoramic ocean views, private dock, and resort-style amenities.',
        price: 2500000,
        location: 'Miami Beach, FL',
        address: '123 Ocean Drive, Miami Beach, FL 33139',
        seller: { 
          id: 1, 
          name: 'Sarah Mitchell', 
          email: 'sarah@example.com',
          phone: '+1 (305) 555-0123',
          verified: true
        },
        status: 'active',
        featured: true,
        views: 2450,
        inquiries: 18,
        favorites: 45,
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
        ],
        createdAt: '2024-01-15',
        reported: false,
        propertyType: 'Villa',
        bedrooms: 5,
        bathrooms: 4,
        area: 4500,
        listingType: 'sale'
      },
      {
        id: 2,
        title: 'Modern Downtown Penthouse',
        description: 'Spectacular penthouse in the heart of Manhattan with floor-to-ceiling windows and private terrace.',
        price: 1800000,
        location: 'New York, NY',
        address: '456 Park Avenue, New York, NY 10022',
        seller: { 
          id: 2, 
          name: 'John Anderson', 
          email: 'john@example.com',
          phone: '+1 (212) 555-0456',
          verified: true
        },
        status: 'pending',
        featured: false,
        views: 0,
        inquiries: 0,
        favorites: 0,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
        ],
        createdAt: '2024-01-18',
        reported: false,
        propertyType: 'Penthouse',
        bedrooms: 3,
        bathrooms: 3,
        area: 2800,
        listingType: 'sale'
      },
      {
        id: 3,
        title: 'Suspicious Listing - Too Good Price',
        description: 'This listing has been reported for suspicious pricing and potential fraud.',
        price: 100000,
        location: 'Unknown Location',
        address: 'Address not verified',
        seller: { 
          id: 3, 
          name: 'Unknown User', 
          email: 'suspicious@example.com',
          phone: '+1 (000) 000-0000',
          verified: false
        },
        status: 'flagged',
        featured: false,
        views: 50,
        inquiries: 3,
        favorites: 2,
        image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400',
        images: [],
        createdAt: '2024-01-17',
        reported: true,
        reportReason: 'Suspicious pricing - property listed at 90% below market value',
        reportCount: 5,
        propertyType: 'House',
        bedrooms: 4,
        bathrooms: 3,
        area: 3000,
        listingType: 'sale'
      },
      {
        id: 4,
        title: 'Cozy Mountain Cabin',
        description: 'Charming cabin retreat in the mountains with stunning views and modern amenities.',
        price: 450000,
        location: 'Aspen, CO',
        address: '789 Mountain View Rd, Aspen, CO 81611',
        seller: { 
          id: 4, 
          name: 'Emily Davis', 
          email: 'emily@example.com',
          phone: '+1 (970) 555-0789',
          verified: true
        },
        status: 'active',
        featured: false,
        views: 890,
        inquiries: 12,
        favorites: 28,
        image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400',
        images: [],
        createdAt: '2024-01-10',
        reported: false,
        propertyType: 'Cabin',
        bedrooms: 3,
        bathrooms: 2,
        area: 1800,
        listingType: 'sale'
      },
      {
        id: 5,
        title: 'Urban Loft Apartment',
        description: 'Industrial-chic loft in vibrant neighborhood with exposed brick and high ceilings.',
        price: 3500,
        location: 'Brooklyn, NY',
        address: '321 Warehouse St, Brooklyn, NY 11201',
        seller: { 
          id: 5, 
          name: 'Michael Chen', 
          email: 'michael@example.com',
          phone: '+1 (718) 555-0321',
          verified: true
        },
        status: 'pending',
        featured: false,
        views: 0,
        inquiries: 0,
        favorites: 0,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
        images: [],
        createdAt: '2024-01-19',
        reported: false,
        propertyType: 'Apartment',
        bedrooms: 2,
        bathrooms: 1,
        area: 1200,
        listingType: 'rent'
      },
      {
        id: 6,
        title: 'Beachfront Condo',
        description: 'Direct beach access condo with updated interiors and resort amenities.',
        price: 750000,
        location: 'San Diego, CA',
        address: '555 Coastal Blvd, San Diego, CA 92109',
        seller: { 
          id: 6, 
          name: 'Lisa Thompson', 
          email: 'lisa@example.com',
          phone: '+1 (619) 555-0555',
          verified: true
        },
        status: 'rejected',
        featured: false,
        views: 320,
        inquiries: 0,
        favorites: 5,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
        images: [],
        createdAt: '2024-01-12',
        reported: false,
        rejectionReason: 'Duplicate listing - property already listed by another agent',
        propertyType: 'Condo',
        bedrooms: 2,
        bathrooms: 2,
        area: 1100,
        listingType: 'sale'
      }
    ]);
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      flagged: 'bg-red-500/20 text-red-400 border-red-500/30',
      rejected: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return styles[status] || styles.pending;
  };

  const updatePropertyStatus = async (id, newStatus) => {
    setActionLoading(id);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProperties(prev => prev.map(property => 
      property.id === id ? { ...property, status: newStatus } : property
    ));
    
    setActionLoading(null);
    toast.success(`Property ${newStatus === 'active' ? 'approved' : newStatus}`);
    
    if (showDetailsModal) {
      setShowDetailsModal(false);
      setSelectedProperty(null);
    }
  };

  const toggleFeatured = async (id) => {
    setActionLoading(id);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProperties(prev => prev.map(property => 
      property.id === id ? { ...property, featured: !property.featured } : property
    ));
    
    const property = properties.find(p => p.id === id);
    setActionLoading(null);
    toast.success(`Property ${property?.featured ? 'removed from' : 'marked as'} featured`);
  };

  const deleteProperty = async () => {
    if (!selectedProperty) return;
    
    setActionLoading(selectedProperty.id);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProperties(prev => prev.filter(property => property.id !== selectedProperty.id));
    setShowDeleteModal(false);
    setSelectedProperty(null);
    setActionLoading(null);
    toast.success('Property deleted successfully');
  };

  // Sorting
  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      case 'views':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  // Filtering
  const filteredProperties = sortedProperties.filter(property => {
    const matchesFilter = filter === 'all' || property.status === filter;
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.seller.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Stats
  const stats = {
    total: properties.length,
    active: properties.filter(p => p.status === 'active').length,
    pending: properties.filter(p => p.status === 'pending').length,
    flagged: properties.filter(p => p.status === 'flagged').length
  };

  return (
    <>
      <SEO title="Properties - Admin Dashboard" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Property Management</h1>
          <p className="text-slate-400">Review and manage all property listings</p>
        </div>
        <Link
          to="/admin/properties/reports"
          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{stats.flagged} Reported</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, icon: '🏠', color: 'blue' },
          { label: 'Active', value: stats.active, icon: '✅', color: 'green' },
          { label: 'Pending', value: stats.pending, icon: '⏳', color: 'yellow' },
          { label: 'Flagged', value: stats.flagged, icon: '⚠️', color: 'red' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-slate-800 rounded-xl p-4 border border-${stat.color}-500/20`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-800 rounded-2xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search properties, locations, sellers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="views">Most Viewed</option>
          </select>

          {/* Status Filters */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'active', 'pending', 'flagged', 'rejected'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm capitalize transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-slate-800 rounded-2xl overflow-hidden animate-pulse">
              <div className="h-48 bg-slate-700" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-slate-700 rounded w-3/4" />
                <div className="h-4 bg-slate-700 rounded w-1/2" />
                <div className="h-6 bg-slate-700 rounded w-1/3" />
                <div className="flex gap-2 pt-4">
                  <div className="h-8 bg-slate-700 rounded flex-1" />
                  <div className="h-8 bg-slate-700 rounded flex-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-16 bg-slate-800 rounded-2xl">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Properties Found</h3>
          <p className="text-slate-400">
            {searchTerm || filter !== 'all' 
              ? 'Try adjusting your filters or search term'
              : 'No properties have been listed yet'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-slate-800 rounded-2xl overflow-hidden border ${
                  property.reported ? 'border-red-500' : 'border-slate-700'
                } hover:border-slate-600 transition-colors`}
              >
                {/* Property Image */}
                <div className="relative h-48 group">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize border ${getStatusBadge(property.status)}`}>
                      {property.status}
                    </span>
                    {property.featured && (
                      <span className="px-2 py-1 bg-yellow-500 text-yellow-900 rounded-full text-xs font-medium">
                        ⭐ Featured
                      </span>
                    )}
                  </div>

                  {/* Reported Badge */}
                  {property.reported && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs flex items-center gap-1">
                        ⚠️ {property.reportCount} Reports
                      </span>
                    </div>
                  )}

                  {/* Listing Type */}
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      property.listingType === 'sale' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-purple-500 text-white'
                    }`}>
                      For {property.listingType === 'sale' ? 'Sale' : 'Rent'}
                    </span>
                  </div>

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedProperty(property);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <Link
                      to={`/properties/${property.id}`}
                      target="_blank"
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      title="View on Site"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Property Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-white truncate mb-1">{property.title}</h3>
                  <p className="text-slate-400 text-sm flex items-center gap-1 mb-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {property.location}
                  </p>
                  <p className="text-blue-400 font-bold text-lg">
                    ${property.price.toLocaleString()}
                    {property.listingType === 'rent' && <span className="text-sm font-normal">/mo</span>}
                  </p>

                  {/* Property Stats */}
                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {property.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {property.favorites}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {property.inquiries}
                    </span>
                  </div>

                  {/* Seller Info */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {property.seller.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate flex items-center gap-1">
                        {property.seller.name}
                        {property.seller.verified && (
                          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(property.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    {property.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updatePropertyStatus(property.id, 'active')}
                          disabled={actionLoading === property.id}
                          className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          {actionLoading === property.id ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => updatePropertyStatus(property.id, 'rejected')}
                          disabled={actionLoading === property.id}
                          className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    
                    {property.status === 'active' && (
                      <>
                        <button
                          onClick={() => toggleFeatured(property.id)}
                          disabled={actionLoading === property.id}
                          className={`flex-1 py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 ${
                            property.featured
                              ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          {property.featured ? 'Unfeature' : 'Feature'}
                        </button>
                        <button
                          onClick={() => updatePropertyStatus(property.id, 'flagged')}
                          disabled={actionLoading === property.id}
                          className="flex-1 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          Flag
                        </button>
                      </>
                    )}
                    
                    {property.status === 'flagged' && (
                      <>
                        <button
                          onClick={() => updatePropertyStatus(property.id, 'active')}
                          disabled={actionLoading === property.id}
                          className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          Restore
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowDeleteModal(true);
                          }}
                          disabled={actionLoading === property.id}
                          className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </>
                    )}

                    {property.status === 'rejected' && (
                      <>
                        <button
                          onClick={() => updatePropertyStatus(property.id, 'pending')}
                          disabled={actionLoading === property.id}
                          className="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          Reconsider
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowDeleteModal(true);
                          }}
                          disabled={actionLoading === property.id}
                          className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Property Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowDetailsModal(false);
              setSelectedProperty(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative h-64">
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-transparent to-transparent" />
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedProperty(null);
                  }}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize border ${getStatusBadge(selectedProperty.status)}`}>
                      {selectedProperty.status}
                    </span>
                    {selectedProperty.featured && (
                      <span className="px-2 py-1 bg-yellow-500 text-yellow-900 rounded-full text-xs font-medium">
                        ⭐ Featured
                      </span>
                    )}
                    {selectedProperty.reported && (
                      <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs">
                        ⚠️ Reported
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedProperty.title}</h2>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Price & Location */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-3xl font-bold text-blue-400">
                      ${selectedProperty.price.toLocaleString()}
                      {selectedProperty.listingType === 'rent' && <span className="text-lg">/mo</span>}
                    </p>
                    <p className="text-slate-400">{selectedProperty.address}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedProperty.listingType === 'sale' 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    For {selectedProperty.listingType === 'sale' ? 'Sale' : 'Rent'}
                  </span>
                </div>

                {/* Property Details Grid */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                    <p className="text-slate-400 text-xs mb-1">Type</p>
                    <p className="text-white font-semibold">{selectedProperty.propertyType}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                    <p className="text-slate-400 text-xs mb-1">Beds</p>
                    <p className="text-white font-semibold">{selectedProperty.bedrooms}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                    <p className="text-slate-400 text-xs mb-1">Baths</p>
                    <p className="text-white font-semibold">{selectedProperty.bathrooms}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                    <p className="text-slate-400 text-xs mb-1">Area</p>
                    <p className="text-white font-semibold">{selectedProperty.area.toLocaleString()} ft²</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                  <p className="text-slate-300">{selectedProperty.description}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <p className="text-slate-400 text-sm mb-1">Views</p>
                    <p className="text-2xl font-bold text-white">{selectedProperty.views.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <p className="text-slate-400 text-sm mb-1">Favorites</p>
                    <p className="text-2xl font-bold text-white">{selectedProperty.favorites}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <p className="text-slate-400 text-sm mb-1">Inquiries</p>
                    <p className="text-2xl font-bold text-white">{selectedProperty.inquiries}</p>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Seller Information</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                      {selectedProperty.seller.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium flex items-center gap-2">
                        {selectedProperty.seller.name}
                        {selectedProperty.seller.verified && (
                          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </p>
                      <p className="text-slate-400 text-sm">{selectedProperty.seller.email}</p>
                      <p className="text-slate-400 text-sm">{selectedProperty.seller.phone}</p>
                    </div>
                    <Link
                      to={`/admin/users/${selectedProperty.seller.id}`}
                      className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors text-sm"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>

                {/* Report Info */}
                {selectedProperty.reported && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                    <h3 className="text-lg font-semibold text-red-400 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Report Details
                    </h3>
                    <p className="text-slate-300">{selectedProperty.reportReason}</p>
                    <p className="text-slate-400 text-sm mt-2">{selectedProperty.reportCount} users have reported this listing</p>
                  </div>
                )}

                {/* Rejection Reason */}
                {selectedProperty.status === 'rejected' && selectedProperty.rejectionReason && (
                  <div className="bg-gray-500/10 border border-gray-500/30 rounded-xl p-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">Rejection Reason</h3>
                    <p className="text-slate-300">{selectedProperty.rejectionReason}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {selectedProperty.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updatePropertyStatus(selectedProperty.id, 'active')}
                        disabled={actionLoading === selectedProperty.id}
                        className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                      >
                        {actionLoading === selectedProperty.id ? 'Processing...' : 'Approve Property'}
                      </button>
                      <button
                        onClick={() => updatePropertyStatus(selectedProperty.id, 'rejected')}
                        disabled={actionLoading === selectedProperty.id}
                        className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                      >
                        Reject Property
                      </button>
                    </>
                  )}
                  
                  {selectedProperty.status === 'active' && (
                    <>
                      <button
                        onClick={() => toggleFeatured(selectedProperty.id)}
                        disabled={actionLoading === selectedProperty.id}
                        className={`flex-1 py-3 rounded-xl transition-colors font-medium disabled:opacity-50 ${
                          selectedProperty.featured
                            ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                            : 'bg-slate-600 text-white hover:bg-slate-500'
                        }`}
                      >
                        {selectedProperty.featured ? 'Remove Featured' : 'Mark as Featured'}
                      </button>
                      <button
                        onClick={() => updatePropertyStatus(selectedProperty.id, 'flagged')}
                        disabled={actionLoading === selectedProperty.id}
                        className="flex-1 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium disabled:opacity-50"
                      >
                        Flag Property
                      </button>
                    </>
                  )}
                  
                  {selectedProperty.status === 'flagged' && (
                    <>
                      <button
                        onClick={() => updatePropertyStatus(selectedProperty.id, 'active')}
                        disabled={actionLoading === selectedProperty.id}
                        className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                      >
                        Restore Property
                      </button>
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          setShowDeleteModal(true);
                        }}
                        disabled={actionLoading === selectedProperty.id}
                        className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                      >
                        Delete Property
                      </button>
                    </>
                  )}
                  
                  <Link
                    to={`/properties/${selectedProperty.id}`}
                    target="_blank"
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedProperty(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-800 rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Delete Property?</h3>
                <p className="text-slate-400 mb-2">
                  You are about to delete:
                </p>
                <p className="text-white font-medium mb-4">"{selectedProperty.title}"</p>
                <p className="text-slate-400 text-sm mb-6">
                  This action cannot be undone. The property will be permanently removed from the platform.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedProperty(null);
                    }}
                    className="flex-1 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteProperty}
                    disabled={actionLoading === selectedProperty.id}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {actionLoading === selectedProperty.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminProperties;