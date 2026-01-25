import { motion } from 'framer-motion';
import { FaUsers, FaHome, FaAward, FaHandshake, FaBullseye, FaLightbulb, FaHeart, FaTrophy, FaLinkedin, FaTwitter } from 'react-icons/fa';
import SEO from '../components/common/SEO';
import { Link } from 'react-router-dom';

const About = () => {
  const stats = [
    { icon: FaHome, label: 'Properties Listed', value: '50,000+' },
    { icon: FaUsers, label: 'Happy Clients', value: '10,000+' },
    { icon: FaAward, label: 'Industry Recognition', value: '25+' },
    { icon: FaHandshake, label: 'Successful Deals', value: '15,000+' },
  ];

  const values = [
    {
      icon: <FaBullseye className="text-4xl text-blue-600" />,
      title: 'Customer Focus',
      description: 'Your success is our mission. We prioritize your needs above everything else.',
    },
    {
      icon: <FaLightbulb className="text-4xl text-yellow-600" />,
      title: 'Innovation',
      description: 'We continuously innovate to bring cutting-edge technology to real estate.',
    },
    {
      icon: <FaHeart className="text-4xl text-red-600" />,
      title: 'Integrity',
      description: 'Transparency and honesty are at the core of everything we do.',
    },
    {
      icon: <FaTrophy className="text-4xl text-amber-600" />,
      title: 'Excellence',
      description: 'We strive for excellence in every interaction and transaction.',
    },
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Founder',
      bio: 'Real estate visionary with 20+ years of industry experience. Led multiple startups to success.',
      social: ['linkedin', 'twitter'],
    },
    {
      name: 'Michael Rodriguez',
      role: 'Chief Technology Officer',
      bio: 'AI/ML expert who built RealEstateHub\'s proprietary valuation engine.',
      social: ['linkedin', 'twitter'],
    },
    {
      name: 'Emma Wilson',
      role: 'Head of Operations',
      bio: 'Operations strategist ensuring seamless customer experience across all platforms.',
      social: ['linkedin', 'twitter'],
    },
    {
      name: 'James Park',
      role: 'VP of Customer Success',
      bio: 'Customer advocate passionate about solving real estate challenges.',
      social: ['linkedin', 'twitter'],
    },
  ];

  const milestones = [
    { year: '2018', event: 'RealEstateHub Founded', description: 'Started with a vision to transform real estate' },
    { year: '2019', event: 'AI Engine Launch', description: 'Launched our proprietary price prediction AI' },
    { year: '2021', event: '1M+ Properties Listed', description: 'Became one of the largest property marketplaces' },
    { year: '2023', event: 'Global Expansion', description: 'Expanded operations to 50+ countries' },
    { year: '2024', event: 'Industry Leader', description: 'Named Top Real Estate Tech Platform' },
  ];

  return (
    <>
      <SEO 
        title="About Us - RealEstateHub"
        description="Learn about RealEstateHub's mission to revolutionize real estate with AI-powered solutions"
      />

      {/* Hero Section */}
      <div className="pt-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
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

        <div className="container-custom relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold font-display mb-6">About RealEstateHub</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
              Transforming Real Estate Through Technology and Innovation
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container-custom px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold font-display mb-6 text-gray-900">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                To empower individuals and businesses to make informed real estate decisions through
                innovative technology, transparent information, and exceptional customer service. We
                believe everyone deserves access to professional-grade real estate tools.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our mission is to simplify the complex world of real estate, making it accessible,
                affordable, and enjoyable for everyone.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold font-display mb-6 text-gray-900">Our Vision</h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                To become the world's most trusted real estate platform, where buyers, sellers, and
                investors connect with confidence. We envision a future where technology removes
                barriers and creates opportunities.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We're building a global community where real estate transactions are transparent,
                efficient, and beneficial for all parties involved.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
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
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <stat.icon className="text-3xl text-blue-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="container-custom px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-display mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide every decision we make and every interaction we have
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-display mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">From startup to industry leader</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className={`flex gap-8 mb-8 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}
              >
                <div className="flex-1">
                  <div className="bg-white rounded-2xl p-8 shadow-lg h-full">
                    <h3 className="text-2xl font-bold text-blue-600 mb-2">{milestone.event}</h3>
                    <p className="text-gray-700">{milestone.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-1 h-24 bg-blue-200 mt-4"></div>
                  )}
                </div>
                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container-custom px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-display mb-4">Meet Our Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experienced professionals dedicated to transforming real estate
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-700 mb-6">{member.bio}</p>
                <div className="flex justify-center gap-4">
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <FaLinkedin size={20} />
                  </a>
                  <a
                    href="#"
                    className="text-blue-400 hover:text-blue-500 transition-colors"
                  >
                    <FaTwitter size={20} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
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
            <h2 className="text-4xl font-bold font-display mb-6">Join Our Growing Community</h2>
            <p className="text-xl text-white/90 mb-10">
              Be part of the real estate revolution. Start your journey with RealEstateHub today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/properties"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Browse Properties
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;