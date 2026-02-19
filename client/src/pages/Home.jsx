// client/src/pages/Home.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Header from '../components/common/Header';
import PropertyCard from '../components/property/PropertyCard';
import SEO from '../components/common/SEO';
import { propertyService } from '../services/PropertyService';
import '../styles/Home.scss';

const Home = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState({
    location: '',
    type: 'all',
    priceRange: 'all',
    bedrooms: 'all'
  });
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const [featuredResponse, recentResponse] = await Promise.all([
        propertyService.getFeaturedProperties(),
        propertyService.getProperties({ limit: 8 })
      ]);

      // Handle different possible response structures
      const featured = Array.isArray(featuredResponse)
        ? featuredResponse
        : (featuredResponse?.data || mockFeaturedProperties);

      const recent = Array.isArray(recentResponse)
        ? recentResponse
        : (recentResponse?.data || mockRecentProperties);

      setFeaturedProperties(featured);
      setRecentProperties(recent);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setFeaturedProperties(mockFeaturedProperties);
      setRecentProperties(mockRecentProperties);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(searchQuery).forEach(([key, value]) => {
      if (value && value !== 'all') params.append(key, value);
    });
    navigate(`/properties?${params.toString()}`);
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  // Mock data for development
  const mockFeaturedProperties = [
    {
      _id: '1',
      title: 'Luxury Waterfront Villa',
      price: 2500000,
      location: { city: 'Miami', state: 'Florida' },
      bedrooms: 5,
      bathrooms: 4,
      area: 4500,
      images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop'],
      type: 'house',
      featured: true,
      rating: 4.9,
      reviewCount: 45
    },
    {
      _id: '2',
      title: 'Modern Downtown Penthouse',
      price: 1800000,
      location: { city: 'New York', state: 'NY' },
      bedrooms: 3,
      bathrooms: 3,
      area: 2800,
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop'],
      type: 'apartment',
      featured: true,
      rating: 4.8,
      reviewCount: 32
    },
    {
      _id: '3',
      title: 'Contemporary Smart Home',
      price: 950000,
      location: { city: 'Austin', state: 'Texas' },
      bedrooms: 4,
      bathrooms: 3,
      area: 3200,
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop'],
      type: 'house',
      featured: true,
      rating: 4.7,
      reviewCount: 28
    },
    {
      _id: '4',
      title: 'Beachfront Paradise',
      price: 3200000,
      location: { city: 'Malibu', state: 'California' },
      bedrooms: 6,
      bathrooms: 5,
      area: 5500,
      images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=300&fit=crop'],
      type: 'house',
      featured: true,
      rating: 5.0,
      reviewCount: 18
    },
    {
      _id: '5',
      title: 'Mountain View Retreat',
      price: 750000,
      location: { city: 'Denver', state: 'Colorado' },
      bedrooms: 4,
      bathrooms: 3,
      area: 2900,
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop'],
      type: 'house',
      featured: true,
      rating: 4.6,
      reviewCount: 52
    },
    {
      _id: '6',
      title: 'Urban Luxury Loft',
      price: 680000,
      location: { city: 'Chicago', state: 'Illinois' },
      bedrooms: 2,
      bathrooms: 2,
      area: 1800,
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'],
      type: 'apartment',
      featured: true,
      rating: 4.8,
      reviewCount: 37
    }
  ];

  const mockRecentProperties = mockFeaturedProperties.slice(0, 8);

  const categories = [
    { icon: '🏠', name: 'Houses', count: '2,345', color: 'from-blue-500 to-blue-600' },
    { icon: '🏢', name: 'Apartments', count: '1,876', color: 'from-purple-500 to-purple-600' },
    { icon: '🏘️', name: 'Villas', count: '943', color: 'from-pink-500 to-pink-600' },
    { icon: '🏬', name: 'Commercial', count: '567', color: 'from-orange-500 to-orange-600' },
    { icon: '🏖️', name: 'Vacation', count: '234', color: 'from-teal-500 to-teal-600' },
    { icon: '🌾', name: 'Land', count: '189', color: 'from-green-500 to-green-600' },
  ];

  const stats = [
    { value: '15K+', label: 'Properties Listed', icon: '🏠' },
    { value: '8K+', label: 'Happy Clients', icon: '😊' },
    { value: '500+', label: 'Expert Agents', icon: '👔' },
    { value: '50+', label: 'Cities Covered', icon: '🌆' },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Home Buyer',
      image: 'https://placehold.co/64x64/667eea/ffffff?text=SJ',
      text: 'HomeScape made finding our dream home so easy! The AI recommendations were spot-on, and our agent was incredibly helpful throughout the process.',
      rating: 5
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Property Seller',
      image: 'https://placehold.co/64x64/764ba2/ffffff?text=MC',
      text: 'Sold my property within 2 weeks of listing! The platform\'s exposure and the professional photography service made all the difference.',
      rating: 5
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'First-time Buyer',
      image: 'https://placehold.co/64x64/f093fb/ffffff?text=ER',
      text: 'As a first-time buyer, I was nervous about the process. The team at HomeScape guided me every step of the way. Couldn\'t be happier!',
      rating: 5
    },
  ];

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'AI-Powered Search',
      description: 'Our intelligent algorithms learn your preferences and recommend properties that match your lifestyle.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Verified Listings',
      description: 'Every property is verified by our team to ensure authenticity and accurate information.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      title: 'Real-time Chat',
      description: 'Connect instantly with property owners and agents through our secure messaging system.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Market Analytics',
      description: 'Access detailed market trends and price predictions to make informed decisions.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Price Prediction',
      description: 'Our AI predicts future property values to help you make smart investment choices.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Easy Scheduling',
      description: 'Book property viewings with one click and manage all your appointments in one place.'
    },
  ];

  const AnimatedSection = ({ children, className = '' }) => {
    const [ref, inView] = useInView({
      threshold: 0.1,
      triggerOnce: true
    });

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeInUp}
        className={className}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <>
      <SEO 
        title="HomeScape - Find Your Perfect Home"
        description="Discover your dream property with HomeScape. Browse thousands of verified listings with AI-powered recommendations."
        keywords="real estate, homes for sale, apartments, property listings, buy house"
      />
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Hero Section */}
        <motion.section 
          ref={heroRef}
          className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        >
          {/* Background Image with Parallax */}
          <motion.div 
            className="absolute inset-0 z-0"
            style={{ scale: heroScale, y: heroY }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-blue-900/80 to-slate-900/90 z-10" />
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920"
              alt="Luxury Home"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Animated Patterns */}
          <div className="absolute inset-0 z-10 overflow-hidden">
            <motion.div 
              className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
              animate={{ 
                x: [0, 50, 0],
                y: [0, 30, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
              animate={{ 
                x: [0, -50, 0],
                y: [0, -30, 0],
                scale: [1.1, 1, 1.1]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Hero Content */}
          <motion.div 
            className="relative z-20 container mx-auto px-4 text-center"
            style={{ opacity: heroOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-200 text-sm mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Over 15,000+ properties available
              </span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Find Your{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Dream Home
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                />
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl text-blue-100/80 max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover exceptional properties with AI-powered recommendations. 
              Your perfect home is just a search away.
            </motion.p>

            {/* Search Box */}
            <motion.form
              onSubmit={handleSearch}
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 shadow-2xl border border-white/10">
                <div className="flex flex-col md:flex-row gap-2">
                  {/* Location Input */}
                  <div className="flex-1 relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter city, neighborhood, or ZIP..."
                      className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery.location}
                      onChange={(e) => setSearchQuery({ ...searchQuery, location: e.target.value })}
                    />
                  </div>

                  {/* Property Type */}
                  <select
                    className="px-4 py-4 bg-white rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    value={searchQuery.type}
                    onChange={(e) => setSearchQuery({ ...searchQuery, type: e.target.value })}
                  >
                    <option value="all">All Types</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                    <option value="villa">Villa</option>
                    <option value="commercial">Commercial</option>
                  </select>

                  {/* Price Range */}
                  <select
                    className="px-4 py-4 bg-white rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    value={searchQuery.priceRange}
                    onChange={(e) => setSearchQuery({ ...searchQuery, priceRange: e.target.value })}
                  >
                    <option value="all">Any Price</option>
                    <option value="0-100000">Under $100K</option>
                    <option value="100000-300000">$100K - $300K</option>
                    <option value="300000-500000">$300K - $500K</option>
                    <option value="500000-1000000">$500K - $1M</option>
                    <option value="1000000+">$1M+</option>
                  </select>

                  {/* Search Button */}
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </button>
                </div>
              </div>

              {/* Quick Links */}
              <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
                {['Miami Beach', 'New York', 'Los Angeles', 'Chicago', 'Austin'].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setSearchQuery({ ...searchQuery, location: city })}
                    className="text-blue-200 hover:text-white transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </motion.form>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex flex-col items-center text-white/60">
              <span className="text-sm mb-2">Scroll to explore</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        <section className="py-12 bg-white border-b">
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-12">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Browse By Category</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2">Explore Property Types</h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                From cozy apartments to luxury villas, find the perfect property that suits your needs and lifestyle.
              </p>
            </AnimatedSection>

            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <Link
                    to={`/properties?type=${category.name.toLowerCase()}`}
                    className="block bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 text-center border border-gray-100"
                  >
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.count} Properties</p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Properties Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <AnimatedSection className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div>
                <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Featured Listings</span>
                <h2 className="text-4xl font-bold text-gray-900 mt-2">Handpicked Properties</h2>
                <p className="text-gray-600 mt-2">Curated selection of premium properties just for you</p>
              </div>
              <Link
                to="/properties?featured=true"
                className="mt-4 md:mt-0 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                View All Featured
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </AnimatedSection>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-2xl h-96 animate-pulse" />
                ))}
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {featuredProperties.map((property, index) => (
                  <motion.div key={property._id} variants={fadeInUp}>
                    <PropertyCard property={property} featured />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-16">
              <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
              <h2 className="text-4xl font-bold mt-2">The HomeScape Advantage</h2>
              <p className="text-blue-100/80 mt-4 max-w-2xl mx-auto">
                Experience a smarter way to find your perfect property with our cutting-edge features and dedicated support.
              </p>
            </AnimatedSection>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-blue-100/70">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Recent Properties Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <AnimatedSection className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div>
                <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">New Arrivals</span>
                <h2 className="text-4xl font-bold text-gray-900 mt-2">Recently Listed</h2>
                <p className="text-gray-600 mt-2">Fresh properties just added to our marketplace</p>
              </div>
              <Link
                to="/properties?sort=newest"
                className="mt-4 md:mt-0 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                View All Properties
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </AnimatedSection>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-2xl h-80 animate-pulse" />
                ))}
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {recentProperties.map((property) => (
                  <motion.div key={property._id} variants={fadeInUp}>
                    <PropertyCard property={property} compact />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-12">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2">What Our Clients Say</h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Don't just take our word for it - hear from some of our satisfied customers.
              </p>
            </AnimatedSection>

            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12"
                >
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0">
                      <img
                        src={testimonials[activeTestimonial].image}
                        alt={testimonials[activeTestimonial].name}
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                      />
                    </div>
                    <div className="text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
                        {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-lg text-gray-700 mb-4 italic">
                        "{testimonials[activeTestimonial].text}"
                      </p>
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonials[activeTestimonial].name}</h4>
                        <p className="text-gray-500 text-sm">{testimonials[activeTestimonial].role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Testimonial Navigation */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeTestimonial
                        ? 'bg-blue-600 w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-4 text-center">
            <AnimatedSection>
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Find Your Perfect Home?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of happy homeowners who found their dream property through HomeScape. Start your journey today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/properties"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Browse Properties
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/10 transition-colors"
                >
                  Create Free Account
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
                  <p className="text-gray-400">
                    Get the latest properties and market insights delivered to your inbox.
                  </p>
                </div>
                <form className="flex-1 w-full">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;