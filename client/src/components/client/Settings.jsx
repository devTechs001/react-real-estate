// client/src/pages/user/Settings.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    // Notifications
    emailNewProperties: true,
    emailPriceDrops: true,
    emailAppointments: true,
    emailMessages: true,
    emailNewsletter: false,
    pushNotifications: true,
    smsNotifications: false,

    // Privacy
    profileVisibility: 'public',
    showPhone: false,
    showEmail: true,
    allowMessages: true,

    // Preferences
    language: 'en',
    currency: 'USD',
    measurementUnit: 'sqft',
    theme: 'light',
  });

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🛡️' },
  ];

  const handleSave = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Settings saved successfully!');
    setLoading(false);
  };

  const Toggle = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
            enabled ? 'left-7' : 'left-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <>
      <SEO title="Settings - HomeScape" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {/* Notifications */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Email Notifications</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <Toggle
                      enabled={settings.emailNewProperties}
                      onChange={(v) => setSettings({ ...settings, emailNewProperties: v })}
                      label="New Property Matches"
                      description="Get notified when new properties match your saved searches"
                    />
                    <Toggle
                      enabled={settings.emailPriceDrops}
                      onChange={(v) => setSettings({ ...settings, emailPriceDrops: v })}
                      label="Price Drop Alerts"
                      description="Get notified when saved properties drop in price"
                    />
                    <Toggle
                      enabled={settings.emailAppointments}
                      onChange={(v) => setSettings({ ...settings, emailAppointments: v })}
                      label="Appointment Reminders"
                      description="Receive reminders for scheduled property tours"
                    />
                    <Toggle
                      enabled={settings.emailMessages}
                      onChange={(v) => setSettings({ ...settings, emailMessages: v })}
                      label="New Messages"
                      description="Get notified when you receive new messages"
                    />
                    <Toggle
                      enabled={settings.emailNewsletter}
                      onChange={(v) => setSettings({ ...settings, emailNewsletter: v })}
                      label="Newsletter & Tips"
                      description="Receive our weekly newsletter with market insights"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Other Channels</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <Toggle
                      enabled={settings.pushNotifications}
                      onChange={(v) => setSettings({ ...settings, pushNotifications: v })}
                      label="Push Notifications"
                      description="Receive notifications in your browser"
                    />
                    <Toggle
                      enabled={settings.smsNotifications}
                      onChange={(v) => setSettings({ ...settings, smsNotifications: v })}
                      label="SMS Notifications"
                      description="Receive important updates via text message"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Privacy */}
            {activeTab === 'privacy' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">Privacy Settings</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Visibility
                  </label>
                  <select
                    value={settings.profileVisibility}
                    onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500"
                  >
                    <option value="public">Public - Anyone can view</option>
                    <option value="registered">Registered Users Only</option>
                    <option value="private">Private - Only you can view</option>
                  </select>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <Toggle
                    enabled={settings.showPhone}
                    onChange={(v) => setSettings({ ...settings, showPhone: v })}
                    label="Show Phone Number"
                    description="Display your phone number on your profile"
                  />
                  <Toggle
                    enabled={settings.showEmail}
                    onChange={(v) => setSettings({ ...settings, showEmail: v })}
                    label="Show Email Address"
                    description="Display your email on your profile"
                  />
                  <Toggle
                    enabled={settings.allowMessages}
                    onChange={(v) => setSettings({ ...settings, allowMessages: v })}
                    label="Allow Messages"
                    description="Let other users send you messages"
                  />
                </div>

                <div className="pt-4">
                  <h3 className="font-medium text-red-600 mb-4">Danger Zone</h3>
                  <div className="flex gap-4">
                    <button className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700">
                      Download My Data
                    </button>
                    <button className="px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50">
                      Delete Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Measurement Unit</label>
                    <select
                      value={settings.measurementUnit}
                      onChange={(e) => setSettings({ ...settings, measurementUnit: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500"
                    >
                      <option value="sqft">Square Feet (sqft)</option>
                      <option value="sqm">Square Meters (m²)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <select
                      value={settings.theme}
                      onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">System Default</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">Security</h2>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                      Enable
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium text-gray-900">Password</p>
                      <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-100">
                      Change Password
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💻</span>
                        <div>
                          <p className="font-medium text-gray-900">Chrome on MacOS</p>
                          <p className="text-sm text-gray-500">Miami, FL • Current session</p>
                        </div>
                      </div>
                      <span className="text-green-600 text-sm">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📱</span>
                        <div>
                          <p className="font-medium text-gray-900">iPhone 14 Pro</p>
                          <p className="text-sm text-gray-500">Miami, FL • 2 hours ago</p>
                        </div>
                      </div>
                      <button className="text-red-600 text-sm hover:underline">Revoke</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;