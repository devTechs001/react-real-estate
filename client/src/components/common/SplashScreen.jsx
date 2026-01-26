// client/src/components/common/SplashScreen.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Minimum loading time to ensure proper animation display
    const minimumLoadTime = 3000; // 3 seconds minimum
    const startTime = Date.now();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, minimumLoadTime - elapsedTime);

          setTimeout(() => {
            try {
              setLoading(false);
              navigate('/home');
            } catch (err) {
              setError(err.message);
              // Fallback navigation if router fails
              window.location.href = '/home';
            }
          }, remainingTime > 0 ? remainingTime : 500);
          return 100;
        }
        return prev + 1; // Slower progress for better UX
      });
    }, 100); // Update every 100ms instead of 50ms

    // Cleanup function
    return () => clearInterval(interval);
  }, [navigate]);

  // Handle error state if needed
  if (error) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
        role="alert"
        aria-live="assertive"
      >
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/home'}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            aria-label="Go to home page"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      transition: { duration: 0.5 }
    }
  };

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="status"
          aria-label="Loading screen"
          aria-live="polite"
        >
          {/* Animated Background Elements */}
          <div
            className="absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            {/* Floating Houses */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white/5"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 100
                }}
                animate={{
                  y: -100,
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: "linear"
                }}
                aria-hidden="true"
              >
                <svg
                  className="w-20 h-20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Decorative house icon"
                >
                  <title>Decorative house icon</title>
                  <path d="M12 3L4 9v12h16V9l-8-6zm0 2.7L18 10v9H6v-9l6-4.3z"/>
                  <path d="M10 14h4v5h-4z"/>
                </svg>
              </motion.div>
            ))}

            {/* Gradient Orbs */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, -30, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                x: [0, -50, 0],
                y: [0, 30, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
          </div>

          {/* Main Content */}
          <div
            className="relative z-10 flex flex-col items-center"
            aria-labelledby="brand-name"
          >
            {/* Logo */}
            <motion.div
              variants={logoVariants}
              className="relative mb-8"
              aria-hidden="true"
            >
              <motion.div
                variants={pulseVariants}
                animate="pulse"
                className="relative"
              >
                {/* Outer Ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-40 h-40 rounded-full border-4 border-blue-400/30"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-48 h-48 rounded-full border-2 border-dashed border-blue-300/20"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  />
                </div>

                {/* Logo Icon */}
                <div
                  className="w-32 h-32 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30"
                  aria-label="HomeScape logo"
                >
                  <svg
                    className="w-16 h-16 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <title>HomeScape logo</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </motion.div>
            </motion.div>

            {/* Brand Name */}
            <motion.div variants={textVariants} className="text-center mb-12">
              <h1
                className="text-5xl md:text-6xl font-bold text-white mb-2"
                id="brand-name"
              >
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  HomeScape
                </span>
              </h1>
              <motion.p
                className="text-blue-200/80 text-lg tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                aria-label="Find Your Perfect Place"
              >
                Find Your Perfect Place
              </motion.p>
            </motion.div>

            {/* Loading Bar */}
            <motion.div
              variants={textVariants}
              className="w-64 md:w-80"
            >
              <div
                className="relative h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label="Loading progress"
              >
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: [-256, 256] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  style={{ width: '50%' }}
                />
              </div>
              <div className="flex justify-between mt-3 text-sm text-blue-200/60">
                <span aria-label="Loading status">Loading Experience</span>
                <span aria-label={`${progress} percent complete`}>{progress}%</span>
              </div>
            </motion.div>

            {/* Loading Text */}
            <motion.div
              className="mt-8 flex items-center gap-2 text-blue-200/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              aria-label="Loading status description"
            >
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                aria-hidden="true"
              >
                ●
              </motion.span>
              <span className="text-sm" aria-live="polite">
                {progress < 30 && "Initializing..."}
                {progress >= 30 && progress < 60 && "Loading properties..."}
                {progress >= 60 && progress < 90 && "Preparing your experience..."}
                {progress >= 90 && "Almost there..."}
              </span>
            </motion.div>
          </div>

          {/* Bottom Decoration */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            aria-label="Platform statistics"
          >
            <div className="flex items-center gap-8 text-blue-200/40 text-xs">
              <span aria-label="10,000+ Properties available">🏠 10,000+ Properties</span>
              <span aria-label="Trusted platform">⭐ Trusted Platform</span>
              <span aria-label="Secure transactions">🔒 Secure Transactions</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;