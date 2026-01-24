import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';

const NotFound = () => {
  return (
    <>
      <SEO title="Page Not Found" description="The page you are looking for does not exist" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg"
        >
          {/* 404 Number */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mb-8"
          >
            <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
              404
            </h1>
          </motion.div>

          {/* Message */}
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8">
            Sorry, the page you are looking for doesn't exist or has been moved. Don't worry, let's get you back on track!
          </p>

          {/* Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg p-6 shadow-md"
            >
              <FaHome className="text-3xl text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">Home</h3>
              <p className="text-sm text-gray-600">Return to the main page</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg p-6 shadow-md"
            >
              <FaSearch className="text-3xl text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">Browse</h3>
              <p className="text-sm text-gray-600">Browse our property listings</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg p-6 shadow-md"
            >
              <FaArrowLeft className="text-3xl text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">Go Back</h3>
              <p className="text-sm text-gray-600">Return to the previous page</p>
            </motion.div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn btn-primary px-8 py-3 flex items-center justify-center gap-2"
            >
              <FaHome />
              Back to Home
            </Link>
            <Link
              to="/properties"
              className="btn btn-secondary px-8 py-3 flex items-center justify-center gap-2"
            >
              <FaSearch />
              Browse Properties
            </Link>
          </div>

          {/* Help Text */}
          <p className="mt-8 text-sm text-gray-600">
            If you believe this is an error, please{' '}
            <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
              contact us
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;
