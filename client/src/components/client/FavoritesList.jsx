import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaEdit } from 'react-icons/fa';
import { favoriteService } from '../../services/favoriteService';
import PropertyCard from '../property/PropertyCard';
import Loader from '../common/Loader';
import Card from '../ui/Card';

const FavoritesList = ({ limit }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const data = await favoriteService.getFavorites();
      setFavorites(limit ? data.slice(0, limit) : data);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (propertyId) => {
    if (!confirm('Remove from favorites?')) return;

    try {
      await favoriteService.removeFavorite(propertyId);
      setFavorites(favorites.filter((f) => f.property._id !== propertyId));
    } catch (error) {
      console.error('Failed to remove:', error);
    }
  };

  if (loading) return <Loader />;

  if (favorites.length === 0) {
    return (
      <Card className="text-center py-12">
        <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">No favorites yet</p>
        <Link to="/properties" className="btn btn-primary inline-block">
          Browse Properties
        </Link>
      </Card>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((fav) => (
          <div key={fav._id} className="relative">
            <PropertyCard property={fav.property} />
            <button
              onClick={() => handleRemove(fav.property._id)}
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors z-10"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      {limit && favorites.length > 0 && (
        <div className="text-center mt-6">
          <Link to="/client/favorites" className="btn btn-outline">
            View All Favorites
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
