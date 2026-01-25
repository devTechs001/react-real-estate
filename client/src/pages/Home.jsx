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
      {/* Hero Section */}
      <section className="relative text-white py-24 md:py-32 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 z-10" />
          <motion.div
            animate={{ backgroundPosition: '200% center' }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>

        {/* Content */}
        <div className="container-custom relative z-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-sm font-medium text-white/90">
                Welcome to RealEstateHub
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-5xl md:text-7xl font-bold font-display mb-6 leading-tight drop-shadow-lg"
            >
              Find Your Perfect <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">Property</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md"
            >
              Explore thousands of exceptional homes and connect with expert real estate professionals
            </motion.p>
            
            {/* Enhanced Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-1.5 flex flex-col md:flex-row gap-1.5 max-w-4xl mx-auto shadow-2xl border border-white/20"
            >
              <input
                type="text"
                placeholder="Search by location, property type..."
                className="flex-1 px-6 py-4 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-slate-500 font-medium"
              />
              <select className="px-6 py-4 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90 font-medium cursor-pointer">
                <option>All Types</option>
                <option>Apartment</option>
                <option>House</option>
                <option>Villa</option>
                <option>Commercial</option>
              </select>
              <Link to="/properties" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl flex items-center gap-2 whitespace-nowrap shadow-lg hover:shadow-xl transition-all duration-200">
                <FaSearch /> Search
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 0.5 }} className="absolute -bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
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
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container-custom relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display text-slate-900 mb-4">Why Choose RealEstateHub?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to find, buy, or sell properties with confidence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group p-8 rounded-2xl border border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50/50 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-blue-200/50"
              >
                <div className="text-5xl text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <div className="container-custom px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">Featured Collections</span>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-slate-900 mb-4">Latest Premium Listings</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Handpicked properties from our verified sellers
            </p>
          </motion.div>

          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property, index) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link to="/properties" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Explore All Properties <FaArrowRight className="text-lg" />
            </Link>
          </motion.div>
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