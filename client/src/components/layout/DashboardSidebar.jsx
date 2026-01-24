import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  FaHome, FaChartLine, FaHeart, FaEnvelope, FaCalendar, 
  FaSearch, FaHistory, FaExchangeAlt, FaUser, FaCog,
  FaStar, FaCreditCard, FaUsers, FaFileAlt, FaServer,
  FaBuilding, FaClipboardList
} from 'react-icons/fa';
import clsx from 'clsx';

/**
 * DashboardSidebar Component
 * Role-based sidebar navigation for dashboards
 */
const DashboardSidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Get navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return [];

    const navItems = {
      user: [
        { to: '/client/dashboard', label: 'Dashboard', icon: <FaChartLine /> },
        { to: '/client/favorites', label: 'Favorites', icon: <FaHeart /> },
        { to: '/client/inquiries', label: 'My Inquiries', icon: <FaClipboardList /> },
        { to: '/client/appointments', label: 'Appointments', icon: <FaCalendar /> },
        { to: '/client/messages', label: 'Messages', icon: <FaEnvelope /> },
        { to: '/client/comparison', label: 'Compare', icon: <FaExchangeAlt /> },
        { to: '/client/saved-searches', label: 'Saved Searches', icon: <FaSearch /> },
        { to: '/client/view-history', label: 'View History', icon: <FaHistory /> },
      ],
      agent: [
        { to: '/seller/dashboard', label: 'Dashboard', icon: <FaChartLine /> },
        { to: '/seller/properties', label: 'My Properties', icon: <FaBuilding /> },
        { to: '/seller/inquiries', label: 'Inquiries', icon: <FaClipboardList /> },
        { to: '/seller/appointments', label: 'Appointments', icon: <FaCalendar /> },
        { to: '/seller/messages', label: 'Messages', icon: <FaEnvelope /> },
        { to: '/seller/analytics', label: 'Analytics', icon: <FaChartLine /> },
        { to: '/seller/reviews', label: 'Reviews', icon: <FaStar /> },
        { to: '/seller/subscriptions', label: 'Subscriptions', icon: <FaCreditCard /> },
      ],
      admin: [
        { to: '/admin/dashboard', label: 'Dashboard', icon: <FaChartLine /> },
        { to: '/admin/users', label: 'Users', icon: <FaUsers /> },
        { to: '/admin/properties', label: 'Properties', icon: <FaBuilding /> },
        { to: '/admin/reports', label: 'Reports', icon: <FaFileAlt /> },
        { to: '/admin/system', label: 'System', icon: <FaServer /> },
      ],
    };

    return navItems[user.role] || [];
  };

  const navigationItems = getNavigationItems();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:sticky top-0 left-0 h-screen bg-white shadow-lg z-50 transition-transform duration-300',
          'w-64 flex flex-col',
          {
            'translate-x-0': isOpen,
            '-translate-x-full lg:translate-x-0': !isOpen,
          }
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600">
            <FaHome className="text-2xl" />
            <span className="font-display">RealEstate</span>
          </Link>
          <p className="text-sm text-gray-500 mt-2">
            {user?.role === 'user' ? 'Client' : user?.role === 'agent' ? 'Agent' : 'Admin'} Portal
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onClose}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    {
                      'bg-primary-600 text-white shadow-md': isActive(item.to),
                      'text-gray-700 hover:bg-gray-100': !isActive(item.to),
                    }
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Common Links */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">
              Account
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/profile"
                  onClick={onClose}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    {
                      'bg-primary-600 text-white shadow-md': isActive('/profile'),
                      'text-gray-700 hover:bg-gray-100': !isActive('/profile'),
                    }
                  )}
                >
                  <FaUser className="text-lg" />
                  <span className="font-medium">Profile</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  onClick={onClose}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    {
                      'bg-primary-600 text-white shadow-md': isActive('/settings'),
                      'text-gray-700 hover:bg-gray-100': !isActive('/settings'),
                    }
                  )}
                >
                  <FaCog className="text-lg" />
                  <span className="font-medium">Settings</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
          >
            <FaHome />
            <span>Back to Home</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;

