import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { propertyService } from '../../services/propertyService';
import Loader from '../../components/common/Loader';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/formatters';

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const data = await propertyService.getUserProperties();
      setProperties(data);
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await propertyService.deleteProperty(deleteModal.id);
      setProperties(properties.filter((p) => p._id !== deleteModal.id));
      toast.success('Property deleted');
      setDeleteModal({ open: false, id: null });
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'available' ? 'sold' : 'available';
    try {
      await propertyService.updateProperty(id, { status: newStatus });
      setProperties(
        properties.map((p) =>
          p._id === id ? { ...p, status: newStatus } : p
        )
      );
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Properties</h1>
          <p className="text-gray-600">{properties.length} total listings</p>
        </div>
        <Link to="/add-property" className="btn btn-primary">
          <FaPlus className="mr-2" />
          Add Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FaPlus className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No properties yet</p>
          <Link to="/add-property" className="btn btn-primary">
            Add Your First Property
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex gap-6">
                  {/* Image */}
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-48 h-32 object-cover rounded-lg"
                  />

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {property.title}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {property.location}
                        </p>
                      </div>
                      <Badge
                        variant={
                          property.status === 'available'
                            ? 'success'
                            : property.status === 'pending'
                            ? 'warning'
                            : 'gray'
                        }
                      >
                        {property.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="font-semibold">
                          {formatPrice(property.price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Views</p>
                        <p className="font-semibold">{property.views || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="font-semibold capitalize">
                          {property.propertyType}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Beds/Baths</p>
                        <p className="font-semibold">
                          {property.bedrooms}/{property.bathrooms}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        to={`/properties/${property._id}`}
                        className="btn btn-secondary text-sm"
                        target="_blank"
                      >
                        <FaEye className="mr-2" />
                        View
                      </Link>
                      <Link
                        to={`/edit-property/${property._id}`}
                        className="btn btn-secondary text-sm"
                      >
                        <FaEdit className="mr-2" />
                        Edit
                      </Link>
                      <button
                        onClick={() =>
                          handleToggleStatus(property._id, property.status)
                        }
                        className="btn btn-secondary text-sm"
                      >
                        {property.status === 'available' ? (
                          <>
                            <FaToggleOff className="mr-2" />
                            Mark as Sold
                          </>
                        ) : (
                          <>
                            <FaToggleOn className="mr-2" />
                            Mark Available
                          </>
                        )}
                      </button>
                      <button
                        onClick={() =>
                          setDeleteModal({ open: true, id: property._id })
                        }
                        className="btn bg-red-50 text-red-600 hover:bg-red-100 text-sm"
                      >
                        <FaTrash className="mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Property"
        message="Are you sure you want to delete this property? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default ManageProperties;