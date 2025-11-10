import { useState, useEffect } from 'react';
import { FaEnvelope, FaReply, FaClock } from 'react-icons/fa';
import { inquiryService } from '../../services/inquiryService';
import Loader from '../../components/common/Loader';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const ManageInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [replyModal, setReplyModal] = useState({ open: false, inquiry: null });
  const [response, setResponse] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, [filter === 'all' ? '' : filter]);

  const fetchInquiries = async () => {
    try {
      const status = filter === 'all' ? '' : filter;
      const data = await inquiryService.getReceivedInquiries(status);
      setInquiries(data);
    } catch (error) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    try {
      await inquiryService.respondToInquiry(replyModal.inquiry._id, response);
      toast.success('Response sent');
      setReplyModal({ open: false, inquiry: null });
      setResponse('');
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to send response');
    }
  };

  const statusConfig = {
    pending: { variant: 'warning', label: 'Pending' },
    responded: { variant: 'success', label: 'Responded' },
    closed: { variant: 'gray', label: 'Closed' },
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Manage Inquiries</h1>

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
              {status === 'pending' && inquiries.filter((i) => i.status === 'pending').length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {inquiries.filter((i) => i.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No inquiries found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => {
            const config = statusConfig[inquiry.status];
            return (
              <div
                key={inquiry._id}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {inquiry.property.title}
                      </h3>
                      <Badge variant={config.variant}>{config.label}</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>From: {inquiry.client.name}</p>
                      <p>Email: {inquiry.client.email}</p>
                      {inquiry.phone && <p>Phone: {inquiry.phone}</p>}
                      <p>
                        {formatDistanceToNow(new Date(inquiry.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
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
                      Message:
                    </p>
                    <p className="text-gray-600">{inquiry.message}</p>
                  </div>

                  {inquiry.response && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                      <p className="text-sm font-medium text-green-900 mb-1">
                        Your Response:
                      </p>
                      <p className="text-green-800">{inquiry.response}</p>
                    </div>
                  )}
                </div>

                {inquiry.status === 'pending' && (
                  <div className="mt-4 pt-4 border-t">
                    <button
                      onClick={() =>
                        setReplyModal({ open: true, inquiry: inquiry })
                      }
                      className="btn btn-primary"
                    >
                      <FaReply className="mr-2" />
                      Send Response
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reply Modal */}
      <Modal
        isOpen={replyModal.open}
        onClose={() => setReplyModal({ open: false, inquiry: null })}
        title="Send Response"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setReplyModal({ open: false, inquiry: null })}
            >
              Cancel
            </Button>
            <Button onClick={handleReply}>Send Response</Button>
          </div>
        }
      >
        {replyModal.inquiry && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Client Message:</p>
              <p className="text-gray-900">{replyModal.inquiry.message}</p>
            </div>
            <Textarea
              label="Your Response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={6}
              placeholder="Type your response..."
              required
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageInquiries;