import { useState, useEffect } from 'react';
import { FaHome, FaCheck, FaTimes, FaHourglassHalf } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';

const PropertyModeration = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchProperties();
  }, [filter]);

  const fetchProperties = async () => {
    try {
      const { data } = await api.get(`/admin/properties?status=${filter}`);
      setProperties(data);
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (propertyId) => {
    try {
      await api.put(`/admin/properties/${propertyId}`, { status: 'approved' });
      setProperties(properties.filter(p => p._id !== propertyId));
      toast.success('Property approved');
    } catch (error) {
      toast.error('Failed to approve property');
    }
  };

  const handleReject = async (propertyId, reason) => {
    const rejectionReason = prompt('Enter rejection reason:');
    if (!rejectionReason) return;

    try {
      await api.put(`/admin/properties/${propertyId}`, {
        status: 'rejected',
        rejectionReason
      });
      setProperties(properties.filter(p => p._id !== propertyId));
      toast.success('Property rejected');
    } catch (error) {
      toast.error('Failed to reject property');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-6">
        <FaHome className="text-blue-400 text-2xl" />
        <h2 className="text-2xl font-bold">Property Moderation</h2>
      </div>

      <div className="mb-6 flex gap-2">
        {['pending', 'approved', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => {
              setFilter(status);
              setLoading(true);
            }}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              filter === status
                ? 'bg-blue-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {status === 'pending' && <FaHourglassHalf />}
            {status === 'approved' && <FaCheck />}
            {status === 'rejected' && <FaTimes />}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {properties.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-400">
            No properties to moderate
          </div>
        ) : (
          properties.map(property => (
            <div key={property._id} className="bg-gray-800 rounded-lg overflow-hidden">
              {property.images?.[0] && (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{property.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{property.location}</p>
                <div className="flex gap-2 text-sm mb-4">
                  <span className="bg-gray-700 px-2 py-1 rounded">${property.price?.toLocaleString()}</span>
                  <span className="bg-gray-700 px-2 py-1 rounded">{property.beds} beds</span>
                  <span className="bg-gray-700 px-2 py-1 rounded">{property.baths} baths</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(property._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 py-2 rounded"
                  >
                    <FaCheck /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(property._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-2 rounded"
                  >
                    <FaTimes /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PropertyModeration;
