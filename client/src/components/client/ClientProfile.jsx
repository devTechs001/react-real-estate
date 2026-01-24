import { useState } from 'react';
import { FaUser, FaCamera, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';

const ClientProfile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
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
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={avatarPreview || '/default-avatar.png'}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
            />
            <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary-dark transition-colors">
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
            <h3 className="font-semibold text-lg">Profile Picture</h3>
            <p className="text-sm text-gray-600">
              Click the camera icon to upload a new picture
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <Input
          label="Full Name"
          name="name"
          value={profileData.name}
          onChange={handleChange}
          icon={<FaUser />}
          required
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          value={profileData.email}
          onChange={handleChange}
          icon={<FaEnvelope />}
          required
        />

        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={profileData.phone}
          onChange={handleChange}
          icon={<FaPhone />}
        />

        <Button type="submit" loading={loading} fullWidth>
          Update Profile
        </Button>
      </form>
    </Card>
  );
};

export default ClientProfile;
