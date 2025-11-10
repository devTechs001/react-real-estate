import { Link } from 'react-router-dom';
import { FaHome, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold mb-4">
              <FaHome className="text-primary-500" />
              <span className="font-display">RealEstate</span>
            </Link>
            <p className="text-gray-400">
              Find your dream property with us. We offer the best real estate deals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/properties"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Buy Property</li>
              <li className="text-gray-400">Sell Property</li>
              <li className="text-gray-400">Rent Property</li>
              <li className="text-gray-400">Property Management</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-2xl text-gray-400 hover:text-primary-500 transition-colors"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="text-2xl text-gray-400 hover:text-primary-500 transition-colors"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="text-2xl text-gray-400 hover:text-primary-500 transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="text-2xl text-gray-400 hover:text-primary-500 transition-colors"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} RealEstate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;