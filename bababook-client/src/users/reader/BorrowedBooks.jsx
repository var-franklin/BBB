import React, { useState, useEffect, useContext } from 'react';
import { BookOpen, Clock, ArrowLeft, Calendar, XCircle, Download, FileText, Library, User, Eye, AlertCircle, MapPin, CheckCircle } from 'lucide-react';
import { AuthContext } from '../../utils/AuthProvider';
import { Button, Modal, Card, Timeline, Spinner } from 'flowbite-react';
import jsPDF from 'jspdf';

const BorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?._id) {
      Promise.all([
        fetchBorrowedBooks(),
        fetchBorrowRequests()
      ]).finally(() => setLoading(false));
    }
  }, [user?._id]);

  const fetchBorrowedBooks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/reader/borrowed-books/${user?._id}`);
      if (!response.ok) throw new Error('Failed to fetch borrowed books');
      const data = await response.json();
      setBorrowedBooks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchBorrowRequests = async () => {
    try {
      const response = await fetch(`http://localhost:5000/reader/borrow-requests/${user?._id}`);
      if (!response.ok) throw new Error('Failed to fetch borrow requests');
      const data = await response.json();
      setBorrowRequests(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-yellow-400';
      case 'approved': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const RequestTrackingTable = () => {
    if (borrowRequests.length === 0) return null;

    const pendingCount = borrowRequests.filter(r => r.status.toLowerCase() === 'pending').length;

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Borrow Requests History</h2>
          {pendingCount > 0 && (
            <span className="text-sm text-gray-400">
              {pendingCount} pending {pendingCount === 1 ? 'request' : 'requests'}
            </span>
          )}
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-800 text-gray-400">
              <tr>
                <th className="px-4 py-3">Book</th>
                <th className="px-4 py-3">Library</th>
                <th className="px-4 py-3">Request Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Response Date</th>
              </tr>
            </thead>
            <tbody>
              {borrowRequests.map((request) => (
                <tr key={request._id} className="border-b border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-14 flex-shrink-0">
                        {request.bookData.thumbnail ? (
                          <img
                            src={request.bookData.thumbnail}
                            alt={request.bookData.title}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{request.bookData.title}</p>
                        <p className="text-sm text-gray-400">{request.bookData.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <Library className="w-4 h-4 text-gray-400" />
                      <span>{request.bookData.libraryName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(request.requestedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className={`flex items-center space-x-1 ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="capitalize">{request.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {request.dueDate ? (
                      new Date(request.dueDate).toLocaleDateString()
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {request.processedAt ? (
                      new Date(request.processedAt).toLocaleDateString()
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const downloadTicket = (book) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [100, 150]
    });
    
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
    
    doc.setTextColor(0, 0, 0);
    
    // Header
    doc.setFontSize(16);
    doc.text('Library Borrowing Ticket', 50, 15, { align: 'center' });
    
    // Separator line
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(10, 20, 90, 20);
    
    // Book Details
    doc.setFontSize(12);
    doc.text('Book Details', 10, 30);
    doc.setFontSize(10);
    doc.text(`Title: ${book.bookData.title}`, 10, 38);
    doc.text(`Author: ${book.bookData.author}`, 10, 44);
    doc.text(`Library: ${book.bookData.libraryName || 'Main Library'}`, 10, 50);
    
    // Borrower Details
    doc.setFontSize(12);
    doc.text('Borrower Details', 10, 65);
    doc.setFontSize(10);
    doc.text(`Name: ${user.firstName} ${user.lastName}`, 10, 73);
    doc.text(`ID: ${user._id}`, 10, 79);
    doc.text(`Email: ${user.email}`, 10, 85);
    
    // Dates
    doc.setFontSize(12);
    doc.text('Borrowing Period', 10, 100);
    doc.setFontSize(10);
    doc.text(`Borrow Date: ${new Date(book.bookData.borrowDate).toLocaleDateString()}`, 10, 108);
    doc.text(`Due Date: ${new Date(book.bookData.dueDate).toLocaleDateString()}`, 10, 114);
    
    // Footer
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(10, 130, 90, 130);
    doc.setFontSize(8);
    doc.text('Please keep this ticket for your records', 50, 138, { align: 'center' });
    doc.text('This ticket serves as proof of borrowing', 50, 143, { align: 'center' });

    doc.save(`borrowing-ticket-${book._id}.pdf`);
  };

  if (loading) return <BookListSkeleton />;
  if (error) return <ErrorState message={error} />;
  if (borrowedBooks.length === 0 && borrowRequests.length === 0) return <EmptyState />;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            Borrowed Books
          </h1>
          <p className="text-gray-400 mt-1">Manage your borrowed books and track requests</p>
        </div>
      </header>

      <RequestTrackingTable />

      {borrowedBooks.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Currently Borrowed</h2>
            <span className="text-sm text-gray-400">
              {borrowedBooks.length} active {borrowedBooks.length === 1 ? 'loan' : 'loans'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {borrowedBooks.map((book) => (
              <BorrowedBookCard 
                key={book._id} 
                book={book} 
                onSelect={() => setSelectedBook(book)}
                onDownload={() => downloadTicket(book)}
              />
            ))}
          </div>
        </>
      )}

      {selectedBook && (
        <BookDetailsModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onDownload={() => downloadTicket(selectedBook)}
        />
      )}
    </div>
  );
};


const BookDetailsModal = ({ book, onClose, onDownload }) => {
    const dueDate = new Date(book.bookData.dueDate);
    const borrowDate = new Date(book.bookData.borrowDate);
    const daysUntilDue = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysUntilDue < 0;
  
    return (
      <Modal 
        show={true} 
        onClose={onClose} 
        size="xl"
        theme={{
          root: {
            base: "fixed top-0 right-0 left-0 z-50 h-modal h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
            show: {
              on: "flex bg-gray-900/95 backdrop-blur-sm",
              off: "hidden"
            }
          },
          content: {
            base: "relative h-full w-full p-4 md:h-auto",
            inner: "relative rounded-lg bg-gray-900 shadow-xl border border-gray-800"
          }
        }}
      >
        <Modal.Header className="border-b border-gray-800 bg-gray-900 rounded-t-lg px-6 py-4">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-semibold text-white">Book Details</h3>
          </div>
        </Modal.Header>
  
        <Modal.Body className="px-6 py-4 bg-gray-900">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:space-x-6">
              {/* Book Cover */}
              <div className="w-full md:w-48 mb-6 md:mb-0">
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                  {book.bookData.thumbnail ? (
                    <img
                      src={book.bookData.thumbnail}
                      alt={book.bookData.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-gray-600" />
                    </div>
                  )}
                </div>
              </div>
  
              {/* Book Information */}
              <div className="flex-1 space-y-6">
                {/* Title and Basic Info */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{book.bookData.title}</h2>
                  <p className="text-lg text-gray-400">{book.bookData.author}</p>
                </div>
  
                {/* Status Banner */}
                <div className={`p-4 rounded-lg ${
                  isOverdue 
                    ? 'bg-red-900/20 border border-red-700/30' 
                    : 'bg-emerald-900/20 border border-emerald-700/30'
                }`}>
                  <div className="flex items-start space-x-3">
                    <AlertCircle className={`w-5 h-5 mt-0.5 ${
                      isOverdue ? 'text-red-400' : 'text-emerald-400'
                    }`} />
                    <div>
                      <h4 className={`font-medium ${
                        isOverdue ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {isOverdue 
                          ? `Overdue by ${Math.abs(daysUntilDue)} days` 
                          : `${daysUntilDue} days remaining`}
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">
                        {isOverdue 
                          ? 'Please return the book as soon as possible' 
                          : 'Return the book before the due date'}
                      </p>
                    </div>
                  </div>
                </div>
  
                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Library Info - Updated version */}
                <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg col-span-2">
                    <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-400">Library Location</p>
                    <p className="text-sm font-medium text-white mt-1">
                        {book.bookData.libraryName || 'Unknown Library'}
                    </p>
                    {book.bookData.libraryAddress && (
                        <p className="text-sm text-gray-400 mt-0.5 break-words">
                        {book.bookData.libraryAddress}
                        </p>
                    )}
                    </div>
                </div>

                {/* Borrowing ID */}
                <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-400">Borrowing ID</p>
                    <p className="text-sm font-mono text-white mt-1 break-all">
                        {book._id}
                    </p>
                    </div>
                </div>

                {/* Borrow Date */}
                <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-400">Borrow Date</p>
                    <p className="text-sm text-white mt-1">
                        {borrowDate.toLocaleDateString()}
                    </p>
                    </div>
                </div>

                {/* Due Date */}
                <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-400">Due Date</p>
                    <p className="text-sm text-white mt-1">
                        {dueDate.toLocaleDateString()}
                    </p>
                    </div>
                </div>
                </div>
                
              </div>
            </div>
          </div>
        </Modal.Body>
  
        <Modal.Footer className="border-t border-gray-800 bg-gray-900 rounded-b-lg px-6 py-4">
          <div className="flex justify-end w-full space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors duration-200"
            >
              Close
            </button>
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Ticket</span>
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    );
  };
  
    const BorrowedBookCard = ({ book, onSelect, onDownload }) => {
        const dueDate = new Date(book.bookData.dueDate);
        const daysUntilDue = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
        const isOverdue = daysUntilDue < 0;
    
        return (
        <Card className="bg-gray-800/90 border-gray-700 hover:border-blue-500/50 transition-all duration-300 group">
            <div onClick={onSelect} className="cursor-pointer">
            <div className="flex space-x-4">
                <div className="w-24 h-32 bg-gradient-to-br from-gray-700/50 to-gray-600/50 rounded-lg flex items-center justify-center overflow-hidden">
                {book.bookData.thumbnail ? (
                    <img
                    src={book.bookData.thumbnail}
                    alt={book.bookData.title}
                    className="w-full h-full object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <BookOpen className="w-8 h-8 text-gray-400" />
                )}
                </div>
                <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {book.bookData.title}
                </h3>
                <p className="text-gray-400 text-sm">{book.bookData.author}</p>
                
                <div className="flex items-center space-x-2">
                    <Calendar className={`w-4 h-4 ${isOverdue ? 'text-red-400' : 'text-gray-400'}`} />
                    <span className={`text-sm ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                    {isOverdue 
                        ? `Overdue by ${Math.abs(daysUntilDue)} days` 
                        : `Due in ${daysUntilDue} days`}
                    </span>
                </div>
                </div>
            </div>
    
            <div className="absolute top-2 right-2">
                <Eye className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            </div>
            
            <Button 
            className="w-full mt-3 bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200 group"
            onClick={(e) => {
                e.stopPropagation();
                onDownload();
            }}
            >
            <Download className="w-4 h-4 mr-2 transition-transform" />
            Download Ticket
            </Button>
        </Card>
        );
    };
    const EmptyState = () => (
    <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">No Borrowed Books</h2>
        <p className="text-gray-400 mb-6">You haven't borrowed any books yet.</p>
        <a
        href="/reader/browse"
        className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Browse Books
        </a>
    </div>
    );

    const ErrorState = ({ message }) => (
    <div className="text-center py-12">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
        <p className="text-gray-400">{message}</p>
    </div>
    );

    const BookListSkeleton = () => (
    <div className="space-y-6 border">
        <div className="h-12 w-48 bg-gray-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
            <div className="flex space-x-4">
                <div className="w-24 h-32 bg-gray-700 rounded-md" />
                <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-700 rounded w-1/2" />
                <div className="h-4 bg-gray-700 rounded w-2/3" />
                </div>
            </div>
            </div>
        ))}
        </div>
    </div>
    );

export default BorrowedBooks;