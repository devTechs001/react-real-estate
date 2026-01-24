import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const Toast = ({
  message,
  type = 'info',
  isVisible,
  onClose,
  duration = 3000
}) => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          className={clsx(
            'fixed top-4 right-4 z-50 max-w-md rounded-lg border shadow-lg p-4 flex items-start gap-3',
            bgColors[type]
          )}
        >
          <div className="flex-shrink-0 mt-0.5 text-lg font-bold">
            {icons[type]}
          </div>
          <div className="flex-1">
            <p className="text-sm">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
