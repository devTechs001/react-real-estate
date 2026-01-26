// client/src/pages/user/SavedSearches.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';

const SavedSearches = () => {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSearches();
  }, []);

  const fetchSearches = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setSearches([
      {
        id: 1,
        name: 'Miami Beach Condos',
        filters: {
          location: 'Miami Beach, FL',
          type: 'Condo',
          priceMin: 300000,
          priceMax: 600000,
          bedrooms: '2+'
        },
        newListings: 24,
        lastNotified: '2024-01-15',
        emailAlerts: true
      },
      {
        id: 2,
        name: '3+ Bed Houses in NYC',
        filters: {
          location: 'New York, NY',
          type: 'House',
          priceMin: 500000,
          priceMax: 1500000,
          bedrooms: '3+'
        },
        newListings: 12,
        lastNotified: '2024-01-14',
        emailAlerts: true
      },
      {
        id: 3,
        name: 'Affordable Austin Homes',
        filters: {
          location: 'Austin, TX',
          type: 'Any',
          priceMin: 0,
          priceMax: 400000,
          bedrooms: 'Any'
        },
        newListings: 45,
        lastNotified: '2024-01-13',
        emailAlerts: false
      },
    ]);
    setLoading(false);
  };

  const deleteSearch = (id) => {
    setSearches(prev => prev.filter(s => s.id !== id));
    toast.success('Search deleted');
  };

  const toggleAlerts = (id) => {
    setSearches(prev => prev.map(s => 
      s.id === id ? { ...s, emailAlerts: !s.emailAlerts } : s
    ));
    toast.success('Alert settings updated');
  };

  const formatPrice = (price) => {
    if (price === 0) return 'No min';
    if (price >= 1000000) return `$${price / 1000000}M`;
    return `$${price / 1000}K`;
  };

  return (
    <>
      <SEO title="Saved Searches - HomeScape" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Searches</h1>
          <p className="text-gray-600">Get notified when new properties match your criteria</p>
        </div>
        <Link
          to="/properties"
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Search
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : searches.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No saved searches</h2>
          <p className="text-gray-600 mb-6">Save a search to get notified about new listings</p>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Start Searching
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {searches.map((search, index) => (
            <motion.div
              key={search.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{search.name}</h3>
                    {search.newListings > 0 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {search.newListings} new
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      📍 {search.filters.location}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      🏠 {search.filters.type}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      💰 {formatPrice(search.filters.priceMin)} - {formatPrice(search.filters.priceMax)}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      🛏️ {search.filters.bedrooms} beds
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    Last notified: {new Date(search.lastNotified).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Email Alerts Toggle */}
                  <button
                    onClick={() => toggleAlerts(search.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      search.emailAlerts
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {search.emailAlerts ? 'Alerts On' : 'Alerts Off'}
                  </button>

                  {/* View Results */}
                  <Link
                    to={`/properties?saved=${search.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium"
                  >
                    View Results
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => deleteSearch(search.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="mt-8 bg-blue-50 rounded-2xl p-6">
        <h3 className="font-semibold text-blue-900 mb-3">💡 Pro Tips</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Enable email alerts to get notified instantly when new properties match your search</li>
          <li>• Save multiple searches with different criteria to cover all your preferences</li>
          <li>• Refine your searches regularly based on market changes</li>
        </ul>
      </div>
    </>
  );
};

export default SavedSearches;