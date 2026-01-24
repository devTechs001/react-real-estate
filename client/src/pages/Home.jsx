import { Link } from 'react-router-dom';
import { FaSearch, FaHome, FaUsers, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { propertyService } from '../services/PropertyService';
import PropertyCard from '../components/property/PropertyCard';
import Loader from '../components/common/Loader';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const data = await propertyService.getProperties({ limit: 6, featured: true });
      setFeaturedProperties(data.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FaSearch className="text-4xl" />,
      title: 'Find Property',
      description: 'Search from thousands of properties in your area',
    },
    {
      icon: <FaHome className="text-4xl" />,
      title: 'Best Deals',
      description: 'Get the best deals on properties at competitive prices',
    },
    {
      icon: <FaUsers className="text-4xl" />,
      title: 'Expert Agents',
      description: 'Work with experienced real estate professionals',
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: 'Secure Process',
      description: 'Safe and secure property transactions',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20 md:py-32">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">
              Find Your Dream Property
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Discover the perfect place to call home from our extensive collection
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-lg p-2 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
              <input
                type="text"
                placeholder="Enter location..."
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none"
              />
              <select className="px-4 py-3 rounded-lg text-gray-900 focus:outline-none">
                <option>Property Type</option>
                <option>Apartment</option>
                <option>House</option>
                <option>Villa</option>
              </select>
              <Link to="/properties" className="btn btn-primary">
                <FaSearch /> Search
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose Us</h2>
            <p className="section-subtitle">
              We provide the best service to help you find your dream property
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-primary-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Properties</h2>
            <p className="section-subtitle">
              Hand-picked properties for you
            </p>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/properties" className="btn btn-primary">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of happy homeowners today
          </p>
          <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;