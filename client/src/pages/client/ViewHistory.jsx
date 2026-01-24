import { useState, useEffect } from 'react';
import { FaEye, FaTrash, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { propertyService } from '../../services/propertyService';
import PropertyCard from '../../components/property/PropertyCard';
import Loader from '../../components/common/Loader';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';

const ViewHistory = () => {
  const [viewedProperties, setViewedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchViewHistory();
  }, [filter]);

  const fetchViewHistory = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { period: filter } : {};
      const data = await propertyService.getViewHistory(params);
      setViewedProperties(data);
    } catch (error) {
      toast.error('Failed to load view history');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your view history?')) return;

    try {
      await propertyService.clearViewHistory();
      setViewedProperties([]);
      toast.success('View history cleared');
    } catch (error) {
      toast.error('Failed to clear history');
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await propertyService.removeFromViewHistory(id);
      setViewedProperties(viewedProperties.filter((p) => p._id !== id));
      toast.success('Removed from history');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <>
      <SEO title="View History" description="Your recently viewed properties" />

      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">
            <FaEye className="inline mr-3" />
            View History
          </h1>
          <p className="text-xl">Track properties you've recently viewed</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex gap-2">
            {['all', 'today', 'week', 'month'].map((period) => (
              <button
                key={period}
                onClick={() => setFilter(period)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  filter === period
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {viewedProperties.length > 0 && (
            <button onClick={handleClearHistory} className="btn btn-danger">
              <FaTrash className="mr-2" />
              Clear History
            </button>
          )}
        </div>

        {viewedProperties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-12 text-center"
          >
            <FaClock className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No viewing history</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all'
                ? "You haven't viewed any properties yet"
                : `No properties viewed ${filter === 'today' ? 'today' : `this ${filter}`}`}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {viewedProperties.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <PropertyCard property={item.property} />
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    <FaClock className="inline mr-1" />
                    Viewed {new Date(item.viewedAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ViewHistory;
