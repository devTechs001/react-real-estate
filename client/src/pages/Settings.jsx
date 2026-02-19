// client/src/pages/Settings.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/common/Header';
import SEO from '../components/common/SEO';
import toast from 'react-hot-toast';
import '../styles/Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    // Account
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    language: 'en',
    timezone: 'America/New_York',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    newPropertyAlerts: true,
    priceDropAlerts: true,
    appointmentReminders: true,
    messageNotifications: true,
    
    // Privacy
    profileVisibility: 'public',
    showPhone: false,
    showEmail: true,
    allowMessages: true,
    showOnlineStatus: true,
    
    // Security
    twoFactorEnabled: false,
    loginAlerts: true,
  });

  const tabs = [
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'security', label: 'Security', icon: '🛡️' },
    { id: 'billing', label: 'Billing', icon: '💳' },
  ];

  const handleSave = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Settings saved successfully!');
    setLoading(false);
  };

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div>
        <h4 className="font-medium text-gray-900">{label}</h4>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            enabled ? 'left-7' : 'left-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <>
      <SEO title="Settings - HomeScape" description="Manage your account settings" />

      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar */}
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
                  {/* Account Settings */}
                  {activeTab === 'account' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={settings.email}
                            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={settings.phone}
                            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                          </label>
                          <select
                            value={settings.language}
                            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone
                          </label>
                          <select
                            value={settings.timezone}
                            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500"
                          >
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100">
                        <h3 className="font-medium text-red-600 mb-4">Danger Zone</h3>
                        <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Notifications */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-700">Channels</h3>
                        <ToggleSwitch
                          enabled={settings.emailNotifications}
                          onChange={(v) => setSettings({ ...settings, emailNotifications: v })}
                          label="Email Notifications"
                          description="Receive updates via email"
                        />
                        <ToggleSwitch
                          enabled={settings.pushNotifications}
                          onChange={(v) => setSettings({ ...settings, pushNotifications: v })}
                          label="Push Notifications"
                          description="Browser and mobile push notifications"
                        />
                        <ToggleSwitch
                          enabled={settings.smsNotifications}
                          onChange={(v) => setSettings({ ...settings, smsNotifications: v })}
                          label="SMS Notifications"
                          description="Text message alerts"
                        />
                      </div>

                      <div className="space-y-2 pt-6 border-t border-gray-100">
                        <h3 className="font-medium text-gray-700">Alerts</h3>
                        <ToggleSwitch
                          enabled={settings.newPropertyAlerts}
                          onChange={(v) => setSettings({ ...settings, newPropertyAlerts: v })}
                          label="New Property Alerts"
                          description="Get notified when new properties match your criteria"
                        />
                        <ToggleSwitch
                          enabled={settings.priceDropAlerts}
                          onChange={(v) => setSettings({ ...settings, priceDropAlerts: v })}
                          label="Price Drop Alerts"
                          description="Get notified when saved properties drop in price"
                        />
                        <ToggleSwitch
                          enabled={settings.appointmentReminders}
                          onChange={(v) => setSettings({ ...settings, appointmentReminders: v })}
                          label="Appointment Reminders"
                          description="Reminders for scheduled property viewings"
                        />
                        <ToggleSwitch
                          enabled={settings.messageNotifications}
                          onChange={(v) => setSettings({ ...settings, messageNotifications: v })}
                          label="Message Notifications"
                          description="Get notified of new messages"
                        />
                      </div>
                    </div>
                  )}

                  {/* Privacy */}
                  {activeTab === 'privacy' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-900">Privacy Settings</h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Profile Visibility
                        </label>
                        <select
                          value={settings.profileVisibility}
                          onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500"
                        >
                          <option value="public">Public - Anyone can view</option>
                          <option value="registered">Registered Users Only</option>
                          <option value="private">Private - Only you can view</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <ToggleSwitch
                          enabled={settings.showPhone}
                          onChange={(v) => setSettings({ ...settings, showPhone: v })}
                          label="Show Phone Number"
                          description="Display your phone number on your profile"
                        />
                        <ToggleSwitch
                          enabled={settings.showEmail}
                          onChange={(v) => setSettings({ ...settings, showEmail: v })}
                          label="Show Email Address"
                          description="Display your email on your profile"
                        />
                        <ToggleSwitch
                          enabled={settings.allowMessages}
                          onChange={(v) => setSettings({ ...settings, allowMessages: v })}
                          label="Allow Messages"
                          description="Let other users send you messages"
                        />
                        <ToggleSwitch
                          enabled={settings.showOnlineStatus}
                          onChange={(v) => setSettings({ ...settings, showOnlineStatus: v })}
                          label="Show Online Status"
                          description="Let others see when you're online"
                        />
                      </div>
                    </div>
                  )}

                  {/* Security */}
                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                      
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-500">Add an extra layer of security</p>
                          </div>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            {settings.twoFactorEnabled ? 'Disable' : 'Enable'}
                          </button>
                        </div>
                      </div>

                      <ToggleSwitch
                        enabled={settings.loginAlerts}
                        onChange={(v) => setSettings({ ...settings, loginAlerts: v })}
                        label="Login Alerts"
                        description="Get notified of new logins to your account"
                      />

                      <div className="pt-6 border-t border-gray-100">
                        <h3 className="font-medium text-gray-900 mb-4">Password</h3>
                        <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                          Change Password
                        </button>
                      </div>

                      <div className="pt-6 border-t border-gray-100">
                        <h3 className="font-medium text-gray-900 mb-4">Active Sessions</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span>💻</span>
                              <div>
                                <p className="font-medium text-gray-900">Chrome on MacOS</p>
                                <p className="text-sm text-gray-500">Current session</p>
                              </div>
                            </div>
                            <span className="text-green-600 text-sm">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Billing */}
                  {activeTab === 'billing' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-900">Billing & Subscription</h2>
                      
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-200">Current Plan</p>
                            <h3 className="text-2xl font-bold">Free Plan</h3>
                          </div>
                          <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100">
                            Upgrade
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900 mb-4">Payment Methods</h3>
                        <button className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-gray-300 hover:text-gray-600">
                          + Add Payment Method
                        </button>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900 mb-4">Billing History</h3>
                        <p className="text-gray-500 text-center py-8">No billing history</p>
                      </div>
                    </div>
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
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Settings;