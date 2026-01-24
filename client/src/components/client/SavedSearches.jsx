import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaTrash, FaBell } from 'react-icons/fa';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const SavedSearches = () => {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved searches from localStorage or API
    const saved = JSON.parse(localStorage.getItem('savedSearches') || '[]');
    setSearches(saved);
    setLoading(false);
  }, []);

  const handleDelete = (id) => {
    if (!confirm('Delete this saved search?')) return;

    const updated = searches.filter((s) => s.id !== id);
    setSearches(updated);
    localStorage.setItem('savedSearches', JSON.stringify(updated));
  };

  const toggleNotifications = (id) => {
    const updated = searches.map((s) =>
      s.id === id ? { ...s, notifications: !s.notifications } : s
    );
    setSearches(updated);
    localStorage.setItem('savedSearches', JSON.stringify(updated));
  };

  if (loading) return <div>Loading...</div>;

  if (searches.length === 0) {
    return (
      <Card className="text-center py-12">
        <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">No saved searches yet</p>
        <Link to="/properties" className="btn btn-primary inline-block">
          Start Searching
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {searches.map((search) => (
        <Card key={search.id} hover className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{search.name}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {search.location && (
                <Badge variant="info">📍 {search.location}</Badge>
              )}
              {search.propertyType && (
                <Badge variant="primary">{search.propertyType}</Badge>
              )}
              {search.priceRange && (
                <Badge variant="success">{search.priceRange}</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">
              Saved {new Date(search.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleNotifications(search.id)}
              className={`p-2 rounded-lg transition-colors ${
                search.notifications
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={search.notifications ? 'Notifications ON' : 'Notifications OFF'}
            >
              <FaBell />
            </button>

            <Link
              to={`/properties?${new URLSearchParams(search.filters).toString()}`}
              className="btn btn-outline btn-sm"
            >
              View Results
            </Link>

            <button
              onClick={() => handleDelete(search.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FaTrash />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SavedSearches;
