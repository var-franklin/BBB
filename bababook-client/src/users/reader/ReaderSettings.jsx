import React, { useState, useContext } from 'react';
import { Save, Mail, Phone, Lock, Key, Image } from 'lucide-react';
import { AuthContext } from '../../utils/AuthProvider';

const ReaderSettings = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notificationPreferences: {
      emailNotifications: true,
      pushNotifications: true,
      borrowingReminders: true,
      returnReminders: true,
      newArrivals: false,
      recommendations: true
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (key) => {
    setFormData(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [key]: !prev.notificationPreferences[key]
      }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API call to update user profile would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Show success notification
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show error notification
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API call to change password would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      // Show success notification
    } catch (error) {
      console.error('Error changing password:', error);
      // Show error notification
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' }
  ];

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Reader Settings</h1>
        <p className="text-gray-400 mt-2">Manage your profile, security, and preferences</p>
      </header>

      {/* Tabs Navigation */}
      <div className="flex space-x-4 mb-8 border-b border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition-all duration-200 border-b-2 
              ${activeTab === tab.id 
                ? 'text-blue-400 border-blue-400' 
                : 'text-gray-400 border-transparent hover:text-gray-300'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Section */}
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img
                      src={URL.createObjectURL(profileImage)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <Image className="w-4 h-4 text-white" />
                </label>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Profile Picture</h3>
                <p className="text-sm text-gray-400">JPG or PNG. Max size of 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-6 py-2 transition-colors duration-200"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-6 py-2 transition-colors duration-200"
              >
                <Key className="w-4 h-4" />
                <span>{loading ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="space-y-4">
              {Object.entries(formData.notificationPreferences).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div>
                    <h3 className="text-white font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Receive notifications about {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={value}
                      onChange={() => handleNotificationChange(key)}
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer 
                      peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                      after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                      after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-6 py-2 transition-colors duration-200"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Preferences'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReaderSettings;