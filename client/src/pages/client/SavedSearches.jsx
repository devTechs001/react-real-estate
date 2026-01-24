import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaTrash, FaBell, FaBellSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Loader from '../../components/common/Loader';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';
import api from '../../services/api';

const SavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedSearches();
  }, []);

  const fetchSavedSearches = async () => {
    try {
      const { data } = await api.get('/saved-searches');
      setSavedSearches(data);
    } catch (error) {
      toast.error('Failed to load saved searches');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this saved search?')) return;

    try {
      await api.delete(`/saved-searches/${id}`);
      setSavedSearches(savedSearches.filter((s) => s._id !== id));
      toast.success('Saved search deleted');
    } catch (error) {
      toast.error('Failed to delete search');
    }
  };

  const handleToggleNotifications = async (id, currentStatus) => {
    try {
      const { data } = await api.patch(`/saved-searches/${id}`, {
        notifications: !currentStatus,
      });
      setSavedSearches(
        savedSearches.map((s) => (s._id === id ? { ...s, notifications: data.notifications } : s))
      );
      toast.success(
        data.notifications ? 'Notifications enabled' : 'Notifications disabled'
      );
    } catch (error) {
      toast.error('Failed to update notifications');
    }
  };

  const buildSearchUrl = (search) => {
    const params = new URLSearchParams();
    if (search.location) params.set('location', search.location);
    if (search.propertyType) params.set('propertyType', search.propertyType);
    if (search.minPrice) params.set('minPrice', search.minPrice);
    if (search.maxPrice) params.set('maxPrice', search.maxPrice);
    if (search.bedrooms) params.set('bedrooms', search.bedrooms);
    if (search.bathrooms) params.set('bathrooms', search.bathrooms);
    return `/properties?${params.toString()}`;
  };

  if (loading) return <Loader fullScreen />;

  return (
    <>
      <SEO title="Saved Searches" description="Your saved property searches" />

      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">
            <FaSearch className="inline mr-3" />
            Saved Searches
          </h1>
          <p className="text-xl">Get notified when new properties match your criteria</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {savedSearches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-12 text-center"
          >
            <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No saved searches</h3>
            <p className="text-gray-600 mb-6">
              Save your search criteria to get notified about new matching properties
            </p>
            <Link to="/properties" className="btn btn-primary">
              Browse Properties
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedSearches.map((search, index) => (
              <motion.div
                key={search._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{search.name}</h3>
                  <button
                    onClick={() => handleDelete(search._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  {search.location && (
                    <p className="text-gray-600">
                      <span className="font-medium">Location:</span> {search.location}
                    </p>
                  )}
                  {search.propertyType && (
                    <p className="text-gray-600">
                      <span className="font-medium">Type:</span> {search.propertyType}
                    </p>
                  )}
                  {(search.minPrice || search.maxPrice) && (
                    <p className="text-gray-600">
                      <span className="font-medium">Price:</span> $
                      {search.minPrice?.toLocaleString() || '0'} - $
                      {search.maxPrice?.toLocaleString() || '∞'}
                    </p>
                  )}
                  {search.bedrooms && (
                    <p className="text-gray-600">
                      <span className="font-medium">Bedrooms:</span> {search.bedrooms}+
                    </p>
                  )}
                  {search.bathrooms && (
                    <p className="text-gray-600">
                      <span className="font-medium">Bathrooms:</span> {search.bathrooms}+
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    to={buildSearchUrl(search)}
                    className="btn btn-primary flex-1"
                  >
                    View Results
                  </Link>
                  <button
                    onClick={() =>
                      handleToggleNotifications(search._id, search.notifications)
                    }
                    className={`btn ${
                      search.notifications ? 'btn-success' : 'btn-outline'
                    }`}
                    title={
                      search.notifications
                        ? 'Notifications enabled'
                        : 'Notifications disabled'
                    }
                  >
                    {search.notifications ? <FaBell /> : <FaBellSlash />}
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  Created {new Date(search.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SavedSearches;
