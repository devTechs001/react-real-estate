import { Link } from 'react-router-dom';
import { FaSearch, FaHome, FaUsers, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
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
      {/* Hero Section with Background Image */}
      <section className="relative text-white py-20 md:py-40 overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-secondary-600/90 z-10" />
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:rgba(255,255,255,0.05);stop-opacity:1" /><stop offset="100%" style="stop-color:rgba(255,255,255,0.1);stop-opacity:1" /></linearGradient><pattern id="dots" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)" /></pattern></defs><rect width="1200" height="600" fill="url(%23grad)"/><rect width="1200" height="600" fill="url(%23dots)"/></svg>')`,
            }}
          />
        </div>

        {/* Content */}
        <div className="container-custom relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold font-display mb-4 leading-tight"
            >
              Find Your Dream <span className="text-yellow-300">Property</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto"
            >
              Discover thousands of exceptional homes and connect with expert real estate professionals
            </motion.p>
            
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto shadow-2xl"
            >
              <input
                type="text"
                placeholder="Enter location or property type..."
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none bg-white/50 placeholder-gray-600"
              />
              <select className="px-4 py-3 rounded-lg text-gray-900 focus:outline-none bg-white/50">
                <option>All Types</option>
                <option>Apartment</option>
                <option>House</option>
                <option>Villa</option>
                <option>Commercial</option>
              </select>
              <Link to="/properties" className="btn btn-primary md:px-8 whitespace-nowrap">
                <FaSearch /> Search
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Property Showcase Gallery */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title text-4xl mb-4">Explore Our Collections</h2>
            <p className="section-subtitle text-lg max-w-2xl mx-auto">
              Browse through our handpicked selection of premium properties
            </p>
          </motion.div>

          {/* Featured Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Large featured card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="md:col-span-2 lg:col-span-2 relative h-72 rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80')`,
                  backgroundPosition: 'center',
                }}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-3xl font-bold mb-2">Modern Luxury Villa</h3>
                <p className="text-white/90 mb-4">Stunning waterfront property with ocean views</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="bg-primary-600/80 px-4 py-2 rounded-lg">$1,250,000</span>
                  <Link to="/properties" className="flex items-center gap-2 hover:gap-3 transition-all text-white/90 hover:text-white">
                    Explore <FaArrowRight />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Small featured card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative h-72 rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80')`,
                  backgroundPosition: 'center',
                }}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Urban Apartment</h3>
                <p className="text-white/90 text-sm mb-3">Downtown luxury living</p>
                <span className="text-sm font-semibold">$650,000</span>
              </div>
            </motion.div>

            {/* Gallery items */}
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: item * 0.1 }}
                viewport={{ once: true }}
                className="relative h-64 rounded-xl overflow-hidden group cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1600${item === 2 ? '0585' : '0566'}-154340-be6161a56a0c?w=400&q=80')`,
                    backgroundPosition: 'center',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="font-semibold text-sm mb-1">Property #{item}</p>
                  <p className="text-xs text-white/80">Premium location</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/properties" className="btn btn-primary btn-lg inline-flex items-center gap-2">
              View All Properties <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
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
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title text-4xl mb-4">Latest Listings</h2>
            <p className="section-subtitle text-lg">
              Newly added properties in your area
            </p>
          </motion.div>

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
      <section className="relative py-24 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 z-0" />
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0 opacity-20 z-0"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="none" stroke="white" stroke-width="0.5"/><circle cx="50" cy="50" r="20" fill="none" stroke="white" stroke-width="0.5"/></svg>')`,
            backgroundSize: '50px 50px',
          }}
        />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            >
              Ready to Find Your <span className="text-yellow-300">Dream Home?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-xl mb-10 text-white/90 max-w-2xl mx-auto"
            >
              Join thousands of happy homeowners and find the perfect property today
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 font-bold px-8 py-3 text-lg">
                Get Started Now
              </Link>
              <Link to="/properties" className="btn bg-white/20 text-white hover:bg-white/30 border border-white/50 font-bold px-8 py-3 text-lg">
                Browse Properties
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;