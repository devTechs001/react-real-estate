import { useState, useEffect } from 'react';
import { favoriteService } from '../services/favoriteService';
import toast from 'react-hot-toast';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const data = await favoriteService.getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (propertyId, notes = '', tags = []) => {
    try {
      const newFavorite = await favoriteService.addFavorite(propertyId, notes, tags);
      setFavorites([...favorites, newFavorite]);
      toast.success('Added to favorites');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to favorites');
      return false;
    }
  };

  const removeFromFavorites = async (propertyId) => {
    try {
      await favoriteService.removeFavorite(propertyId);
      setFavorites(favorites.filter((f) => f.property._id !== propertyId));
      toast.success('Removed from favorites');
      return true;
    } catch (error) {
      toast.error('Failed to remove from favorites');
      return false;
    }
  };

  const isFavorited = (propertyId) => {
    return favorites.some((f) => f.property._id === propertyId);
  };

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorited,
    refreshFavorites: fetchFavorites,
  };
};