// client/src/pages/admin/AdminSystem.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';

const AdminSystem = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [systemHealth, setSystemHealth] = useState(null);
  const [settings, setSettings] = useState({});
  const [logs, setLogs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSystemHealth({
      status: 'healthy',
      uptime: '15 days, 4 hours, 32 minutes',
      lastRestart: '2024-01-03T08:00:00Z',
      version: '2.1.0',
      environment: 'production',
      services: [
        { name: 'API Server', status: 'running', uptime: '99.99%', responseTime: '45ms' },
        { name: 'Database (MongoDB)', status: 'running', uptime: '99.95%', connections: 24 },
        { name: 'Redis Cache', status: 'running', uptime: '99.99%', hitRate: '94.5%' },
        { name: 'Socket.IO', status: 'running', uptime: '99.90%', connections: 156 },
        { name: 'Email Service', status: 'running', uptime: '99.80%', queue: 3 },
        { name: 'AI Services', status: 'running', uptime: '99.50%', load: '23%' },
        { name: 'File Storage', status: 'running', uptime: '100%', used: '45.2 GB' }
      ],
      resources: {
        cpu: 34,
        memory: 62,
        disk: 45,
        bandwidth: 28
      },
      metrics: {
        requestsPerMinute: 1250,
        averageResponseTime: 145,
        errorRate: 0.02,
        activeUsers: 342
      }
    });

    setSettings({
      general: {
        siteName: 'RealEstate Pro',
        siteUrl: 'https://realestatepro.com',
        contactEmail: 'support@realestatepro.com',
        timezone: 'America/New_York',
        currency: 'USD',
        language: 'en'
      },
      features: {
        userRegistration: true,
        emailVerification: true,
        twoFactorAuth: true,
        socialLogin: true,
        guestCheckout: false,
        maintenanceMode: false
      },
      limits: {
        maxFileSize: 10,
        maxImagesPerProperty: 20,
        maxPropertiesPerUser: 50,
        maxInquiriesPerDay: 20,
        sessionTimeout: 24
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        marketingEmails: true
      },
      security: {
        passwordMinLength: 8,
        requireSpecialChar: true,
        maxLoginAttempts: 5,
        lockoutDuration: 30,
        ipWhitelist: ''
      },
      api: {
        rateLimit: 100,
        rateLimitWindow: 15,
        enableCors: true,
        allowedOrigins: '*'
      }
    });

    setLogs([
      { id: 1, level: 'info', message: 'User john@example.com logged in', timestamp: '2024-01-18T15:45:00Z', source: 'auth' },
      { id: 2, level: 'warning', message: 'High memory usage detected (85%)', timestamp: '2024-01-18T15:30:00Z', source: 'system' },
      { id: 3, level: 'error', message: 'Failed to send email to user@example.com', timestamp: '2024-01-18T15:15:00Z', source: 'email' },
      { id: 4, level: 'info', message: 'Property #1234 created by seller@example.com', timestamp: '2024-01-18T15:00:00Z', source: 'property' },
      { id: 5, level: 'info', message: 'Backup completed successfully', timestamp: '2024-01-18T14:00:00Z', source: 'backup' },
      { id: 6, level: 'warning', message: 'Rate limit exceeded for IP 192.168.1.1', timestamp: '2024-01-18T13:45:00Z', source: 'security' },
      { id: 7, level: 'info', message: 'Cache cleared successfully', timestamp: '2024-01-18T12:00:00Z', source: 'cache' },
      { id: 8, level: 'error', message: 'Database connection timeout', timestamp: '2024-01-18T11:30:00Z', source: 'database' }
    ]);

    setJobs([
      { id: 1, name: 'Email Queue Processor', status: 'running', lastRun: '2024-01-18T15:45:00Z', nextRun: '2024-01-18T15:46:00Z', frequency: 'Every minute' },
      { id: 2, name: 'Database Backup', status: 'scheduled', lastRun: '2024-01-18T06:00:00Z', nextRun: '2024-01-19T06:00:00Z', frequency: 'Daily' },
      { id: 3, name: 'Analytics Aggregation', status: 'running', lastRun: '2024-01-18T15:00:00Z', nextRun: '2024-01-18T16:00:00Z', frequency: 'Hourly' },
      { id: 4, name: 'Session Cleanup', status: 'scheduled', lastRun: '2024-01-18T00:00:00Z', nextRun: '2024-01-19T00:00:00Z', frequency: 'Daily' },
      { id: 5, name: 'Property Index Refresh', status: 'scheduled', lastRun: '2024-01-18T12:00:00Z', nextRun: '2024-01-18T18:00:00Z', frequency: 'Every 6 hours' },
      { id: 6, name: 'Expired Listings Cleanup', status: 'scheduled', lastRun: '2024-01-17T00:00:00Z', nextRun: '2024-01-18T00:00:00Z', frequency: 'Daily' }
    ]);

    setLoading(false);
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const saveSettings = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success('Settings saved successfully');
  };

  const runJob = async (jobId) => {
    toast.loading('Running job...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.dismiss();
    toast.success('Job executed successfully');
    
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, lastRun: new Date().toISOString(), status: 'running' }
        : job
    ));
  };

  const clearCache = async () => {
    toast.loading('Clearing cache...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.dismiss();
    toast.success('Cache cleared successfully');
  };

  const restartService = async (serviceName) => {
    toast.loading(`Restarting ${serviceName}...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.dismiss();
    toast.success(`${serviceName} restarted successfully`);
  };

  const getLogLevelBadge = (level) => {
    const styles = {
      info: 'bg-blue-500/20 text-blue-400',
      warning: 'bg-yellow-500/20 text-yellow-400',
      error: 'bg-red-500/20 text-red-400',
      debug: 'bg-gray-500/20 text-gray-400'
    };
    return styles[level] || styles.info;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-green-400';
      case 'scheduled': return 'text-blue-400';
      case 'failed': return 'text-red-400';
      case 'paused': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'jobs', label: 'Jobs', icon: '🔄' },
    { id: 'logs', label: 'Logs', icon: '📋' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' }
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-700 rounded w-1/4" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-800 rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-slate-800 rounded-xl" />
      </div>
    );
  }

  return (
    <>
      <SEO title="System - Admin Dashboard" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">System Management</h1>
          <p className="text-slate-400">Monitor and configure system settings</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
            systemHealth?.status === 'healthy' 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              systemHealth?.status === 'healthy' ? 'bg-green-400' : 'bg-red-400'
            } animate-pulse`} />
            System {systemHealth?.status === 'healthy' ? 'Healthy' : 'Issues Detected'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Resource Usage */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'CPU Usage', value: systemHealth.resources.cpu, color: 'blue' },
              { label: 'Memory', value: systemHealth.resources.memory, color: 'purple' },
              { label: 'Disk', value: systemHealth.resources.disk, color: 'green' },
              { label: 'Bandwidth', value: systemHealth.resources.bandwidth, color: 'orange' }
            ].map((resource, index) => (
              <motion.div
                key={resource.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">{resource.label}</span>
                  <span className="text-white font-bold">{resource.value}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${resource.value}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full bg-${resource.color}-500 rounded-full`}
                    style={{ 
                      backgroundColor: resource.color === 'blue' ? '#3b82f6' :
                                       resource.color === 'purple' ? '#a855f7' :
                                       resource.color === 'green' ? '#22c55e' : '#f97316'
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-slate-400 text-sm">Requests/min</p>
              <p className="text-2xl font-bold text-white">{systemHealth.metrics.requestsPerMinute.toLocaleString()}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-slate-400 text-sm">Avg Response Time</p>
              <p className="text-2xl font-bold text-white">{systemHealth.metrics.averageResponseTime}ms</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-slate-400 text-sm">Error Rate</p>
              <p className="text-2xl font-bold text-green-400">{systemHealth.metrics.errorRate}%</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-slate-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">{systemHealth.metrics.activeUsers}</p>
            </div>
          </div>

          {/* Services Status */}
          <div className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Services Status</h2>
            <div className="space-y-3">
              {systemHealth.services.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${
                      service.status === 'running' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="text-white font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-slate-400">
                      Uptime: <span className="text-green-400">{service.uptime}</span>
                    </span>
                    {service.responseTime && (
                      <span className="text-slate-400">
                        Response: <span className="text-blue-400">{service.responseTime}</span>
                      </span>
                    )}
                    {service.connections !== undefined && (
                      <span className="text-slate-400">
                        Connections: <span className="text-purple-400">{service.connections}</span>
                      </span>
                    )}
                    {service.hitRate && (
                      <span className="text-slate-400">
                        Hit Rate: <span className="text-yellow-400">{service.hitRate}</span>
                      </span>
                    )}
                    <button
                      onClick={() => restartService(service.name)}
                      className="px-3 py-1 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
                    >
                      Restart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* System Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">System Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Version</span>
                  <span className="text-white">{systemHealth.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Environment</span>
                  <span className="text-green-400 capitalize">{systemHealth.environment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Uptime</span>
                  <span className="text-white">{systemHealth.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Restart</span>
                  <span className="text-white">{new Date(systemHealth.lastRestart).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={clearCache}
                  className="p-3 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors text-sm font-medium"
                >
                  🗑️ Clear Cache
                </button>
                <button
                  onClick={() => toast.success('Backup started')}
                  className="p-3 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-colors text-sm font-medium"
                >
                  💾 Run Backup
                </button>
                <button
                  onClick={() => toast.success('Index refreshed')}
                  className="p-3 bg-purple-500/20 text-purple-400 rounded-xl hover:bg-purple-500/30 transition-colors text-sm font-medium"
                >
                  🔄 Refresh Index
                </button>
                <button
                  onClick={() => toast.success('Health check completed')}
                  className="p-3 bg-yellow-500/20 text-yellow-400 rounded-xl hover:bg-yellow-500/30 transition-colors text-sm font-medium"
                >
                  🏥 Health Check
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">General Settings</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Site Name</label>
                <input
                  type="text"
                  value={settings.general.siteName}
                  onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Site URL</label>
                <input
                  type="text"
                  value={settings.general.siteUrl}
                  onChange={(e) => updateSetting('general', 'siteUrl', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={settings.general.contactEmail}
                  onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Timezone</label>
                <select
                  value={settings.general.timezone}
                  onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Feature Toggles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(settings.features).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                  <span className="text-white capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <button
                    onClick={() => updateSetting('features', key, !value)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      value ? 'bg-blue-600' : 'bg-slate-600'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      value ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Limits */}
          <div className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Limits & Restrictions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Max File Size (MB)</label>
                <input
                  type="number"
                  value={settings.limits.maxFileSize}
                  onChange={(e) => updateSetting('limits', 'maxFileSize', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Max Images per Property</label>
                <input
                  type="number"
                  value={settings.limits.maxImagesPerProperty}
                  onChange={(e) => updateSetting('limits', 'maxImagesPerProperty', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Max Properties per User</label>
                <input
                  type="number"
                  value={settings.limits.maxPropertiesPerUser}
                  onChange={(e) => updateSetting('limits', 'maxPropertiesPerUser', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Max Inquiries per Day</label>
                <input
                  type="number"
                  value={settings.limits.maxInquiriesPerDay}
                  onChange={(e) => updateSetting('limits', 'maxInquiriesPerDay', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Session Timeout (hours)</label>
                <input
                  type="number"
                  value={settings.limits.sessionTimeout}
                  onChange={(e) => updateSetting('limits', 'sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Security Settings</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Min Password Length</label>
                <input
                  type="number"
                  value={settings.security.passwordMinLength}
                  onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Max Login Attempts</label>
                <input
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Lockout Duration (min)</label>
                <input
                  type="number"
                  value={settings.security.lockoutDuration}
                  onChange={(e) => updateSetting('security', 'lockoutDuration', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                <span className="text-white">Require Special Characters</span>
                <button
                  onClick={() => updateSetting('security', 'requireSpecialChar', !settings.security.requireSpecialChar)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.security.requireSpecialChar ? 'bg-blue-600' : 'bg-slate-600'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.security.requireSpecialChar ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save All Settings'}
            </button>
          </div>
        </div>
      )}

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div className="bg-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Scheduled Jobs</h2>
            <button
              onClick={() => toast.success('All jobs refreshed')}
              className="px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
            >
              Refresh
            </button>
          </div>
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <span className={`w-3 h-3 rounded-full ${
                    job.status === 'running' ? 'bg-green-500 animate-pulse' : 'bg-slate-500'
                  }`} />
                  <div>
                    <p className="text-white font-medium">{job.name}</p>
                    <p className="text-slate-400 text-sm">{job.frequency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="text-slate-400">Last Run</p>
                    <p className="text-white">{new Date(job.lastRun).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400">Next Run</p>
                    <p className="text-white">{new Date(job.nextRun).toLocaleString()}</p>
                  </div>
                  <span className={`capitalize ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                  <button
                    onClick={() => runJob(job.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Run Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">System Logs</h2>
            <div className="flex gap-2">
              <select className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none">
                <option value="all">All Levels</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
              <button
                onClick={() => toast.success('Logs exported')}
                className="px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
              >
                Export
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {logs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-start gap-4 p-3 bg-slate-700/50 rounded-lg font-mono text-sm"
              >
                <span className="text-slate-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs uppercase ${getLogLevelBadge(log.level)}`}>
                  {log.level}
                </span>
                <span className="text-slate-400">[{log.source}]</span>
                <span className="text-white flex-1">{log.message}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Maintenance Tab */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">⚠️</span>
              <h2 className="text-lg font-semibold text-yellow-400">Maintenance Mode</h2>
            </div>
            <p className="text-slate-300 mb-4">
              Enable maintenance mode to prevent users from accessing the site while you perform updates.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  updateSetting('features', 'maintenanceMode', !settings.features.maintenanceMode);
                  toast.success(settings.features.maintenanceMode ? 'Maintenance mode disabled' : 'Maintenance mode enabled');
                }}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  settings.features.maintenanceMode
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                }`}
              >
                {settings.features.maintenanceMode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
              </button>
              {settings.features.maintenanceMode && (
                <span className="text-yellow-400 animate-pulse">⚡ Maintenance mode is ACTIVE</span>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Database Operations</h2>
              <div className="space-y-3">
                <button
                  onClick={() => toast.success('Database optimized')}
                  className="w-full p-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors text-left"
                >
                  <span className="font-medium">Optimize Database</span>
                  <p className="text-slate-400 text-sm">Clean up and optimize database tables</p>
                </button>
                <button
                  onClick={() => toast.success('Backup created')}
                  className="w-full p-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors text-left"
                >
                  <span className="font-medium">Create Backup</span>
                  <p className="text-slate-400 text-sm">Create a full database backup</p>
                </button>
                <button
                  onClick={() => toast.success('Indexes rebuilt')}
                  className="w-full p-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors text-left"
                >
                  <span className="font-medium">Rebuild Indexes</span>
                  <p className="text-slate-400 text-sm">Rebuild search and database indexes</p>
                </button>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Cache Operations</h2>
              <div className="space-y-3">
                <button
                  onClick={() => toast.success('All caches cleared')}
                  className="w-full p-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors text-left"
                >
                  <span className="font-medium">Clear All Cache</span>
                  <p className="text-slate-400 text-sm">Clear Redis and application cache</p>
                </button>
                <button
                  onClick={() => toast.success('Page cache cleared')}
                  className="w-full p-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors text-left"
                >
                  <span className="font-medium">Clear Page Cache</span>
                  <p className="text-slate-400 text-sm">Clear cached pages and views</p>
                </button>
                <button
                  onClick={() => toast.success('API cache cleared')}
                  className="w-full p-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors text-left"
                >
                  <span className="font-medium">Clear API Cache</span>
                  <p className="text-slate-400 text-sm">Clear cached API responses</p>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-red-400 mb-4">⚠️ Danger Zone</h2>
            <div className="space-y-3">
              <button
                onClick={() => toast.error('This action requires confirmation')}
                className="w-full p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors text-left"
              >
                <span className="font-medium">Reset All Statistics</span>
                <p className="text-red-300/70 text-sm">Clear all analytics and statistics data</p>
              </button>
              <button
                onClick={() => toast.error('This action requires confirmation')}
                className="w-full p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors text-left"
              >
                <span className="font-medium">Purge Inactive Users</span>
                <p className="text-red-300/70 text-sm">Remove users inactive for more than 1 year</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSystem;