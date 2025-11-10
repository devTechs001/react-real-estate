import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBars, FaTimes, FaUser, FaPlus } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/properties', label: 'Properties' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
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

            {isAuthenticated ? (
              <>
                <Link
                  to="/add-property"
                  className="flex items-center gap-2 btn btn-primary"
                >
                  <FaPlus /> Add Property
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-700 hover:text-primary-600">
                    <FaUser />
                    <span>{user?.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/my-properties"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Properties
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
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
                    <Link
                      to="/add-property"
                      onClick={() => setIsOpen(false)}
                      className="btn btn-primary"
                    >
                      <FaPlus /> Add Property
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="text-gray-700 py-2"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/my-properties"
                      onClick={() => setIsOpen(false)}
                      className="text-gray-700 py-2"
                    >
                      My Properties
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="text-gray-700 py-2"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="btn btn-secondary"
                    >
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