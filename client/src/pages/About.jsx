// client/src/pages/About.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import SEO from '../components/common/SEO';

const About = () => {
  const team = [
    {
      name: 'John Anderson',
      role: 'CEO & Founder',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: '15+ years in real estate technology',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Sarah Mitchell',
      role: 'Head of Operations',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: 'Former VP at leading property firm',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'David Chen',
      role: 'CTO',
      image: 'https://randomuser.me/api/portraits/men/52.jpg',
      bio: 'AI/ML expert, ex-Google engineer',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Customer Success',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      bio: '10+ years in customer experience',
      social: { linkedin: '#', twitter: '#' }
    },
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Transparency',
      description: 'We believe in honest, clear communication with all our users.'
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'Constantly pushing boundaries with AI and technology.'
    },
    {
      icon: '🤝',
      title: 'Trust',
      description: 'Building lasting relationships through reliable service.'
    },
    {
      icon: '🌟',
      title: 'Excellence',
      description: 'Striving for the highest quality in everything we do.'
    },
  ];

  const milestones = [
    { year: '2018', title: 'Founded', description: 'HomeScape was born with a vision' },
    { year: '2019', title: '1,000 Listings', description: 'Reached our first milestone' },
    { year: '2020', title: 'AI Launch', description: 'Introduced AI-powered search' },
    { year: '2021', title: '10,000 Users', description: 'Growing community of users' },
    { year: '2022', title: 'National Expansion', description: 'Expanded to 50+ cities' },
    { year: '2023', title: '15,000+ Properties', description: 'Largest platform in region' },
  ];

  return (
    <>
      <SEO title="About Us - HomeScape" description="Learn about HomeScape's mission to revolutionize real estate." />
      
      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-blue-300 text-sm mb-6">
                Our Story
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Revolutionizing{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Real Estate
                </span>
              </h1>
              <p className="text-xl text-blue-100/80">
                We're on a mission to make finding your perfect home as simple and enjoyable as possible.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                  Our Mission
                </span>
                <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">
                  Making Home Finding Effortless
                </h2>
                <p className="text-gray-600 mb-4">
                  At HomeScape, we believe everyone deserves to find their perfect home without the stress and complexity traditionally associated with real estate.
                </p>
                <p className="text-gray-600 mb-6">
                  Through innovative AI technology and a user-first approach, we've transformed the property search experience, making it intuitive, transparent, and even enjoyable.
                </p>
                <div className="flex gap-8">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">15K+</div>
                    <div className="text-gray-500 text-sm">Properties</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">8K+</div>
                    <div className="text-gray-500 text-sm">Happy Clients</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">50+</div>
                    <div className="text-gray-500 text-sm">Cities</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
                  alt="Team meeting"
                  className="rounded-2xl shadow-xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                      🏆
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Best Platform 2023</div>
                      <div className="text-sm text-gray-500">Real Estate Awards</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                Our Values
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2">
                What We Stand For
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                Our Journey
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2">
                Milestones
              </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200" />

                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={`relative flex items-center mb-8 ${
                      index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                        <span className="text-blue-600 font-bold text-lg">{milestone.year}</span>
                        <h3 className="font-semibold text-gray-900">{milestone.title}</h3>
                        <p className="text-gray-600 text-sm">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white" />
                    <div className="w-1/2" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                Our Team
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2">
                Meet The Leaders
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="relative h-64">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-blue-200 text-sm">{member.role}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                    <div className="flex gap-3">
                      <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                      <a href={member.social.twitter} className="text-gray-400 hover:text-blue-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Join Our Journey
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Be part of the real estate revolution. Start finding your dream home today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/properties"
                  className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Browse Properties
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
};

export default About;