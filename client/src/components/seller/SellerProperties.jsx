// client/src/pages/seller/SellerProperties.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../common/SEO';
import toast from 'react-hot-toast';

const SellerProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [selectedProperties, setSelectedProperties] = useState([]);

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
        price: 2500000,
        location: 'Miami Beach, FL',
        status: 'active',
        featured: true,
        views: 2450,
        inquiries: 32,
        favorites: 89,
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
        bedrooms: 5,
        bathrooms: 4,
        area: 4500,
        createdAt: '2024-01-15',
        expiresAt: '2024-04-15'
      },
      {
        id: 2,
        title: 'Modern Downtown Penthouse',
        price: 1800000,
        location: 'New York, NY',
        status: 'active',
        featured: false,
        views: 1890,
        inquiries: 28,
        favorites: 67,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
        bedrooms: 3,
        bathrooms: 3,
        area: 2800,
        createdAt: '2024-01-10',
        expiresAt: '2024-04-10'
      },
      {
        id: 3,
        title: 'Cozy Mountain Cabin',
        price: 450000,
        location: 'Aspen, CO',
        status: 'pending',
        featured: false,
        views: 0,
        inquiries: 0,
        favorites: 0,
        image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400',
        bedrooms: 4,
        bathrooms: 3,
        area: 2200,
        createdAt: '2024-01-18',
        expiresAt: null
      },
      {
        id: 4,
        title: 'Beach House Paradise',
        price: 1200000,
        location: 'Malibu, CA',
        status: 'sold',
        featured: false,
        views: 3200,
        inquiries: 45,
        favorites: 112,
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
        bedrooms: 4,
        bathrooms: 3,
        area: 3200,
        createdAt: '2023-12-20',
        soldAt: '2024-01-10'
      },
      {
        id: 5,
        title: 'Urban Loft Living',
        price: 680000,
        location: 'Chicago, IL',
        status: 'inactive',
        featured: false,
        views: 980,
        inquiries: 14,
        favorites: 38,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
        bedrooms: 2,
        bathrooms: 2,
        area: 1800,
        createdAt: '2023-11-15',
        expiresAt: '2024-01-15'
      },
    ]);
    setLoading(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusInfo = (status) => {
    const info = {
      active: { color: 'bg-green-100 text-green-700', label: 'Active' },
      pending: { color: 'bg-yellow-100 text-yellow-700', label: 'Pending Review' },
      sold: { color: 'bg-blue-100 text-blue-700', label: 'Sold' },
      inactive: { color: 'bg-gray-100 text-gray-600', label: 'Inactive' },
      expired: { color: 'bg-red-100 text-red-700', label: 'Expired' }
    };
    return info[status] || info.inactive;
  };

  const handleDelete = (id) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    setShowDeleteModal(null);
    toast.success('Property deleted successfully');
  };

  const toggleFeatured = (id) => {
    setProperties(prev => prev.map(p => 
      p.id === id ? { ...p, featured: !p.featured } : p
    ));
    toast.success('Featured status updated');
  };

  const togglePropertyStatus = (id, newStatus) => {
    setProperties(prev => prev.map(p => 
      p.id === id ? { ...p, status: newStatus } : p
    ));
    toast.success(`Property ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
  };

  const toggleSelectProperty = (id) => {
    setSelectedProperties(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const selectAllProperties = () => {
    if (selectedProperties.length === filteredProperties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(filteredProperties.map(p => p.id));
    }
  };

  const filteredProperties = properties.filter(p => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: properties.length,
    active: properties.filter(p => p.status === 'active').length,
    pending: properties.filter(p => p.status === 'pending').length,
    sold: properties.filter(p => p.status === 'sold').length,
  };

  return (
    <>
      <SEO title="My Properties - HomeScape Seller" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
          <p className="text-gray-600">{stats.total} total properties</p>
        </div>
        <Link
          to="/seller/properties/new"
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Property
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'blue' },
          { label: 'Active', value: stats.active, color: 'green' },
          { label: 'Pending', value: stats.pending, color: 'yellow' },
          { label: 'Sold', value: stats.sold, color: 'purple' },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 shadow-sm"
          >
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-purple-500"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'active', 'pending', 'sold', 'inactive'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm capitalize whitespace-nowrap ${
                  filter === f
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProperties.length > 0 && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-600">
              {selectedProperties.length} selected
            </span>
            <button className="text-sm text-purple-600 hover:underline">
              Deactivate Selected
            </button>
            <button className="text-sm text-red-600 hover:underline">
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Properties List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="flex gap-6">
                <div className="w-48 h-32 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h2>
          <p className="text-gray-600 mb-6">
            {filter !== 'all' 
              ? `You don't have any ${filter} properties` 
              : "You haven't listed any properties yet"}
          </p>
          <Link
            to="/seller/properties/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
          >
            Add Your First Property
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Select All */}
          <div className="flex items-center gap-3 px-2">
            <input
              type="checkbox"
              checked={selectedProperties.length === filteredProperties.length && filteredProperties.length > 0}
              onChange={selectAllProperties}
              className="w-4 h-4 text-purple-600 rounded"
            />
            <span className="text-sm text-gray-600">Select all</span>
          </div>

          {filteredProperties.map((property, index) => {
            const statusInfo = getStatusInfo(property.status);
            
            return (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-colors ${
                  selectedProperties.includes(property.id) ? 'border-purple-500' : 'border-transparent'
                }`}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Checkbox & Image */}
                  <div className="flex gap-4">
                    <input
                      type="checkbox"
                      checked={selectedProperties.includes(property.id)}
                      onChange={() => togglePropertyStatus(property.id)}
                      className="w-4 h-4 text-purple-600 rounded mt-1"
                    />
                    <div className="relative">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full lg:w-48 h-32 object-cover rounded-xl"
                      />
                      {property.featured && (
                        <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-medium rounded-full">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <Link to={`/properties/${property.id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600">
                            {property.title}
                          </h3>
                        </Link>
                        <p className="text-gray-500 text-sm flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {property.location}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <p className="text-2xl font-bold text-purple-600 mb-3">
                      {formatPrice(property.price)}
                    </p>

                    {/* Property Stats */}
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {property.views.toLocaleString()} views
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {property.inquiries} inquiries
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {property.favorites} saves
                      </span>
                      <span>🛏️ {property.bedrooms} beds</span>
                      <span>🚿 {property.bathrooms} baths</span>
                      <span>📐 {property.area.toLocaleString()} sqft</span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
                      <Link
                        to={`/seller/properties/${property.id}/edit`}
                        className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/properties/${property.id}`}
                        className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => toggleFeatured(property.id)}
                        className={`px-4 py-2 border text-sm rounded-lg ${
                          property.featured
                            ? 'border-yellow-400 text-yellow-700 bg-yellow-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {property.featured ? '★ Featured' : '☆ Feature'}
                      </button>
                      {property.status === 'active' ? (
                        <button
                          onClick={() => togglePropertyStatus(property.id, 'inactive')}
                          className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50"
                        >
                          Deactivate
                        </button>
                      ) : property.status === 'inactive' && (
                        <button
                          onClick={() => togglePropertyStatus(property.id, 'active')}
                          className="px-4 py-2 border border-green-200 text-green-600 text-sm rounded-lg hover:bg-green-50"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => setShowDeleteModal(property.id)}
                        className="px-4 py-2 border border-red-200 text-red-600 text-sm rounded-lg hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Property?</h3>
                <p className="text-gray-600 mb-6">
                  This action cannot be undone. The property and all associated data will be permanently deleted.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteModal)}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
                  >
                    Delete
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

export default SellerProperties;