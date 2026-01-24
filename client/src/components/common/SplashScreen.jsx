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
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-700">
        <div className="absolute inset-0 opacity-30">
          <motion.div
            initial={{ backgroundPosition: '0% 0%' }}
            animate={{ backgroundPosition: '100% 100%' }}
            transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
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
          {/* Logo/Icon */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="inline-block p-6 bg-white/10 backdrop-blur-md rounded-full mb-4 border border-white/20">
                <FaHome className="text-white text-6xl" />
              </div>
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.div variants={itemVariants}>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 font-display tracking-tight">
              HomeHub
            </h1>
            <div className="h-1 w-24 bg-white/30 mx-auto rounded-full mb-6" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-white text-lg md:text-xl mb-2 font-light"
          >
            Find Your Dream Property
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="text-white/70 text-base md:text-lg mb-12"
          >
            Discover amazing homes and connect with top real estate agents
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