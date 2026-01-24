import { useState, useEffect } from 'react';
import { FaBalanceScale, FaTimes, FaCheck, FaTimes as FaX } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useComparison } from '../../hooks/useComparison';
import Loader from '../../components/common/Loader';
import SEO from '../../components/common/SEO';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';

const Comparison = () => {
  const { comparisonList, removeFromComparison, clearComparison, loading } = useComparison();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    setProperties(comparisonList);
  }, [comparisonList]);

  const handleRemove = (id) => {
    removeFromComparison(id);
    toast.success('Property removed from comparison');
  };

  const handleClearAll = () => {
    if (window.confirm('Remove all properties from comparison?')) {
      clearComparison();
      toast.success('Comparison list cleared');
    }
  };

  if (loading) return <Loader fullScreen />;

  const features = [
    { key: 'price', label: 'Price' },
    { key: 'propertyType', label: 'Type' },
    { key: 'bedrooms', label: 'Bedrooms' },
    { key: 'bathrooms', label: 'Bathrooms' },
    { key: 'area', label: 'Area (sq ft)' },
    { key: 'yearBuilt', label: 'Year Built' },
    { key: 'parking', label: 'Parking' },
    { key: 'furnished', label: 'Furnished' },
    { key: 'petFriendly', label: 'Pet Friendly' },
    { key: 'gym', label: 'Gym' },
    { key: 'pool', label: 'Pool' },
    { key: 'security', label: '24/7 Security' },
  ];

  return (
    <>
      <SEO title="Compare Properties" description="Compare properties side by side" />

      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">
            <FaBalanceScale className="inline mr-3" />
            Compare Properties
          </h1>
          <p className="text-xl">Compare up to 4 properties side by side</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {properties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-12 text-center"
          >
            <FaBalanceScale className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No properties to compare</h3>
            <p className="text-gray-600 mb-6">
              Add properties to your comparison list to see them side by side
            </p>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Comparing {properties.length} {properties.length === 1 ? 'property' : 'properties'}
              </p>
              <button onClick={handleClearAll} className="btn btn-danger">
                <FaTimes className="mr-2" />
                Clear All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow-md">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left font-semibold">Feature</th>
                    {properties.map((property) => (
                      <th key={property._id} className="p-4 text-center relative">
                        <button
                          onClick={() => handleRemove(property._id)}
                          className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-32 object-cover rounded-lg mb-2"
                        />
                        <p className="font-semibold text-sm">{property.title}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => (
                    <tr
                      key={feature.key}
                      className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      <td className="p-4 font-medium">{feature.label}</td>
                      {properties.map((property) => (
                        <td key={property._id} className="p-4 text-center">
                          {feature.key === 'price' ? (
                            <span className="font-semibold text-primary-600">
                              {formatPrice(property.price)}
                            </span>
                          ) : typeof property[feature.key] === 'boolean' ? (
                            property[feature.key] ? (
                              <FaCheck className="text-green-600 mx-auto" />
                            ) : (
                              <FaX className="text-red-600 mx-auto" />
                            )
                          ) : (
                            property[feature.key] || '-'
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Comparison;
