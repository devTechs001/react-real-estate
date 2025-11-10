import { useComparison } from '../../hooks/useComparison';
import { FaTimes, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PropertyComparison = () => {
  const { compareList, removeFromComparison, clearComparison } = useComparison();

  if (compareList.length === 0) {
    return null;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const compareFeatures = [
    { key: 'price', label: 'Price', format: formatPrice },
    { key: 'bedrooms', label: 'Bedrooms' },
    { key: 'bathrooms', label: 'Bathrooms' },
    { key: 'area', label: 'Area (sqft)' },
    { key: 'yearBuilt', label: 'Year Built' },
    { key: 'propertyType', label: 'Type' },
    { key: 'listingType', label: 'For' },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t z-40"
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Compare Properties ({compareList.length})</h3>
          <div className="flex gap-2">
            <button onClick={clearComparison} className="btn btn-secondary text-sm">
              Clear All
            </button>
            <button className="btn btn-primary text-sm">
              View Comparison
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {compareList.map((property) => (
            <div key={property._id} className="border rounded-lg p-4 relative">
              <button
                onClick={() => removeFromComparison(property._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>

              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />

              <h4 className="font-semibold mb-2 line-clamp-1">{property.title}</h4>

              <div className="space-y-1 text-sm">
                <p className="text-primary-600 font-bold">{formatPrice(property.price)}</p>
                <p className="text-gray-600">{property.bedrooms} bed • {property.bathrooms} bath</p>
                <p className="text-gray-600">{property.area} sqft</p>
              </div>
            </div>
          ))}

          {compareList.length < 4 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
              <p className="text-gray-400 text-center">
                Add more properties to compare
                <br />
                <span className="text-xs">(Max 4)</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyComparison;