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
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold mb-4">
              <FaHome className="text-primary-500" />
              <span className="font-display">RealEstate</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Find your dream property with us. We offer the best real estate deals.
            </p>
            <div className="flex items-center gap-2 text-gray-400">
              <FaMapMarkerAlt className="text-primary-500" />
              <span>123 Main Street, New York, NY 10001</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/properties"
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/properties" className="text-gray-400 hover:text-primary-500 transition-colors">Buy Property</Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-400 hover:text-primary-500 transition-colors">Sell Property</Link>
              </li>
              <li>
                <Link to="/price-prediction" className="text-gray-400 hover:text-primary-500 transition-colors">Price Prediction</Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-400 hover:text-primary-500 transition-colors">More Features</Link>
              </li>
            </ul>
          </div>

          {/* User Account Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {user ? 'My Account' : 'Account'}
            </h3>
            <ul className="space-y-2">
              {userLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="text-gray-400 hover:text-primary-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center">
              <FaPhone className="text-primary-500 text-xl" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Call Us</h4>
              <p className="text-gray-400">(555) 123-4567</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center">
              <FaEnvelope className="text-primary-500 text-xl" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Email Us</h4>
              <p className="text-gray-400">info@realestate.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center">
              <FaMapMarkerAlt className="text-primary-500 text-xl" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Visit Us</h4>
              <p className="text-gray-400">123 Main St, NY 10001</p>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-4">
              <a
                href="#"
                className="text-2xl text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="text-2xl text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="text-2xl text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="text-2xl text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-primary-500 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary-500 transition-colors">Terms of Service</Link>
              <span>Trustpilot ⭐⭐⭐⭐⭐</span>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {currentYear} RealEstate. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;