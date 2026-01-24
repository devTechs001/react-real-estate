import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHeart,
  FaEnvelope,
  FaCalendar,
  FaEye,
  FaChartLine,
} from 'react-icons/fa';
import { favoriteService } from '../../services/favoriteService';
import { inquiryService } from '../../services/InquiryService';
import { appointmentService } from '../../services/appointmentService';
import { aiService } from '../../services/aiService';
import PropertyCard from '../property/PropertyCard';
import Loader from '../common/Loader';

const ClientDashboard = () => {
  const [stats, setStats] = useState({
    favorites: 0,
    inquiries: 0,
    appointments: 0,
    views: 0,
  });
  const [favorites, setFavorites] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [favoritesData, inquiriesData, appointmentsData, recsData] = await Promise.all([
        favoriteService.getFavorites(),
        inquiryService.getMyInquiries(),
        appointmentService.getMyAppointments(),
        aiService.getRecommendations(3),
      ]);

      setFavorites(favoritesData.slice(0, 3));
      setRecommendations(recsData.recommendations.slice(0, 3));
      
      setStats({
        favorites: favoritesData.length,
        inquiries: inquiriesData.length,
        appointments: appointmentsData.length,
        views: favoritesData.reduce((sum, f) => sum + (f.property?.views || 0), 0),
      });
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  const statCards = [
    { icon: FaHeart, label: 'Favorites', value: stats.favorites, color: 'red', link: '/client/favorites' },
    { icon: FaEnvelope, label: 'Inquiries', value: stats.inquiries, color: 'blue', link: '/client/inquiries' },
    { icon: FaCalendar, label: 'Appointments', value: stats.appointments, color: 'green', link: '/client/appointments' },
    { icon: FaEye, label: 'Total Views', value: stats.views, color: 'purple', link: '#' },
  ];

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your property search.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`text-2xl text-${stat.color}-600`} />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
            </div>
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Favorites */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Favorites</h2>
          <Link to="/client/favorites" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>
        
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <PropertyCard key={fav._id} property={fav.property} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No favorites yet. Start exploring properties!</p>
            <Link to="/properties" className="btn btn-primary mt-4 inline-block">
              Browse Properties
            </Link>
          </div>
        )}
      </div>

      {/* AI Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Recommended For You</h2>
            <p className="text-gray-600">AI-powered property suggestions based on your preferences</p>
          </div>
          <Link to="/recommendations" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>
        
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <div key={rec.property._id}>
                <div className="mb-2">
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    <FaChartLine className="text-xs" />
                    {rec.score}% Match
                  </span>
                </div>
                <PropertyCard property={rec.property} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <FaChartLine className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Browse properties to get personalized recommendations</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;