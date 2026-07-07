import React, { useState, useContext } from 'react';
import { AuthContext } from '../utils/AuthProvider';
import { Save, User, Bell, Lock, Shield, Mail, Phone, Building, MapPin } from 'lucide-react';

const UserSettings = () => {
  const { user, userRole } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    username: user?.username || '',
    ...(userRole === 'librarian' && {
      libraryName: user?.libraryName || '',
      libraryAddress: user?.libraryAddress || ''
    })
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Here you would make an API call to update user details
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEditMode(false);
      // Show success message
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Account Settings</h1>
        <p className="text-gray-400 mt-2">Manage your account preferences and settings</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Card */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold text-white">Profile Information</h2>
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editMode ? (
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {userRole === 'librarian' && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Library Name</label>
                    <input
                      type="text"
                      name="libraryName"
                      value={formData.libraryName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Library Address</label>
                    <input
                      type="text"
                      name="libraryAddress"
                      value={formData.libraryAddress}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
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
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-400">First Name</p>
                  <p className="text-white">{user?.firstName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Last Name</p>
                  <p className="text-white">{user?.lastName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone Number</p>
                  <p className="text-white">{user?.phoneNumber}</p>
                </div>
              </div>

              {userRole === 'librarian' && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-400">Library Name</p>
                    <p className="text-white">{user?.libraryName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Library Address</p>
                    <p className="text-white">{user?.libraryAddress}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettings;