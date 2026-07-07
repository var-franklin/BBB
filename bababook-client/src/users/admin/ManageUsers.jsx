import React, { useEffect, useState } from 'react';
import { Search, Filter, Shield, UserCog, Trash2, Mail, Phone } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserType, setSelectedUserType] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/users');
      const data = await response.json();
      setUsers(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:5000/admin/users/${userId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setUsers(users.filter(user => user._id !== userId));
          alert('User deleted successfully');
        } else {
          throw new Error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleUserTypeChange = async (userId, newType) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userType: newType }),
      });

      if (response.ok) {
        setUsers(users.map(user => 
          user._id === userId ? { ...user, userType: newType } : user
        ));
        alert('User type updated successfully');
      } else {
        throw new Error('Failed to update user type');
      }
    } catch (error) {
      console.error('Error updating user type:', error);
      alert('Failed to update user type');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedUserType === 'All' || user.userType === selectedUserType;
    return matchesSearch && matchesType;
  });

  const userTypes = ['All', 'admin', 'librarian', 'reader'];

  const getUserTypeIcon = (type) => {
    switch (type) {
      case 'admin':
        return <Shield className="w-4 h-4 text-red-400" />;
      case 'librarian':
        return <UserCog className="w-4 h-4 text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Manage Users</h1>
        <p className="text-gray-400">Monitor and manage user accounts across the platform</p>
      </header>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, or username..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedUserType}
            onChange={(e) => setSelectedUserType(e.target.value)}
          >
            {userTypes.map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs bg-gray-800">
            <tr>
              <th scope="col" className="py-4 px-6">User</th>
              <th scope="col" className="py-4 px-6">Contact</th>
              <th scope="col" className="py-4 px-6">Type</th>
              <th scope="col" className="py-4 px-6">Status</th>
              <th scope="col" className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-t border-gray-700 bg-gray-900 hover:bg-gray-800">
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="font-medium text-white">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-sm text-gray-400">@{user.username}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <div className="flex items-center text-gray-400">
                      <Mail className="w-4 h-4 mr-2" />
                      {user.email}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Phone className="w-4 h-4 mr-2" />
                      {user.phoneNumber}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    {getUserTypeIcon(user.userType)}
                    <select
                      value={user.userType}
                      onChange={(e) => handleUserTypeChange(user._id, e.target.value)}
                      className="bg-transparent text-gray-300 border-none focus:ring-0"
                      disabled={user.userType === 'admin'}
                    >
                      {userTypes.filter(type => type !== 'All').map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    user.userType === 'admin' 
                      ? 'bg-red-500/10 text-red-400'
                      : user.userType === 'librarian'
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'bg-green-500/10 text-green-400'
                  }`}>
                    Active
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={user.userType === 'admin'}
                      className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;