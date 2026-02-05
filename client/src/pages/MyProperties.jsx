import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { propertyService } from '../services/PropertyService';
import PropertyCard from '../components/property/PropertyCard';
import Loader from '../components/common/Loader';
import SEO from '../components/common/SEO';
import toast from 'react-hot-toast';
import '../styles/MyProperties.css';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMyProperties();
  }, [filter]);

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const data = await propertyService.getUserProperties(params);
      setProperties(data);
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;

    try {
      await propertyService.deleteProperty(id);
      setProperties(properties.filter((p) => p._id !== id));
      toast.success('Property deleted successfully');
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <>
      <SEO title="My Properties" description="Manage your property listings" />

      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">My Properties</h1>
          <p className="text-xl">Manage your property listings</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex gap-2">
            {['all', 'available', 'sold', 'rented'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <Link to="/add-property" className="btn btn-primary">
            <FaPlus className="mr-2" />
            Add New Property
          </Link>
        </div>

        {properties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-12 text-center"
          >
            <FaPlus className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all'
                ? "You haven't added any properties yet"
                : `No ${filter} properties found`}
            </p>
            <Link to="/add-property" className="btn btn-primary">
              Add Your First Property
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, index) => (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PropertyCard property={property} />
                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/properties/${property._id}`}
                    className="btn btn-sm btn-outline flex-1"
                  >
                    <FaEye className="mr-2" />
                    View
                  </Link>
                  <Link
                    to={`/edit-property/${property._id}`}
                    className="btn btn-sm btn-primary flex-1"
                  >
                    <FaEdit className="mr-2" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(property._id)}
                    className="btn btn-sm btn-danger"
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

export default MyProperties;
