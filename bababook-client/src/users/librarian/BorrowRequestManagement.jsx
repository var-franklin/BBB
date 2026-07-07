import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  BookOpen,
  Search,
  Filter,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

const BorrowRequestsManagement = () => {
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);
  const [librarian, setLibrarian] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'requestedAt',
    direction: 'desc'
  });

  useEffect(() => {
    const librarianData = localStorage.getItem('user');
    if (librarianData) {
      const userData = JSON.parse(librarianData);
      if (userData.userType === 'librarian') {
        setLibrarian(userData);
        fetchBorrowRequests(userData._id);
      } else {
        setError('Unauthorized: Only librarians can access this page');
        setLoading(false);
      }
    } else {
      setError('Please log in to access this page');
      setLoading(false);
    }
  }, []);

  const fetchBorrowRequests = async (librarianId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/librarian/borrow-requests?libraryId=${librarianId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBorrowRequests(data);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load borrow requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      setError(null);
      const dueDate = status === 'approved' ? 
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() : 
        null;

      const response = await fetch(`http://localhost:5000/librarian/borrow-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, dueDate }),
      });

      if (!response.ok) {
        throw new Error('Failed to update request');
      }

      await fetchBorrowRequests(librarian._id);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to update request. Please try again.');
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedRequests = [...borrowRequests].sort((a, b) => {
      if (key === 'requestedAt') {
        return direction === 'asc' 
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      }
      
      const aValue = a[key]?.toString().toLowerCase() || '';
      const bValue = b[key]?.toString().toLowerCase() || '';
      
      return direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    setBorrowRequests(sortedRequests);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const filteredRequests = borrowRequests
    .filter(request => {
      const matchesSearch = (
        request.bookData?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const matchesFilter = filter === 'all' || request.status === filter;
      
      return matchesSearch && matchesFilter;
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'approved':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'rejected':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="p-6 bg-gray-900">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Borrow Requests</h1>
          <span className="text-sm text-gray-400">
            {borrowRequests.filter(r => r.status === 'pending').length} pending requests
          </span>
        </div>
        <p className="text-gray-400 mt-2">Manage and review book borrowing requests</p>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by book, user name, or email..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="w-48">
          <select
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-gray-800">
            <tr>
              <th className="px-6 py-3 cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort('bookData.title')}>
                <div className="flex items-center gap-2">
                  Book Details
                  {sortConfig.key === 'bookData.title' && (
                    sortConfig.direction === 'asc' ? 
                      <ChevronUp size={16} /> : 
                      <ChevronDown size={16} />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort('userName')}>
                <div className="flex items-center gap-2">
                  Reader
                  {sortConfig.key === 'userName' && (
                    sortConfig.direction === 'asc' ? 
                      <ChevronUp size={16} /> : 
                      <ChevronDown size={16} />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort('requestedAt')}>
                <div className="flex items-center gap-2">
                  Request Date
                  {sortConfig.key === 'requestedAt' && (
                    sortConfig.direction === 'asc' ? 
                      <ChevronUp size={16} /> : 
                      <ChevronDown size={16} />
                  )}
                </div>
              </th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                  No borrow requests found
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <tr key={request._id} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-12 h-16">
                        {request.bookData?.imageUrl ? (
                          <img
                            src={request.bookData.imageUrl}
                            alt={request.bookData.title}
                            className="object-cover w-full h-full rounded"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gray-800 rounded">
                            <BookOpen className="w-6 h-6 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white">{request.bookData?.title}</div>
                        <div className="text-sm text-gray-400">{request.bookData?.author}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white">{request.userName}</div>
                    <div className="text-sm text-gray-400">{request.userEmail}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(request.requestedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)} border`}>
                      {request.status === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                      {request.status === 'approved' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                      {request.status === 'rejected' && <XCircle className="w-3 h-3 inline mr-1" />}
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {request.status === 'pending' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleRequestAction(request._id, 'approved')}
                          className="px-3 py-1 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRequestAction(request._id, 'rejected')}
                          className="px-3 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowRequestsManagement;