import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBars, FaTimes, FaUser, FaPlus, FaChartLine, FaCog, FaHeart, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { canAccess } = usePermissions();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get role-specific dashboard path
  const getDashboardPath = () => {
    if (!user) return '/dashboard';

    const dashboardPaths = {
      user: '/client/dashboard',
      agent: '/seller/dashboard',
      admin: '/admin/dashboard',
    };

    return dashboardPaths[user.role] || '/dashboard';
  };

  // Role-based navigation links
  const getRoleBasedLinks = useMemo(() => {
    if (!isAuthenticated || !user) return [];

    const links = [];

    // Client-specific links
    if (user.role === 'user') {
      links.push(
        { to: '/client/favorites', label: 'Favorites', icon: <FaHeart /> },
        { to: '/client/messages', label: 'Messages', icon: <FaEnvelope /> }
      );
    }

    // Agent-specific links
    if (user.role === 'agent') {
      links.push(
        { to: '/seller/properties', label: 'My Properties', icon: <FaHome /> },
        { to: '/seller/analytics', label: 'Analytics', icon: <FaChartLine /> },
        { to: '/seller/messages', label: 'Messages', icon: <FaEnvelope /> }
      );
    }

    // Admin-specific links
    if (user.role === 'admin') {
      links.push(
        { to: '/admin/users', label: 'Users', icon: <FaUser /> },
        { to: '/admin/properties', label: 'Properties', icon: <FaHome /> },
        { to: '/admin/reports', label: 'Reports', icon: <FaChartLine /> },
        { to: '/admin/system', label: 'System', icon: <FaCog /> }
      );
    }

    return links;
  }, [isAuthenticated, user]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/properties', label: 'Properties' },
    { to: '/price-prediction', label: 'AI Tools' },
    { to: '/features', label: 'Features' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-gradient-to-r from-white via-blue-50 to-white shadow-lg fixed top-0 w-full z-40 border-b border-blue-100">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary-600">
            <FaHome className="text-3xl" />
            <span className="font-display">RealEstate</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}

            {/* Role-based quick links */}
            {getRoleBasedLinks.slice(0, 2).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                {canAccess('manage_properties') && (
                  <Link
                    to="/add-property"
                    className="flex items-center gap-2 btn btn-primary"
                  >
                    <FaPlus /> Add Property
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-700 hover:text-primary-600">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden xl:inline">{user?.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-gray-100">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                        {user?.role === 'user' ? 'Client' : user?.role === 'agent' ? 'Agent' : 'Admin'}
                      </span>
                    </div>

                    {/* Dashboard Link */}
                    <Link
                      to={getDashboardPath()}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FaChartLine className="text-primary-600" />
                      <span>Dashboard</span>
                    </Link>

                    {/* Role-specific links */}
                    {getRoleBasedLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    ))}

                    {/* Common links */}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FaUser />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FaCog />
                        <span>Settings</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FaTimes />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl text-gray-700"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mt-4 overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-primary-600 py-2"
                  >
                    {link.label}
                  </Link>
                ))}

                {isAuthenticated ? (
                  <>
                    {/* User Info */}
                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                        {user?.role === 'user' ? 'Client' : user?.role === 'agent' ? 'Agent' : 'Admin'}
                      </span>
                    </div>

                    {/* Dashboard */}
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-gray-700 py-2 font-medium"
                    >
                      <FaChartLine className="text-primary-600" />
                      Dashboard
                    </Link>

                    {/* Role-specific links */}
                    {getRoleBasedLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 text-gray-700 py-2"
                      >
                        {link.icon}
                        {link.label}
                      </Link>
                    ))}

                    {/* Add Property (for agents/admins) */}
                    {canAccess('manage_properties') && (
                      <Link
                        to="/add-property"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 btn btn-primary"
                      >
                        <FaPlus /> Add Property
                      </Link>
                    )}

                    {/* Common links */}
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 text-gray-700 py-2"
                      >
                        <FaUser />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 text-gray-700 py-2"
                      >
                        <FaCog />
                        Settings
                      </Link>
                    </div>

                    {/* Logout */}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 btn btn-secondary w-full mt-2"
                    >
                      <FaTimes />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="btn btn-secondary"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="btn btn-primary"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;