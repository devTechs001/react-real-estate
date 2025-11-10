import { useState, useEffect } from 'react';
import {
  FaServer,
  FaDatabase,
  FaMemory,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import api from '../../services/api';
import Loader from '../common/Loader';

const SystemAnalytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemMetrics();
    const interval = setInterval(fetchSystemMetrics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchSystemMetrics = async () => {
    try {
      const { data } = await api.get('/admin/system-metrics');
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  const systemCards = [
    {
      icon: FaServer,
      label: 'Server Status',
      value: metrics.serverStatus,
      status: metrics.serverStatus === 'healthy' ? 'success' : 'error',
    },
    {
      icon: FaDatabase,
      label: 'Database',
      value: `${metrics.dbSize} MB`,
      status: 'success',
    },
    {
      icon: FaMemory,
      label: 'Memory Usage',
      value: `${metrics.memoryUsage}%`,
      status: metrics.memoryUsage > 80 ? 'warning' : 'success',
    },
    {
      icon: FaClock,
      label: 'Uptime',
      value: metrics.uptime,
      status: 'success',
    },
  ];

  const performanceData = {
    labels: metrics.performanceHistory.map((d) => d.time),
    datasets: [
      {
        label: 'Response Time (ms)',
        data: metrics.performanceHistory.map((d) => d.responseTime),
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">System Analytics</h1>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {systemCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <card.icon className="text-3xl text-primary-600" />
              {card.status === 'success' ? (
                <FaCheckCircle className="text-green-600 text-xl" />
              ) : card.status === 'error' ? (
                <FaTimesCircle className="text-red-600 text-xl" />
              ) : (
                <FaTimesCircle className="text-yellow-600 text-xl" />
              )}
            </div>
            <p className="text-gray-600 text-sm mb-1">{card.label}</p>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
        <div className="h-64">
          <Line
            data={performanceData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            }}
          />
        </div>
      </div>

      {/* API Endpoints */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">API Endpoints Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">Endpoint</th>
                <th className="text-right py-3 px-4">Requests</th>
                <th className="text-right py-3 px-4">Avg Response</th>
                <th className="text-right py-3 px-4">Error Rate</th>
                <th className="text-right py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics.apiEndpoints.map((endpoint, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4 font-mono text-sm">{endpoint.path}</td>
                  <td className="text-right py-3 px-4">{endpoint.requests}</td>
                  <td className="text-right py-3 px-4">{endpoint.avgResponse}ms</td>
                  <td className="text-right py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        endpoint.errorRate > 5
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {endpoint.errorRate}%
                    </span>
                  </td>
                  <td className="text-right py-3 px-4">
                    {endpoint.status === 'healthy' ? (
                      <FaCheckCircle className="inline text-green-600" />
                    ) : (
                      <FaTimesCircle className="inline text-red-600" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Error Logs */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Errors</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {metrics.recentErrors.map((error, index) => (
            <div
              key={index}
              className="p-4 bg-red-50 border-l-4 border-red-500 rounded"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="font-medium text-red-900">{error.message}</p>
                <span className="text-xs text-red-600">
                  {new Date(error.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-red-700 font-mono">{error.stack}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemAnalytics;