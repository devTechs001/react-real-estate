import { useState, useEffect } from 'react';
import { FaFlag, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import api from '../../services/api';
import Loader from '../common/Loader';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const ReportsManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedReport, setSelectedReport] = useState(null);
  const [resolution, setResolution] = useState('');

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    try {
      const { data } = await api.get(`/admin/reports?status=${filter}`);
      setReports(data);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId, action) => {
    try {
      await api.put(`/admin/reports/${reportId}/resolve`, {
        action,
        resolution,
      });
      toast.success('Report resolved');
      setSelectedReport(null);
      setResolution('');
      fetchReports();
    } catch (error) {
      toast.error('Failed to resolve report');
    }
  };

  const statusConfig = {
    pending: { variant: 'warning', label: 'Pending' },
    reviewing: { variant: 'info', label: 'Reviewing' },
    resolved: { variant: 'success', label: 'Resolved' },
    rejected: { variant: 'danger', label: 'Rejected' },
  };

  const reasonConfig = {
    spam: { label: 'Spam', color: 'bg-red-100 text-red-700' },
    fraud: { label: 'Fraud', color: 'bg-orange-100 text-orange-700' },
    inappropriate: { label: 'Inappropriate', color: 'bg-yellow-100 text-yellow-700' },
    misleading: { label: 'Misleading', color: 'bg-purple-100 text-purple-700' },
    duplicate: { label: 'Duplicate', color: 'bg-blue-100 text-blue-700' },
    other: { label: 'Other', color: 'bg-gray-100 text-gray-700' },
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Reports Management</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b">
          {['pending', 'reviewing', 'resolved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 font-medium transition-colors capitalize ${
                filter === status
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {status}
              {status === 'pending' &&
                reports.filter((r) => r.status === 'pending').length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {reports.filter((r) => r.status === 'pending').length}
                  </span>
                )}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FaFlag className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No reports found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const config = statusConfig[report.status];
            const reasonConf = reasonConfig[report.reason];

            return (
              <div
                key={report._id}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {report.itemType} Report
                      </h3>
                      <Badge variant={config.variant}>{config.label}</Badge>
                      <span className={`px-3 py-1 rounded-full text-sm ${reasonConf.color}`}>
                        {reasonConf.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Reported by: {report.reporter.name} ({report.reporter.email})
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-medium mb-2">Description:</p>
                  <p className="text-gray-700">{report.description}</p>
                </div>

                {report.resolution && (
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <p className="font-medium text-green-900 mb-2">Resolution:</p>
                    <p className="text-green-800">{report.resolution}</p>
                    <p className="text-xs text-green-600 mt-2">
                      Resolved by {report.resolvedBy?.name} on{' '}
                      {new Date(report.resolvedAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {report.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="btn btn-secondary"
                    >
                      <FaEye className="mr-2" />
                      Review
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Resolution Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title="Resolve Report"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setSelectedReport(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleResolve(selectedReport._id, 'reject')}
              className="bg-red-600 hover:bg-red-700"
            >
              <FaTimes className="mr-2" />
              Reject Report
            </Button>
            <Button onClick={() => handleResolve(selectedReport._id, 'approve')}>
              <FaCheck className="mr-2" />
              Take Action
            </Button>
          </div>
        }
      >
        {selectedReport && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium mb-2">Report Details:</p>
              <p className="text-sm">
                <strong>Type:</strong> {selectedReport.itemType}
              </p>
              <p className="text-sm">
                <strong>Reason:</strong> {selectedReport.reason}
              </p>
              <p className="text-sm mt-2">{selectedReport.description}</p>
            </div>

            <Textarea
              label="Resolution Notes"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={4}
              placeholder="Explain the action taken..."
              required
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReportsManagement;