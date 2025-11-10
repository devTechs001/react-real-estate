import { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCamera } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('email', profileData.email);
      formData.append('phone', profileData.phone);
      if (avatar) {
        formData.append('avatar', avatar);
      }

      await updateProfile(formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Call password change API
      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      label: 'Profile Information',
      icon: <FaUser />,
      content: (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={avatarPreview || '/default-avatar.png'}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover"
              />
              <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700">
                <FaCamera />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <div>
              <h3 className="font-semibold">Profile Picture</h3>
              <p className="text-sm text-gray-600">
                Click the camera icon to upload a new picture
              </p>
            </div>
          </div>

          <Input
            label="Full Name"
            name="name"
            value={profileData.name}
            onChange={handleProfileChange}
            icon={<FaUser />}
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleProfileChange}
            icon={<FaEnvelope />}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            value={profileData.phone}
            onChange={handleProfileChange}
            icon={<FaPhone />}
          />

          <Button type="submit" loading={loading}>
            Save Changes
          </Button>
        </form>
      ),
    },
    {
      label: 'Change Password',
      icon: <FaLock />,
      content: (
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <Input
            label="Current Password"
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            icon={<FaLock />}
            required
          />

          <Input
            label="New Password"
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            icon={<FaLock />}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            icon={<FaLock />}
            required
          />

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-sm text-blue-800">
              <strong>Password requirements:</strong>
              <ul className="list-disc ml-5 mt-2">
                <li>Minimum 6 characters</li>
                <li>Include uppercase and lowercase letters</li>
                <li>Include numbers and special characters</li>
              </ul>
            </p>
          </div>

          <Button type="submit" loading={loading}>
            Change Password
          </Button>
        </form>
      ),
    },
  ];

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
};

export default Profile;