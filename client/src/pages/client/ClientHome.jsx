import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaEye, FaCalendar, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { propertyService } from '../../services/propertyService';
import PropertyCard from '../../components/property/PropertyCard';
import Loader from '../../components/common/Loader';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';

const ClientHome = () => {
  const [recommendedProperties, setRecommendedProperties] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    favorites: 0,
    viewHistory: 0,
    appointments: 0,
  });

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const [recommended, viewed, userStats] = await Promise.all([
        propertyService.getRecommendations({ limit: 6 }),
        propertyService.getRecentlyViewed({ limit: 4 }),
        propertyService.getUserStats(),
      ]);
      setRecommendedProperties(recommended);
      setRecentlyViewed(viewed);
      setStats(userStats);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  const quickActions = [
    {
      icon: FaSearch,
      title: 'Search Properties',
      description: 'Find your dream home',
      link: '/properties',
      color: 'blue',
    },
    {
      icon: FaHeart,
      title: 'My Favorites',
      description: `${stats.favorites} saved properties`,
      link: '/client/favorites',
      color: 'red',
    },
    {
      icon: FaCalendar,
      title: 'Appointments',
      description: `${stats.appointments} scheduled`,
      link: '/client/appointments',
      color: 'green',
    },
    {
      icon: FaEye,
      title: 'View History',
      description: `${stats.viewHistory} properties viewed`,
      link: '/client/view-history',
      color: 'purple',
    },
  ];

  return (
    <>
      <SEO title="Client Dashboard" description="Your personalized property dashboard" />

      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-xl">Find your perfect property today</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={action.link}
                className="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <action.icon className={`text-4xl text-${action.color}-500 mb-4`} />
                <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
                <p className="text-gray-600">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recommended Properties */}
        {recommendedProperties.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Recommended for You</h2>
              <Link to="/properties" className="text-primary-600 hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedProperties.map((property, index) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Recently Viewed</h2>
              <Link to="/client/view-history" className="text-primary-600 hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed.map((property, index) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PropertyCard property={property} compact />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientHome;
