import { useState, useEffect } from 'react';
import { FaHeart, FaTrash, FaEdit } from 'react-icons/fa';
import { favoriteService } from '../../services/favoriteService';
import PropertyCard from '../../components/property/PropertyCard';
import Loader from '../../components/common/Loader';
import Modal from '../../components/ui/Modal';
import Textarea from '../../components/ui/Textarea';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({ open: false, favorite: null });

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const data = await favoriteService.getFavorites();
      setFavorites(data);
    } catch (error) {
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (propertyId) => {
    if (!confirm('Remove from favorites?')) return;

    try {
      await favoriteService.removeFavorite(propertyId);
      setFavorites(favorites.filter((f) => f.property._id !== propertyId));
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  const handleUpdateNotes = async () => {
    try {
      await favoriteService.updateFavorite(
        editModal.favorite._id,
        editModal.favorite.notes,
        editModal.favorite.tags
      );
      toast.success('Notes updated');
      setEditModal({ open: false, favorite: null });
      fetchFavorites();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
        <p className="text-gray-600">{favorites.length} saved properties</p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No favorites yet</p>
          <a href="/properties" className="btn btn-primary">
            Browse Properties
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div key={fav._id} className="relative">
              <PropertyCard property={fav.property} />
              
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setEditModal({ open: true, favorite: fav })}
                  className="flex-1 btn btn-secondary text-sm"
                >
                  <FaEdit className="mr-2" /> Notes
                </button>
                <button
                  onClick={() => handleRemove(fav.property._id)}
                  className="flex-1 btn bg-red-50 text-red-600 hover:bg-red-100 text-sm"
                >
                  <FaTrash className="mr-2" /> Remove
                </button>
              </div>

              {fav.notes && (
                <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-700">{fav.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Notes Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, favorite: null })}
        title="Edit Notes"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setEditModal({ open: false, favorite: null })}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateNotes}>Save</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Textarea
            label="Notes"
            value={editModal.favorite?.notes || ''}
            onChange={(e) =>
              setEditModal({
                ...editModal,
                favorite: { ...editModal.favorite, notes: e.target.value },
              })
            }
            rows={4}
            placeholder="Add your notes..."
          />
          <Input
            label="Tags (comma separated)"
            value={editModal.favorite?.tags?.join(', ') || ''}
            onChange={(e) =>
              setEditModal({
                ...editModal,
                favorite: {
                  ...editModal.favorite,
                  tags: e.target.value.split(',').map((t) => t.trim()),
                },
              })
            }
            placeholder="luxury, investment, urgent"
          />
        </div>
      </Modal>
    </div>
  );
};

export default Favorites;