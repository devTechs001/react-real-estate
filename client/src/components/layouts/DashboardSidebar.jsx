import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const DashboardSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Define navigation links based on user role
  const getNavigationLinks = () => {
    if (user?.role === 'admin') {
      return [
        { path: '/admin', label: 'Overview', icon: '📊' },
        { path: '/admin/users', label: 'Users', icon: '👥' },
        { path: '/admin/properties', label: 'Properties', icon: '🏠' },
        { path: '/admin/approvals', label: 'Approvals', icon: '✅' },
        { path: '/admin/transactions', label: 'Transactions', icon: '💰' },
        { path: '/admin/reports', label: 'Reports', icon: '📈' },
        { path: '/admin/reported', label: 'Reported Items', icon: '🚨' },
        { path: '/admin/analytics', label: 'Analytics', icon: '📊' },
        { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
      ];
    } else if (user?.role === 'seller') {
      return [
        { path: '/seller', label: 'Overview', icon: '📊' },
        { path: '/seller/properties', label: 'My Properties', icon: '🏠' },
        { path: '/seller/properties/new', label: 'Add Property', icon: '➕' },
        { path: '/seller/inquiries', label: 'Inquiries', icon: '💬' },
        { path: '/seller/appointments', label: 'Appointments', icon: '📅' },
        { path: '/seller/analytics', label: 'Analytics', icon: '📈' },
        { path: '/seller/leads', label: 'Leads', icon: '🎯' },
        { path: '/seller/subscriptions', label: 'Subscriptions', icon: '💳' },
      ];
    } else {
      // Default for user role
      return [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/favorites', label: 'Favorites', icon: '❤️' },
        { path: '/inquiries', label: 'Inquiries', icon: '💬' },
        { path: '/appointments', label: 'Appointments', icon: '📅' },
        { path: '/saved-searches', label: 'Saved Searches', icon: '🔍' },
        { path: '/notifications', label: 'Notifications', icon: '🔔' },
        { path: '/profile', label: 'Profile', icon: '👤' },
        { path: '/settings', label: 'Settings', icon: '⚙️' },
      ];
    }
  };

  const navigationLinks = getNavigationLinks();

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen hidden md:block">
      <div className="p-6">
        <h2 className="text-xl font-bold">Dashboard</h2>
      </div>
      <nav className="mt-6">
        <ul>
          {navigationLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;