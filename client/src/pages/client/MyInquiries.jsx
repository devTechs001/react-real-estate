import { useState, useEffect } from 'react';
import { FaEnvelope, FaClock, FaCheckCircle } from 'react-icons/fa';
import { inquiryService } from '../../services/inquiryService';
import Loader from '../../components/common/Loader';
import Badge from '../../components/ui/Badge';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const MyInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const data = await inquiryService.getMyInquiries();
      setInquiries(data);
    } catch (error) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const filteredInquiries =
    filter === 'all'
      ? inquiries
      : inquiries.filter((i) => i.status === filter);

  const statusConfig = {
    pending: { variant: 'warning', icon: FaClock, label: 'Pending' },
    responded: { variant: 'success', icon: FaCheckCircle, label: 'Responded' },
    closed: { variant: 'gray', icon: FaCheckCircle, label: 'Closed' },
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">My Inquiries</h1>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 border-b">
          {['all', 'pending', 'responded', 'closed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === status
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No inquiries found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => {
            const config = statusConfig[inquiry.status];
            return (
              <div
                key={inquiry._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {inquiry.property.title}
                      </h3>
                      <Badge variant={config.variant}>
                        <config.icon className="mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(inquiry.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <img
                    src={inquiry.property.images[0]}
                    alt={inquiry.property.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Subject:
                    </p>
                    <p className="text-gray-900">{inquiry.subject}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Your Message:
                    </p>
                    <p className="text-gray-600">{inquiry.message}</p>
                  </div>

                  {inquiry.response && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                      <p className="text-sm font-medium text-green-900 mb-1">
                        Response from Seller:
                      </p>
                      <p className="text-green-800">{inquiry.response}</p>
                      <p className="text-xs text-green-600 mt-2">
                        Responded{' '}
                        {formatDistanceToNow(new Date(inquiry.respondedAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>
                      <strong>Contact via:</strong> {inquiry.contactMethod}
                    </span>
                    {inquiry.phone && (
                      <span>
                        <strong>Phone:</strong> {inquiry.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyInquiries;