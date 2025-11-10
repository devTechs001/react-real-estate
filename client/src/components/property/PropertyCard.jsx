import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PropertyCard = ({ property }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card group"
    >
      {/* Image */}
      <Link to={`/properties/${property._id}`} className="relative block overflow-hidden">
        <img
          src={property.images[0] || '/placeholder.jpg'}
          alt={property.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {property.listingType}
          </span>
        </div>
        
        {/* Favorite Button */}
        <button className="absolute top-4 right-4 bg-white p-2 rounded-full hover:bg-primary-600 hover:text-white transition-colors">
          <FaHeart />
        </button>
      </Link>

      {/* Content */}
      <div className="p-6">
        {/* Price */}
        <div className="mb-3">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(property.price)}
          </span>
          {property.listingType === 'rent' && (
            <span className="text-gray-500">/month</span>
          )}
        </div>

        {/* Title */}
        <Link to={`/properties/${property._id}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors line-clamp-1">
            {property.title}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-4">
          <FaMapMarkerAlt className="mr-2" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        {/* Features */}
        <div className="flex items-center justify-between text-gray-700 border-t pt-4">
          <div className="flex items-center gap-1">
            <FaBed className="text-primary-600" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <FaBath className="text-primary-600" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <FaRulerCombined className="text-primary-600" />
            <span>{property.area} sqft</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;