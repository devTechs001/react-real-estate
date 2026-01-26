import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';

const SystemSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSystemSettings();
  }, []);

  const fetchSystemSettings = async () => {
    try {
      const data = await dashboardService.getSystemSettings();
      setSettings(data.settings);
    } catch (error) {
      console.error('Error fetching system settings:', error);
      toast.error('Failed to load system settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await dashboardService.updateSystemSettings(settings);
      toast.success('System settings updated successfully');
    } catch (error) {
      console.error('Error updating system settings:', error);
      toast.error('Failed to update system settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  if (!settings) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">System Settings</h2>
        <p className="text-gray-500">Unable to load system settings</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">System Settings</h2>
      
      <div className="space-y-8">
        {/* General Settings */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">General Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                value={settings.general.siteName}
                onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site URL</label>
              <input
                type="text"
                value={settings.general.siteUrl}
                onChange={(e) => handleInputChange('general', 'siteUrl', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <input
                type="text"
                value={settings.general.timezone}
                onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <input
                type="text"
                value={settings.general.currency}
                onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Authentication Settings */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Authentication Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={settings.auth.requireEmailVerification}
                  onChange={(e) => handleInputChange('auth', 'requireEmailVerification', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2">Require Email Verification</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password Minimum Length</label>
              <input
                type="number"
                value={settings.auth.passwordMinLength}
                onChange={(e) => handleInputChange('auth', 'passwordMinLength', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Lockout Attempts</label>
              <input
                type="number"
                value={settings.auth.accountLockoutAttempts}
                onChange={(e) => handleInputChange('auth', 'accountLockoutAttempts', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Lockout Duration (minutes)</label>
              <input
                type="number"
                value={settings.auth.accountLockoutDuration}
                onChange={(e) => handleInputChange('auth', 'accountLockoutDuration', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Email Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
              <input
                type="text"
                value={settings.email.smtpHost}
                onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
              <input
                type="number"
                value={settings.email.smtpPort}
                onChange={(e) => handleInputChange('email', 'smtpPort', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
              <input
                type="email"
                value={settings.email.fromEmail}
                onChange={(e) => handleInputChange('email', 'fromEmail', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
              <input
                type="text"
                value={settings.email.fromName}
                onChange={(e) => handleInputChange('email', 'fromName', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Payment Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={settings.payments.stripeEnabled}
                  onChange={(e) => handleInputChange('payments', 'stripeEnabled', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2">Stripe Enabled</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={settings.payments.paypalEnabled}
                  onChange={(e) => handleInputChange('payments', 'paypalEnabled', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2">PayPal Enabled</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={settings.payments.commissionRate}
                onChange={(e) => handleInputChange('payments', 'commissionRate', parseFloat(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Limits Settings */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Limits Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Upload Size (MB)</label>
              <input
                type="number"
                value={settings.limits.maxUploadSize}
                onChange={(e) => handleInputChange('limits', 'maxUploadSize', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Images Per Property</label>
              <input
                type="number"
                value={settings.limits.maxImagesPerProperty}
                onChange={(e) => handleInputChange('limits', 'maxImagesPerProperty', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Favorites</label>
              <input
                type="number"
                value={settings.limits.maxFavorites}
                onChange={(e) => handleInputChange('limits', 'maxFavorites', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Feature Settings */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Feature Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={settings.features.aiEnabled}
                  onChange={(e) => handleInputChange('features', 'aiEnabled', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2">AI Features Enabled</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={settings.features.messagingEnabled}
                  onChange={(e) => handleInputChange('features', 'messagingEnabled', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2">Messaging Enabled</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={settings.features.appointmentScheduling}
                  onChange={(e) => handleInputChange('features', 'appointmentScheduling', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2">Appointment Scheduling</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={settings.features.propertyVerification}
                  onChange={(e) => handleInputChange('features', 'propertyVerification', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2">Property Verification</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className={`px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 ${
            saving ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;