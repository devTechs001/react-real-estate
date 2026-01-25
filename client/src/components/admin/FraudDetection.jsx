import { useState, useEffect } from 'react';
import { FaShieldAlt, FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';

const FraudDetection = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchFraudAlerts();
  }, [filter]);

  const fetchFraudAlerts = async () => {
    try {
      const { data } = await api.get(`/admin/fraud-alerts?status=${filter}`);
      setAlerts(data);
    } catch (error) {
      toast.error('Failed to load fraud alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await api.put(`/admin/fraud-alerts/${alertId}`, { status: 'resolved' });
      setAlerts(alerts.map(a => a._id === alertId ? { ...a, status: 'resolved' } : a));
      toast.success('Alert marked as resolved');
    } catch (error) {
      toast.error('Failed to resolve alert');
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-900 text-red-200';
      case 'medium': return 'bg-yellow-900 text-yellow-200';
      case 'low': return 'bg-green-900 text-green-200';
      default: return 'bg-gray-700 text-gray-200';
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-6">
        <FaShieldAlt className="text-red-400 text-2xl" />
        <h2 className="text-2xl font-bold">Fraud Detection</h2>
      </div>

      <div className="mb-6 flex gap-2">
        {['all', 'pending', 'resolved', 'false-positive'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded ${
              filter === status
                ? 'bg-red-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No fraud alerts found
          </div>
        ) : (
          alerts.map(alert => (
            <div
              key={alert._id}
              className="bg-gray-800 p-4 rounded-lg border-l-4 border-red-600"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{alert.type}</h3>
                  <p className="text-gray-400 text-sm mt-1">{alert.description}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-semibold ${getRiskColor(alert.riskLevel)}`}>
                  {alert.riskLevel.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-400">User:</span>
                  <p className="font-semibold">{alert.userId?.name || 'Unknown'}</p>
                </div>
                <div>
                  <span className="text-gray-400">Date:</span>
                  <p className="font-semibold">{new Date(alert.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleResolveAlert(alert._id)}
                  className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                >
                  <FaCheckCircle />
                  Resolve
                </button>
                <button className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">
                  <FaExclamationCircle />
                  Review
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FraudDetection;
