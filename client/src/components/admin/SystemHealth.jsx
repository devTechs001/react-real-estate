import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';

const SystemHealth = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemHealth();
  }, []);

  const fetchSystemHealth = async () => {
    try {
      const data = await dashboardService.getSystemHealth();
      setHealthData(data);
    } catch (error) {
      console.error('Error fetching system health:', error);
      toast.error('Failed to load system health data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (!healthData) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">System Health</h2>
        <p className="text-gray-500">Unable to fetch system health data</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">System Health</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-gray-700">Status</h3>
          <p className={`text-lg font-semibold ${healthData.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
            {healthData.status}
          </p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-gray-700">Uptime</h3>
          <p className="text-lg font-semibold">
            {Math.round(healthData.uptime)} seconds
          </p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-gray-700">Timestamp</h3>
          <p className="text-lg font-semibold">
            {new Date(healthData.timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Memory Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(healthData.memory).map(([key, value]) => (
            <div key={key} className="border rounded-lg p-3">
              <p className="text-sm text-gray-600 capitalize">{key}</p>
              <p className="font-medium">{typeof value === 'number' ? value.toLocaleString() : value}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-700 mb-2">Additional Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-3">
            <p className="text-sm text-gray-600">CPU Usage</p>
            <p className="font-medium">{healthData.cpu}</p>
          </div>
          <div className="border rounded-lg p-3">
            <p className="text-sm text-gray-600">DB Connection</p>
            <p className="font-medium">{healthData.dbConnection}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;