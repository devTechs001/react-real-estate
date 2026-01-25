import { useState, useEffect } from 'react';
import { FaSave, FaBell, FaLock, FaServer, FaDatabase } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
    maxUploadSize: 50,
    sessionTimeout: 30,
    twoFactorAuth: false,
    allowPublicListings: true,
    apiRateLimit: 1000,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/admin/settings');
      setSettings(data);
    } catch (error) {
      // Use default settings if fetch fails
      console.log('Using default settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await api.put('/admin/settings', settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNumberChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: parseInt(value) || 0
    }));
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">System Settings</h2>

      <div className="space-y-6">
        {/* Server Settings */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <FaServer className="text-blue-400" />
            <h3 className="text-lg font-semibold">Server Configuration</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={() => handleToggle('maintenanceMode')}
                  className="w-4 h-4"
                />
                <span>Maintenance Mode</span>
              </label>
              <span className={`text-sm ${settings.maintenanceMode ? 'text-orange-400' : 'text-green-400'}`}>
                {settings.maintenanceMode ? 'Enabled' : 'Disabled'}
              </span>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <label className="block mb-2">Max Upload Size (MB)</label>
              <input
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) => handleNumberChange('maxUploadSize', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              />
            </div>

            <div className="border-t border-gray-700 pt-4">
              <label className="block mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleNumberChange('sessionTimeout', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              />
            </div>

            <div className="border-t border-gray-700 pt-4">
              <label className="block mb-2">API Rate Limit (requests/hour)</label>
              <input
                type="number"
                value={settings.apiRateLimit}
                onChange={(e) => handleNumberChange('apiRateLimit', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <FaBell className="text-green-400" />
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
                className="w-4 h-4"
              />
              <span>Email Notifications</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={() => handleToggle('smsNotifications')}
                className="w-4 h-4"
              />
              <span>SMS Notifications</span>
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <FaLock className="text-red-400" />
            <h3 className="text-lg font-semibold">Security</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={() => handleToggle('twoFactorAuth')}
                className="w-4 h-4"
              />
              <span>Require Two-Factor Authentication</span>
            </label>

            <label className="flex items-center gap-2 border-t border-gray-700 pt-3">
              <input
                type="checkbox"
                checked={settings.allowPublicListings}
                onChange={() => handleToggle('allowPublicListings')}
                className="w-4 h-4"
              />
              <span>Allow Public Property Listings</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-2 rounded font-semibold"
        >
          <FaSave />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;
