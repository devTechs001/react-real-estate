import { Link } from 'react-router-dom';
import { FaHome, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const Footer = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  // Dynamic links based on user authentication status
  const userLinks = user ? [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Properties', path: '/my-properties' },
    { label: 'Favorites', path: '/favorites' },
    { label: 'Profile', path: '/profile' },
  ] : [
    { label: 'Sign In', path: '/login' },
    { label: 'Register', path: '/register' },
    { label: 'Get Started', path: '/register' },
  ];

  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold mb-3">
              <FaHome className="text-primary-500" />
              <span className="font-display">RealEstate</span>
            </Link>
            <p className="text-gray-400 mb-3 text-sm">
              Find your dream property with us. We offer the best real estate deals.
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <FaMapMarkerAlt className="text-primary-500" />
              <span>123 Main Street, New York, NY 10001</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/properties"
                  className="text-gray-400 hover:text-primary-500 transition-colors text-sm"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base font-semibold mb-3 text-white">Services</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/properties" className="text-gray-400 hover:text-primary-500 transition-colors text-sm">Buy Property</Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-400 hover:text-primary-500 transition-colors text-sm">Sell Property</Link>
              </li>
              <li>
                <Link to="/price-prediction" className="text-gray-400 hover:text-primary-500 transition-colors text-sm">Price Prediction</Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-400 hover:text-primary-500 transition-colors text-sm">More Features</Link>
              </li>
            </ul>
          </div>

          {/* User Account Links */}
          <div>
            <h3 className="text-base font-semibold mb-3">
              {user ? 'My Account' : 'Account'}
            </h3>
            <ul className="space-y-1">
              {userLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500/10 rounded-full flex items-center justify-center">
              <FaPhone className="text-primary-500" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Call Us</h4>
              <p className="text-gray-400 text-sm">(555) 123-4567</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500/10 rounded-full flex items-center justify-center">
              <FaEnvelope className="text-primary-500" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Email Us</h4>
              <p className="text-gray-400 text-sm">info@realestate.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500/10 rounded-full flex items-center justify-center">
              <FaMapMarkerAlt className="text-primary-500" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Visit Us</h4>
              <p className="text-gray-400 text-sm">123 Main St, NY 10001</p>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-3">
              <a
                href="#"
                className="text-xl text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="text-xl text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="text-xl text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="text-xl text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400">
              <Link to="/privacy" className="hover:text-primary-500 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-primary-500 transition-colors">Terms</Link>
              <span className="text-yellow-400">Trustpilot ⭐⭐⭐⭐⭐</span>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; {currentYear} RealEstate. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;