import React from 'react';
import { Book, BookOpen, Clock, Users, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const LibrarianDashboard = () => {
  const stats = [
    { title: 'Total Books', value: '2,845', icon: Book, change: '+12 this month' },
    { title: 'Active Borrowers', value: '186', icon: Users, change: '+8% from last month' },
    { title: 'Pending Returns', value: '24', icon: Clock, change: '5 overdue' },
    { title: 'Available Books', value: '2,456', icon: BookOpen, change: '86% of total' },
  ];

  const recentBorrowings = [
    {
      id: 1,
      user: "John Doe",
      book: "The Catcher in the Rye",
      borrowDate: "2024-01-01",
      dueDate: "2024-01-15",
      status: "active"
    },
    // Add more borrowings as needed
  ];

  const pendingRequests = [
    {
      id: 1,
      user: "Jane Smith",
      book: "To Kill a Mockingbird",
      requestDate: "2024-01-02",
      membershipStatus: "Active",
      previousBorrows: 12
    },
    // Add more requests as needed
  ];

  return (
    <div className="p-6 bg-gray-900">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Library Management Dashboard</h1>
        <p className="text-gray-400 mt-2">Monitor your library's activities and manage borrowings</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <stat.icon className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-blue-400 text-sm">{stat.change}</span>
            </div>
            <h3 className="text-gray-400 text-sm">{stat.title}</h3>
            <p className="text-white text-2xl font-semibold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Borrowings Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Borrowings</h2>
            <Link to="/librarian/borrowing-history" className="text-blue-400 hover:text-blue-300 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentBorrowings.map((borrow) => (
              <div key={borrow.id} className="bg-gray-900 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-white font-medium">{borrow.book}</h3>
                    <p className="text-gray-400 text-sm">Borrowed by: {borrow.user}</p>
                  </div>
                  <span className={`text-sm ${
                    new Date(borrow.dueDate) < new Date() ? 'text-red-400' : 'text-green-400'
                  }`}>
                    Due: {borrow.dueDate}
                  </span>
                </div>
                <div className="flex items-center mt-2">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-400 text-sm">
                    Borrowed on: {borrow.borrowDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Requests Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Pending Requests</h2>
            <Link to="/librarian/borrow-requests" className="text-blue-400 hover:text-blue-300 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="bg-gray-900 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-white font-medium">{request.book}</h3>
                    <p className="text-gray-400 text-sm">Requested by: {request.user}</p>
                  </div>
                  <span className="text-blue-400 text-sm">
                    {request.membershipStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-400 text-sm">
                      Requested: {request.requestDate}
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    Previous borrows: {request.previousBorrows}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarianDashboard;