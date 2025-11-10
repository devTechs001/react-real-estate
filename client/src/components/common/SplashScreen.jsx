import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
          className="mb-8"
        >
          <FaHome className="text-white text-8xl mx-auto" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4 font-display"
        >
          Real Estate App
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white text-xl"
        >
          Find Your Dream Property
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <div className="loader mx-auto border-white border-t-transparent"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;