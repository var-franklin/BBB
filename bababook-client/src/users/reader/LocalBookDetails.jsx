import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Tag,
  Globe,
  Building,
  Info,
  Users,
  Clock,
  Star
} from 'lucide-react';
import { Card, Badge, Progress, Tooltip, Alert } from 'flowbite-react';
import SaveButton from './SaveButton';
import BorrowButton from './BorrowButton';

const LocalBookDetails = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/book/${id}`);
        if (!response.ok) throw new Error('Book not found');
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError('Failed to load book details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <Alert color="failure" className="mx-6 mt-6">
        <span className="font-medium">Error!</span> {error || 'Book not found'}
      </Alert>
    );
  }

  const availabilityPercentage = book.copiesAvailable ? 
    (book.copiesAvailable / book.totalCopies) * 100 : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <button
        onClick={() => navigate('/reader/browse/local')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Local Library</span>
      </button>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column - Book Cover */}
        <div className="lg:col-span-4">
          <Card className="overflow-hidden bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
            <div className="p-6">
              <div className="relative group">
                <img
                  src={book.imageURL || "/api/placeholder/300/450"}
                  alt={book.bookTitle}
                  className="w-full rounded-lg shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300"
                />
                {book.isNew && (
                  <Badge color="info" className="absolute top-4 right-4">
                    New Arrival
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Book Details */}
        <div className="lg:col-span-8">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
            <div className="p-6 space-y-6">
              {/* Title and Author */}
              <div className="space-y-3">
                <h1 className="text-4xl font-bold text-white">{book.bookTitle}</h1>
                <div className="flex items-center gap-2 text-xl text-gray-400">
                  <span>by</span>
                  <span className="text-gray-200">
                    {book.authorName}
                  </span>
                </div>
              </div>

              {/* Meta Information */}
              <div className="flex flex-wrap gap-4">
                <Tooltip content="Publication Date">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <span>{formatDate(book.publishDate)}</span>
                  </div>
                </Tooltip>

                <Tooltip content="Category">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Tag className="w-5 h-5 text-blue-400" />
                    <span>{book.category}</span>
                  </div>
                </Tooltip>

                {book.rating && (
                  <Tooltip content="Rating">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span>{book.rating}/5</span>
                    </div>
                  </Tooltip>
                )}

                {book.totalBorrows && (
                  <Tooltip content="Total Borrows">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users className="w-5 h-5 text-blue-400" />
                      <span>{book.totalBorrows} borrows</span>
                    </div>
                  </Tooltip>
                )}
              </div>

              {/* Availability Section */}
              <div className="space-y-4 p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">Availability</span>
                  </div>
                  <Badge color={availabilityPercentage > 50 ? "success" : "warning"}>
                    {book.copiesAvailable} of {book.totalCopies} available
                  </Badge>
                </div>
                <Progress
                  progress={availabilityPercentage}
                  color={availabilityPercentage > 50 ? "blue" : "yellow"}
                  size="lg"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <SaveButton book={book} />
                <BorrowButton book={book} />
                {book.bookPDFURL && (
                  <a
                    href={book.bookPDFURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-2 flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200"
                  >
                    <BookOpen className="w-5 h-5" />
                    Read Book
                  </a>
                )}
              </div>

              {/* Tabs Navigation */}
              <div className="flex border-b border-gray-700">
                <button
                  className={`px-6 py-3 font-medium ${
                    activeTab === 'description'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  className={`px-6 py-3 font-medium ${
                    activeTab === 'details'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('details')}
                >
                  Details
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'description' ? (
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">{book.bookDescription}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  {book.language && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Language</h3>
                        <p className="text-white">{book.language}</p>
                      </div>
                    </div>
                  )}

                  {book.publisher && (
                    <div className="flex items-start gap-3">
                      <Building className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Publisher</h3>
                        <p className="text-white">{book.publisher}</p>
                      </div>
                    </div>
                  )}

                  {book.isbn && (
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">ISBN</h3>
                        <p className="text-white">{book.isbn}</p>
                      </div>
                    </div>
                  )}

                  {book.pageCount && (
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Pages</h3>
                        <p className="text-white">{book.pageCount}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LocalBookDetails;