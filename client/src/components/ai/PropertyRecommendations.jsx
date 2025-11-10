import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaHeart, FaMapMarkerAlt } from 'react-icons/fa';
import { aiService } from '../../services/aiService';
import PropertyCard from '../property/PropertyCard';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';

const PropertyRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await aiService.getRecommendations(10);
      setRecommendations(response.recommendations);
    } catch (error) {
      toast.error('Failed to load recommendations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container-custom py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <FaStar className="text-3xl text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Recommended For You</h2>
        <p className="text-gray-600">
          AI-powered recommendations based on your preferences
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-12">
          <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">
            Browse some properties to get personalized recommendations
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((item, index) => (
            <motion.div
              key={item.property._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Match Score Badge */}
              <div className="mb-2">
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  <FaStar className="text-xs" />
                  {item.score}% Match
                </span>
              </div>

              <PropertyCard property={item.property} />

              {/* Match Reasons */}
              {item.matchReasons && item.matchReasons.length > 0 && (
                <div className="mt-3 bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Why we recommend this:
                  </p>
                  <ul className="space-y-1">
                    {item.matchReasons.slice(0, 3).map((reason, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyRecommendations;