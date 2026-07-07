import React, { useEffect, useState } from 'react';
import { Search, Building2, User, Calendar, MapPin, Mail, Phone, Check, X, ExternalLink } from 'lucide-react';

const LibrarianApplications = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/pending-applications');
      const data = await response.json();
      setApplications(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setIsLoading(false);
    }
  };

  const handleApplicationReview = async (applicationId, status, notes = '') => {
    try {
      const response = await fetch(`http://localhost:5000/admin/review-application/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      });

      if (response.ok) {
        // Update local state to reflect the change
        setApplications(applications.map(app => 
          app._id === applicationId 
            ? { ...app, status, applicationDetails: { ...app.applicationDetails, notes } }
            : app
        ));
      } else {
        throw new Error('Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application status');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.libraryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Librarian Applications</h1>
        <p className="text-gray-400">Review and manage librarian account applications</p>
      </header>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, or library..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="all">All</option>
        </select>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApplications.map((application) => (
          <div key={application._id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            {/* Library Info */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-white">{application.libraryName}</h3>
                  <div className="flex items-center text-gray-400 mt-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{application.libraryAddress}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  application.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                  application.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                  'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Applicant Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-300">
                <User className="w-4 h-4 mr-2" />
                <span>{application.firstName} {application.lastName}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm">{application.email}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">{application.phoneNumber}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  Applied: {new Date(application.applicationDetails.submittedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {application.status === 'pending' && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleApplicationReview(application._id, 'approved')}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 px-4 transition-colors duration-200"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleApplicationReview(application._id, 'rejected')}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 px-4 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibrarianApplications;