import { motion } from 'framer-motion';
import {
  FaSearch,
  FaMapMarkerAlt,
  FaChartLine,
  FaRobot,
  FaShieldAlt,
  FaBell,
  FaMobileAlt,
  FaUsers,
  FaVideo,
  FaWallet,
  FaCheck,
  FaStar,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      icon: <FaSearch className="text-5xl text-blue-600" />,
      title: 'Advanced Search',
      description: 'Powerful filtering and search capabilities to find properties that match your exact criteria',
      benefits: ['Location-based search', 'Filter by price, size, amenities', 'Save searches for later'],
    },
    {
      icon: <FaMapMarkerAlt className="text-5xl text-indigo-600" />,
      title: 'Interactive Maps',
      description: 'Explore neighborhoods with our interactive map interface showing nearby amenities',
      benefits: ['View neighborhood info', 'See nearby schools & transit', 'Commute time calculator'],
    },
    {
      icon: <FaChartLine className="text-5xl text-purple-600" />,
      title: 'Price Prediction',
      description: 'AI-powered property valuation and market trend analysis for informed decisions',
      benefits: ['Accurate price estimates', 'Market trends & analytics', 'Investment insights'],
    },
    {
      icon: <FaRobot className="text-5xl text-pink-600" />,
      title: 'AI Assistant',
      description: '24/7 intelligent chatbot to answer questions and help throughout your property journey',
      benefits: ['Instant answers 24/7', 'Property recommendations', 'Market insights'],
    },
    {
      icon: <FaVideo className="text-5xl text-red-600" />,
      title: 'Virtual Tours',
      description: 'Immersive 3D virtual tours and high-quality photo galleries of properties',
      benefits: ['360° property views', 'High-res photo galleries', 'Tour scheduling'],
    },
    {
      icon: <FaShieldAlt className="text-5xl text-green-600" />,
      title: 'Secure Transactions',
      description: 'Safe and encrypted property transactions with verified buyers and sellers',
      benefits: ['Verified users', 'Encrypted communications', 'Transaction support'],
    },
    {
      icon: <FaBell className="text-5xl text-orange-600" />,
      title: 'Smart Notifications',
      description: 'Receive alerts for new listings matching your preferences and price changes',
      benefits: ['New listing alerts', 'Price drop notifications', 'Custom alerts'],
    },
    {
      icon: <FaMobileAlt className="text-5xl text-teal-600" />,
      title: 'Mobile App',
      description: 'Seamless mobile experience for browsing properties on the go',
      benefits: ['iOS & Android', 'Offline browsing', 'Quick property access'],
    },
    {
      icon: <FaUsers className="text-5xl text-blue-700" />,
      title: 'Expert Agents',
      description: 'Connect with verified real estate professionals for personalized guidance',
      benefits: ['Professional guidance', 'Video consultations', 'Market expertise'],
    },
    {
      icon: <FaWallet className="text-5xl text-amber-600" />,
      title: 'Financing Help',
      description: 'Mortgage calculators and financing resources to plan your investment',
      benefits: ['Loan calculators', 'Financing options', 'Investment planning'],
    },
  ];

  const advantages = [
    { icon: <FaCheck className="text-2xl" />, text: 'Largest property database in the region' },
    { icon: <FaCheck className="text-2xl" />, text: 'Real-time market data and insights' },
    { icon: <FaCheck className="text-2xl" />, text: 'Transparent and honest pricing' },
    { icon: <FaCheck className="text-2xl" />, text: '24/7 customer support' },
    { icon: <FaCheck className="text-2xl" />, text: 'Zero hidden fees or charges' },
    { icon: <FaCheck className="text-2xl" />, text: 'Verified and trusted agents' },
  ];

  const stats = [
    { number: '50K+', label: 'Properties Listed' },
    { number: '10K+', label: 'Happy Customers' },
    { number: '98%', label: 'Satisfaction Rate' },
    { number: '500+', label: 'Expert Agents' },
  ];

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{ backgroundPosition: '200% center' }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>

        <div className="container-custom relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold font-display mb-6">
              Powerful Features for Real Estate Success
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Everything you need to find, buy, sell, or invest in properties with confidence
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-custom px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-display mb-4">Core Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the comprehensive tools and features that make RealEstateHub your best property
              marketplace choice
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
              >
                <div className="mb-6 inline-block p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>

                <div className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-700">
                      <FaCheck className="text-blue-600 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container-custom px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-display mb-4">Why Choose RealEstateHub?</h2>
            <p className="text-xl text-gray-600">
              We're committed to making real estate simple, transparent, and accessible to everyone
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {advantages.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-shrink-0 text-blue-600 bg-blue-50 p-3 rounded-full">
                    {item.icon}
                  </div>
                  <p className="text-lg text-gray-700">{item.text}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {advantages.slice(3).map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-shrink-0 text-blue-600 bg-blue-50 p-3 rounded-full">
                    {item.icon}
                  </div>
                  <p className="text-lg text-gray-700">{item.text}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-display mb-4">Feature Comparison</h2>
            <p className="text-xl text-gray-600">
              See what sets RealEstateHub apart from the competition
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="overflow-x-auto"
          >
            <table className="w-full bg-white rounded-2xl overflow-hidden shadow-lg">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold">RealEstateHub</th>
                  <th className="px-6 py-4 text-center font-semibold">Competitors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { feature: 'AI Price Prediction', hub: true, competitor: false },
                  { feature: '24/7 AI Assistant', hub: true, competitor: false },
                  { feature: 'Virtual Tours', hub: true, competitor: true },
                  { feature: 'Market Analytics', hub: true, competitor: false },
                  { feature: 'Instant Notifications', hub: true, competitor: true },
                  { feature: 'Mobile App', hub: true, competitor: true },
                  { feature: 'Verified Agents', hub: true, competitor: true },
                  { feature: 'Zero Hidden Fees', hub: true, competitor: false },
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      {row.hub && <FaCheck className="text-green-600 text-xl mx-auto" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.competitor && <FaCheck className="text-gray-400 text-xl mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="container-custom px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold font-display mb-6">Ready to Find Your Perfect Property?</h2>
            <p className="text-xl text-white/90 mb-10">
              Join thousands of satisfied customers who have found their dream homes on RealEstateHub
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/properties"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Explore Properties
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Features;
