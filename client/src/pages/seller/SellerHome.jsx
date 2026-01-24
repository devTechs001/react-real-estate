import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaCalendar, FaEnvelope, FaChartLine, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { propertyService } from '../../services/propertyService';
import PropertyCard from '../../components/property/PropertyCard';
import Loader from '../../components/common/Loader';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';

const SellerHome = () => {
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeListings: 0,
    totalViews: 0,
    pendingAppointments: 0,
  });

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      const [properties, sellerStats] = await Promise.all([
        propertyService.getUserProperties({ limit: 6 }),
        propertyService.getSellerStats(),
      ]);
      setRecentProperties(properties);
      setStats(sellerStats);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  const quickActions = [
    {
      icon: FaPlus,
      title: 'Add Property',
      description: 'List a new property',
      link: '/add-property',
      color: 'green',
    },
    {
      icon: FaHome,
      title: 'My Properties',
      description: `${stats.totalProperties} total listings`,
      link: '/seller/properties',
      color: 'blue',
    },
    {
      icon: FaCalendar,
      title: 'Appointments',
      description: `${stats.pendingAppointments} pending`,
      link: '/seller/appointments',
      color: 'purple',
    },
    {
      icon: FaEnvelope,
      title: 'Inquiries',
      description: 'Manage inquiries',
      link: '/seller/inquiries',
      color: 'orange',
    },
  ];

  return (
    <>
      <SEO title="Seller Dashboard" description="Manage your property listings" />

      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">Welcome Back, Seller!</h1>
          <p className="text-xl">Manage your properties and grow your business</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Properties', value: stats.totalProperties, color: 'blue' },
            { label: 'Active Listings', value: stats.activeListings, color: 'green' },
            { label: 'Total Views', value: stats.totalViews, color: 'purple' },
            { label: 'Appointments', value: stats.pendingAppointments, color: 'orange' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <p className="text-gray-600 mb-2">{stat.label}</p>
              <p className={`text-4xl font-bold text-${stat.color}-600`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
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

        {/* Recent Properties */}
        {recentProperties.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Recent Properties</h2>
              <Link to="/seller/properties" className="text-primary-600 hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProperties.map((property, index) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.8 }}
                >
                  <PropertyCard property={property} />
                  <div className="mt-4 flex gap-2">
                    <Link
                      to={`/edit-property/${property._id}`}
                      className="btn btn-primary flex-1"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/seller/analytics?property=${property._id}`}
                      className="btn btn-outline flex-1"
                    >
                      <FaChartLine className="mr-2" />
                      Analytics
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SellerHome;
