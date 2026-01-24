import { useState, useEffect } from 'react';
import { FaEnvelope, FaReply } from 'react-icons/fa';
import { inquiryService } from '../../services/InquiryService';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Loader from '../common/Loader';
import { formatDistanceToNow } from 'date-fns';

const InquiriesList = ({ limit }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const data = await inquiryService.getMyInquiries();
      setInquiries(limit ? data.slice(0, limit) : data);
    } catch (error) {
      console.error('Failed to load inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      responded: 'success',
      closed: 'gray',
    };
    return <Badge variant={variants[status] || 'info'}>{status}</Badge>;
  };

  if (loading) return <Loader />;

  if (inquiries.length === 0) {
    return (
      <Card className="text-center py-12">
        <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">No inquiries yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {inquiries.map((inquiry) => (
        <Card key={inquiry._id} hover>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">
                  {inquiry.property?.title || 'Property Inquiry'}
                </h3>
                {getStatusBadge(inquiry.status)}
              </div>

              <p className="text-sm text-gray-600 mb-2">
                Sent {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-3">
            <p className="text-sm text-gray-700">{inquiry.message}</p>
          </div>

          {inquiry.response && (
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <FaReply className="text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">Response</span>
              </div>
              <p className="text-sm text-gray-700">{inquiry.response}</p>
              <p className="text-xs text-gray-500 mt-2">
                {formatDistanceToNow(new Date(inquiry.respondedAt), { addSuffix: true })}
              </p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default InquiriesList;
