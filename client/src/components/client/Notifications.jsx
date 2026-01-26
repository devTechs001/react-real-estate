// client/src/pages/user/Notifications.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setNotifications([
      {
        id: 1,
        type: 'property_match',
        title: 'New Property Match',
        message: 'A new property matches your "Miami Beach Condos" search.',
        link: '/properties/1',
        read: false,
        createdAt: '2024-01-15T10:30:00'
      },
      {
        id: 2,
        type: 'price_drop',
        title: 'Price Drop Alert',
        message: 'Luxury Waterfront Villa price dropped by $50,000',
        link: '/properties/1',
        read: false,
        createdAt: '2024-01-15T09:00:00'
      },
      {
        id: 3,
        type: 'appointment',
        title: 'Appointment Reminder',
        message: 'Your property tour is scheduled for tomorrow at 10:00 AM',
        link: '/appointments',
        read: false,
        createdAt: '2024-01-14T18:00:00'
      },
      {
        id: 4,
        type: 'message',
        title: 'New Message',
        message: 'Sarah Mitchell replied to your inquiry about Modern Downtown Penthouse',
        link: '/inquiries',
        read: true,
        createdAt: '2024-01-14T14:30:00'
      },
      {
        id: 5,
        type: 'system',
        title: 'Welcome to HomeScape!',
        message: 'Thanks for joining. Start exploring properties tailored just for you.',
        link: '/properties',
        read: true,
        createdAt: '2024-01-10T12:00:00'
      },
    ]);
    setLoading(false);
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const getIcon = (type) => {
    const icons = {
      property_match: { icon: '🏠', bg: 'bg-blue-100', color: 'text-blue-600' },
      price_drop: { icon: '💰', bg: 'bg-green-100', color: 'text-green-600' },
      appointment: { icon: '📅', bg: 'bg-purple-100', color: 'text-purple-600' },
      message: { icon: '💬', bg: 'bg-orange-100', color: 'text-orange-600' },
      system: { icon: '🔔', bg: 'bg-gray-100', color: 'text-gray-600' }
    };
    return icons[type] || icons.system;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  return (
    <>
      <SEO title="Notifications - HomeScape" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {['all', 'unread'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm capitalize ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-blue-600 text-sm hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          </h2>
          <p className="text-gray-600">
            {filter === 'unread' 
              ? "You're all caught up!" 
              : "We'll notify you about important updates"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notification, index) => {
            const iconStyle = getIcon(notification.type);
            
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl p-4 transition-all ${
                  !notification.read ? 'border-l-4 border-blue-600' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${iconStyle.bg} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
                    {iconStyle.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{formatTime(notification.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Mark as read"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <Link
                      to={notification.link}
                      onClick={() => markAsRead(notification.id)}
                      className="inline-flex items-center gap-1 text-blue-600 text-sm mt-3 hover:underline"
                    >
                      View Details
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Notification Settings Link */}
      <div className="mt-8 text-center">
        <Link to="/settings" className="text-blue-600 hover:underline text-sm">
          Manage notification preferences →
        </Link>
      </div>
    </>
  );
};

export default Notifications;