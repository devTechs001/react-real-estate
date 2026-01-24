import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

const Notification = ({ notification, onMarkAsRead, onDelete }) => {
  const { _id, message, type, isRead, createdAt } = notification;

  const typeStyles = {
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={clsx(
        'p-4 border-l-4 rounded-lg mb-3 transition-all',
        typeStyles[type] || typeStyles.info,
        !isRead && 'shadow-md'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className={clsx('text-sm', !isRead && 'font-semibold')}>
            {message}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isRead && (
            <button
              onClick={() => onMarkAsRead(_id)}
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              Mark as read
            </button>
          )}
          <button
            onClick={() => onDelete(_id)}
            className="text-xs text-red-600 hover:text-red-800 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {!isRead && (
        <div className="absolute top-4 right-4 w-2 h-2 bg-blue-600 rounded-full"></div>
      )}
    </motion.div>
  );
};

export default Notification;
