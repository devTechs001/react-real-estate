import { useState, useEffect } from 'react';
import {
  FaServer,
  FaDatabase,
  FaCog,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSync,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import api from '../../services/api';

const System = () => {
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSystemInfo();
  }, []);

  const fetchSystemInfo = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/system-info');
      setSystemInfo(data);
    } catch (error) {
      toast.error('Failed to load system information');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSystemInfo();
    setRefreshing(false);
    toast.success('System information refreshed');
  };

  const handleClearCache = async () => {
    try {
      await api.post('/admin/clear-cache');
      toast.success('Cache cleared successfully');
    } catch (error) {
      toast.error('Failed to clear cache');
    }
  };

  if (loading) return <Loader fullScreen />;

  const statusCards = [
    {
      icon: FaServer,
      label: 'Server Status',
      value: systemInfo?.serverStatus || 'Running',
      status: 'success',
      color: 'green',
    },
    {
      icon: FaDatabase,
      label: 'Database',
      value: systemInfo?.dbStatus || 'Connected',
      status: 'success',
      color: 'blue',
    },
    {
      icon: FaCog,
      label: 'API Status',
      value: systemInfo?.apiStatus || 'Operational',
      status: 'success',
      color: 'purple',
    },
  ];

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">System Management</h1>
          <p className="text-gray-600">Monitor and manage system health</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn btn-primary"
        >
          <FaSync className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statusCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">{card.label}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
              <card.icon className={`text-4xl text-${card.color}-500`} />
            </div>
            <div className="mt-4 flex items-center text-green-600">
              <FaCheckCircle className="mr-2" />
              <span className="text-sm">Operational</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Server Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">CPU Usage</span>
                <span className="font-semibold">{systemInfo?.cpuUsage || '45'}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${systemInfo?.cpuUsage || 45}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Memory Usage</span>
                <span className="font-semibold">{systemInfo?.memoryUsage || '62'}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${systemInfo?.memoryUsage || 62}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Disk Usage</span>
                <span className="font-semibold">{systemInfo?.diskUsage || '38'}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${systemInfo?.diskUsage || 38}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">System Actions</h3>
          <div className="space-y-3">
            <button onClick={handleClearCache} className="btn btn-outline w-full">
              Clear Cache
            </button>
            <button className="btn btn-outline w-full">Restart Services</button>
            <button className="btn btn-outline w-full">Run Maintenance</button>
            <button className="btn btn-outline w-full">Backup Database</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default System;
