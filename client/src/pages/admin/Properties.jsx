import { useState, useEffect } from 'react';
import { FaSearch, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProperties();
  }, [currentPage, filter]);

  const fetchProperties = async () => {
    try {
      const { data } = await api.get(
        `/admin/properties?page=${currentPage}&status=${
          filter !== 'all' ? filter : ''
        }`
      );
      setProperties(data.properties);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (propertyId) => {
    try {
      await api.put(`/admin/properties/${propertyId}/approve`);
      toast.success('Property approved');
      fetchProperties();
    } catch (error) {
      toast.error('Failed to approve property');
    }
  };

  const handleReject = async (propertyId) => {
    try {
      await api.put(`/admin/properties/${propertyId}/reject`);
      toast.success('Property rejected');
      fetchProperties();
    } catch (error) {
      toast.error('Failed to reject property');
    }
  };

  const handleDelete = async (propertyId) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      await api.delete(`/admin/properties/${propertyId}`);
      toast.success('Property deleted');
      fetchProperties();
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader fullScreen />;

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Property Management</h1>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="space-y-4">
        {filteredProperties.map((property) => (
          <div
            key={property._id}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex gap-6">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-48 h-32 object-cover rounded-lg"
              />

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      {property.title}
                    </h3>
                    <p className="text-gray-600">{property.location}</p>
                  </div>
                  <Badge
                    variant={
                      property.moderationStatus === 'approved'
                        ? 'success'
                        : property.moderationStatus === 'pending'
                        ? 'warning'
                        : 'danger'
                    }
                  >
                    {property.moderationStatus || 'pending'}
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-semibold">
                      ${property.price.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-semibold capitalize">
                      {property.propertyType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Owner</p>
                    <p className="font-semibold">{property.owner?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Views</p>
                    <p className="font-semibold">{property.views || 0}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/properties/${property._id}`}
                    target="_blank"
                    className="btn btn-secondary text-sm"
                  >
                    <FaEye className="mr-2" />
                    View
                  </Link>
                  {property.moderationStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(property._id)}
                        className="btn bg-green-50 text-green-600 hover:bg-green-100 text-sm"
                      >
                        <FaCheck className="mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(property._id)}
                        className="btn bg-red-50 text-red-600 hover:bg-red-100 text-sm"
                      >
                        <FaTimes className="mr-2" />
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(property._id)}
                    className="btn bg-red-50 text-red-600 hover:bg-red-100 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Properties;