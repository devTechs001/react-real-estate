import { motion } from 'framer-motion';
import { FaHome, FaArrowRight } from 'react-icons/fa';

const SplashScreen = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 260, damping: 20 },
    },
  };

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
        <div className="absolute inset-0 opacity-40">
          <motion.div
            initial={{ backgroundPosition: '0% 0%' }}
            animate={{ backgroundPosition: '100% 100%' }}
            transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse' }}
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15) 0%, transparent 50%)',
              backgroundSize: '200% 200%',
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative flex items-center justify-center h-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-2xl mx-auto px-4"
        >
          {/* Animated Logo Icon */}
          <motion.div
            variants={itemVariants}
            className="mb-10"
          >
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="inline-block p-8 bg-white/20 backdrop-blur-xl rounded-3xl mb-6 border border-white/30 shadow-2xl">
                <FaHome className="text-white text-7xl" />
              </div>
            </motion.div>
          </motion.div>

          {/* Main Title */}
          <motion.div variants={itemVariants} className="mb-4">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-3 font-display tracking-tight drop-shadow-lg">
              RealEstate<span className="text-cyan-300">Hub</span>
            </h1>
            <motion.div 
              animate={{ scaleX: [0, 1] }}
              transition={{ duration: 1.5 }}
              className="h-1 w-32 bg-gradient-to-r from-cyan-300 to-blue-300 mx-auto rounded-full mb-6" 
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-white/90 text-xl md:text-2xl mb-3 font-light drop-shadow-md"
          >
            Find Your Dream Property Today
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="text-white/70 text-base md:text-lg font-light drop-shadow-md"
          >
            Discover thousands of properties tailored to your needs
          </motion.p>

          {/* Loading Animation */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scaleY: [1, 1.5, 1] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
                className="w-1.5 h-8 bg-white/60 rounded-full"
              />
            ))}
          </motion.div>

          {/* Status Text */}
          <motion.p
            variants={itemVariants}
            className="text-white/50 text-sm mt-8"
          >
            Loading your experience...
          </motion.p>
        </motion.div>
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
      />
    </div>
  );
};

export default SplashScreen;