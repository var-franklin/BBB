import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Trash2, 
  ExternalLink, 
  Library, 
  Search,
  Grid,
  List,
  SortAsc,
  Calendar,
  Clock,
  BookOpen
} from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../utils/AuthProvider';
import { Card, Dropdown } from 'flowbite-react';

const SavedBooks = () => {
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedBooks();
  }, [user]);

  const fetchSavedBooks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/reader/saved-books/${user._id}`);
      setSavedBooks(response.data);
    } catch (err) {
      setError('Failed to fetch saved books');
      console.error('Error fetching saved books:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromLibrary = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5000/reader/saved-books/${user._id}/${bookId}`);
      setSavedBooks(prev => prev.filter(book => book.bookData.id !== bookId));
    } catch (err) {
      console.error('Error removing book:', err);
    }
  };

  const handleViewDetails = (book) => {
    if (book.bookData.source === 'local') {
      navigate(`/reader/browse/local/${book.bookData.id}`);
    } else {
      // For Google Books, reconstruct the data structure using stored volumeInfo
      const googleBookData = {
        id: book.bookData.id,
        volumeInfo: book.bookData.volumeInfo || {
          title: book.bookData.title,
          authors: book.bookData.author ? [book.bookData.author] : [],
          description: book.bookData.description,
          imageLinks: book.bookData.imageLinks || {
            thumbnail: book.bookData.thumbnail
          },
          categories: book.bookData.category ? [book.bookData.category] : [],
          publishedDate: book.bookData.publishedDate,
          publisher: book.bookData.publisher,
          pageCount: book.bookData.pageCount,
          language: book.bookData.language,
          averageRating: book.bookData.averageRating,
          ratingsCount: book.bookData.ratingsCount,
          previewLink: book.bookData.previewLink
        },
        accessInfo: book.bookData.accessInfo || {
          pdf: {
            downloadLink: book.bookData.pdfUrl
          }
        }
      };

      navigate(`/reader/browse/google/${book.bookData.id}`, {
        state: { 
          bookData: googleBookData,
          filters: {} // Add empty filters object to prevent undefined errors
        }
      });
    }
  };

  const sortBooks = (books) => {
    return [...books].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.bookData.title.localeCompare(b.bookData.title);
        case 'author':
          return a.bookData.author.localeCompare(b.bookData.author);
        case 'dateAdded':
        default:
          return new Date(b.savedAt) - new Date(a.savedAt);
      }
    });
  };

  const filterBooks = (books) => {
    let filtered = books;

    // First apply source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(book => 
        book.bookData.source === sourceFilter
      );
    }

    // Then apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book => 
        book.bookData.title.toLowerCase().includes(query) ||
        book.bookData.author.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const renderBookCard = (saved) => (
    <Card key={saved.bookData.id || saved.bookData._id} className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-colors">
      <div className="p-4">
        <div className="relative aspect-[2/3] mb-4">
          <img
            src={saved.bookData.thumbnail || saved.bookData.imageURL || "/api/placeholder/400/600"}
            alt={saved.bookData.title || saved.bookData.bookTitle}
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
          {/* Source badge */}
          <span className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-blue-500 text-white">
            {saved.bookData.source}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {saved.bookData.title || saved.bookData.bookTitle}
        </h3>
        <p className="text-gray-400 text-sm mb-2">
          {saved.bookData.author || saved.bookData.authorName}
        </p>
        <p className="text-gray-500 text-sm mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {new Date(saved.savedAt).toLocaleDateString()}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => handleViewDetails(saved)}
            className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Details
          </button>
          <button
            onClick={() => removeFromLibrary(saved.bookData.id || saved.bookData._id)}
            className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );

  const renderBookListItem = (saved) => (
    <div 
      key={saved.bookData.id || saved.bookData._id}
      className="flex gap-6 bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 transition-colors p-4 rounded-lg"
    >
      <img
        src={saved.bookData.thumbnail || saved.bookData.imageURL || "/api/placeholder/200/300"}
        alt={saved.bookData.title || saved.bookData.bookTitle}
        className="w-32 h-48 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-white mb-2">
          {saved.bookData.title || saved.bookData.bookTitle}
        </h3>
        <p className="text-gray-400 text-lg mb-2">
          {saved.bookData.author || saved.bookData.authorName}
        </p>
        <p className="text-gray-500 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Added on {new Date(saved.savedAt).toLocaleDateString()}
        </p>
        {(saved.bookData.description || saved.bookData.bookDescription) && (
          <p className="text-gray-400 mb-4 line-clamp-2">
            {saved.bookData.description || saved.bookData.bookDescription}
          </p>
        )}
        <div className="flex gap-3">
          <button
            onClick={() => handleViewDetails(saved)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            View Details
          </button>
          <button
            onClick={() => removeFromLibrary(saved.bookData.id || saved.bookData._id)}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-400 animate-pulse">Loading your library...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="text-red-500 mb-4">
          <ExternalLink className="w-12 h-12 mx-auto mb-2" />
          <p>{error}</p>
        </div>
        <button
          onClick={fetchSavedBooks}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (savedBooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 px-4">
        <div className="text-center max-w-md mx-auto">
          <Library className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-200 mb-2">Your Library is Empty</h2>
          <p className="text-gray-400 mb-6">Start adding books to your library while browsing</p>
          <button
            onClick={() => navigate('/reader/browse')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  const filteredAndSortedBooks = filterBooks(sortBooks(savedBooks));

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Library</h1>
            <p className="text-gray-400">
              {savedBooks.length} {savedBooks.length === 1 ? 'book' : 'books'} saved
            </p>
          </div>
          
          <button
            onClick={() => navigate('/reader/browse')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Browse More Books
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6 bg-gray-800/50 p-4 rounded-lg">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <Dropdown label={
              <div className="flex items-center gap-2 text-white">
                <BookOpen className="w-4 h-4" />
                {sourceFilter === 'all' ? 'All Sources' : 
                 sourceFilter === 'local' ? 'Local Library' : 'Google Books'}
              </div>
            }>
              <Dropdown.Item onClick={() => setSourceFilter('all')}>All Sources</Dropdown.Item>
              <Dropdown.Item onClick={() => setSourceFilter('local')}>Local Library</Dropdown.Item>
              <Dropdown.Item onClick={() => setSourceFilter('google')}>Google Books</Dropdown.Item>
            </Dropdown>

            <div className="flex items-center gap-2 bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-600' : 'hover:bg-gray-600/50'}`}
              >
                <Grid className="w-4 h-4 text-gray-300" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-600' : 'hover:bg-gray-600/50'}`}
              >
                <List className="w-4 h-4 text-gray-300" />
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedBooks.map(renderBookCard)}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedBooks.map(renderBookListItem)}
        </div>
      )}
      </div>
    </div>
  );
};

export default SavedBooks;