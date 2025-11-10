import { useState } from 'react';
import { FaBell, FaLock, FaPalette, FaUser } from 'react-icons/fa';
import Tabs from '../components/ui/Tabs';
import Switch from '../components/ui/Switch';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    newsletter: true,
  });

  const [theme, setTheme] = useState('light');

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const tabs = [
    {
      label: 'Profile',
      icon: <FaUser />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">Profile Settings</h3>
          <Input label="Display Name" defaultValue="John Doe" />
          <Input label="Email" type="email" defaultValue="john@example.com" />
          <Input label="Phone" type="tel" defaultValue="+1 (555) 123-4567" />
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      ),
    },
    {
      label: 'Notifications',
      icon: <FaBell />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">Notification Preferences</h3>
          <Switch
            label="Email Notifications"
            checked={notifications.email}
            onChange={() => handleNotificationChange('email')}
          />
          <Switch
            label="Push Notifications"
            checked={notifications.push}
            onChange={() => handleNotificationChange('push')}
          />
          <Switch
            label="SMS Notifications"
            checked={notifications.sms}
            onChange={() => handleNotificationChange('sms')}
          />
          <Switch
            label="Newsletter"
            checked={notifications.newsletter}
            onChange={() => handleNotificationChange('newsletter')}
          />
          <Button onClick={handleSave}>Save Preferences</Button>
        </div>
      ),
    },
    {
      label: 'Security',
      icon: <FaLock />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">Security Settings</h3>
          <Input label="Current Password" type="password" />
          <Input label="New Password" type="password" />
          <Input label="Confirm New Password" type="password" />
          <Button onClick={handleSave}>Change Password</Button>
        </div>
      ),
    },
    {
      label: 'Appearance',
      icon: <FaPalette />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">Appearance Settings</h3>
          <div className="space-y-4">
            <label className="block text-sm font-medium">Theme</label>
            <div className="flex gap-4">
              <button
                onClick={() => setTheme('light')}
                className={`px-4 py-2 rounded-lg border-2 ${
                  theme === 'light' ? 'border-primary-600' : 'border-gray-300'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 rounded-lg border-2 ${
                  theme === 'dark' ? 'border-primary-600' : 'border-gray-300'
                }`}
              >
                Dark
              </button>
            </div>
          </div>
          <Button onClick={handleSave}>Save Appearance</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="bg-white rounded-xl shadow-md p-6">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
};

export default Settings;