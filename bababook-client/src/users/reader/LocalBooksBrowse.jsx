import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowLeft, Heart, BookOpen, MapPin, BookCopy } from 'lucide-react';
import { Card } from 'flowbite-react';
import LocalBooksFilter from './LocalBooksFilter';
import SaveButton from './SaveButton';
import BorrowButton from './BorrowButton';

const PAGE_SIZE = 12;

export default function LocalBooksBrowse() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();
  const contentRef = useRef(null)
  const [filterOptions, localSetFilterOptions] = useState([]);
  const [printType, setPrintType] = useState('all');;

  const scrollToTop = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/all-books");
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      const booksArray = data.books || [];
      setBooks(booksArray);
      setFilteredBooks(booksArray);
    } catch (err) {
      setError("Failed to fetch books. Please try again later.");
      console.error("Error fetching books:", err);
      setBooks([]);
      setFilteredBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    if (!Array.isArray(books)) {
      setFilteredBooks([]);
      return;
    }
  
    let filtered = [...books];
  
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => 
        book?.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
  
    // Apply language filter
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(book => 
        book?.language?.toLowerCase() === selectedLanguage.toLowerCase()
      );
    }
  
    // Apply print type filter
    if (printType !== 'all') {
      filtered = filtered.filter(book => 
        book?.printType?.toLowerCase() === printType.toLowerCase()
      );
    }
  
    // Apply availability filters
    if (filterOptions.length > 0) {
      filtered = filtered.filter(book => {
        return filterOptions.every(option => {
          switch (option) {
            case 'available':
              return book.isAvailable;
            case 'digital':
              return book.hasDigitalCopy;
            case 'physical':
              return book.hasPhysicalCopy;
            case 'free':
              return book.isFree;
            default:
              return true;
          }
        });
      });
    }
  
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book?.bookTitle?.toLowerCase().includes(query) ||
        book?.authorName?.toLowerCase().includes(query) ||
        book?.bookDescription?.toLowerCase().includes(query)
      );
    }
  
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'titleAsc':
          return (a?.bookTitle || '').localeCompare(b?.bookTitle || '');
        case 'titleDesc':
          return (b?.bookTitle || '').localeCompare(a?.bookTitle || '');
        case 'popular':
          return (b?.borrowCount || 0) - (a?.borrowCount || 0);
        case 'rating':
          return (b?.rating || 0) - (a?.rating || 0);
        default:
          return 0;
      }
    });
  
    setFilteredBooks(filtered);
    setCurrentPage(0);
  };

  useEffect(() => {
    filterBooks();
  }, [searchQuery, selectedCategory, selectedLanguage, sortBy, books]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLanguage('all');
    setSortBy('relevance');
    localSetFilterOptions([]);
    setPrintType('all');
  };

  const handlePageChange = (direction) => {
    if (direction === 'next' && (currentPage + 1) * PAGE_SIZE < filteredBooks.length) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
    scrollToTop();
  };

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

  const booksToDisplay = Array.isArray(filteredBooks) 
    ? filteredBooks.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)
    : [];

  const handleCardClick = (bookId, event) => {
    if (event.target.closest('button')) {
      return;
    }
    navigate(`/reader/browse/local/${bookId}`);
  };





  return (
    <div className="p-6" ref={contentRef}>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/reader/browse')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Libraries
        </button>
      </div>
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Local Library</h1>
        <p className="text-gray-400 mt-2">Browse our collection of books</p>
      </header>
    
      <LocalBooksFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterOptions={filterOptions}
        localSetFilterOptions={localSetFilterOptions}
        printType={printType}
        setPrintType={setPrintType}
        showAdvancedFilters={showAdvancedFilters}
        setShowAdvancedFilters={setShowAdvancedFilters}
        resetFilters={resetFilters}
      />

      {error && (
        <div className="text-red-400 text-center mb-8 bg-red-900/30 p-4 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : booksToDisplay.length === 0 ? (
        <div className="text-center text-gray-400 my-8">
          No books found matching your criteria
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {booksToDisplay.map((book) => (
              <Card 
                key={book._id} 
                className="group cursor-pointer overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                onClick={(e) => handleCardClick(book._id, e)}
              >
                <div className="flex h-72"> {/* Increased height to accommodate new information */}
                  {/* Image column */}
                  <div className="w-40 p-3 flex-shrink-0">
                    <div className="w-full h-full overflow-hidden rounded-lg shadow-md">
                      <img
                        src={book.imageURL || "/api/placeholder/200/300"}
                        alt={book.bookTitle}
                        className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  
                  {/* Content column */}
                  <div className="flex-1 p-3 flex flex-col">
                    {/* Book Details */}
                    <div className="space-y-2 mb-3">
                      <h3 className="font-semibold text-lg text-white line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
                        {book.bookTitle}
                      </h3>
                      <p className="text-gray-300 text-sm font-medium line-clamp-1">
                        By {book.authorName}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {formatDate(book.publishDate)}
                      </p>
                    </div>

                    {/* Library Information */}
                    <div className="space-y-2 mb-4 border-t border-gray-700/50 pt-2">
                      {/* Library Name & Address */}
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-300">{book.libraryName}</p>
                          <p className="text-xs text-gray-400 line-clamp-1">{book.libraryAddress}</p>
                        </div>
                      </div>
                      
                      {/* Copies Available */}
                      <div className="flex items-center gap-2">
                        <BookCopy className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-300">
                          {book.quantity || 0} {book.quantity === 1 ? 'copy' : 'copies'} available
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="flex-1">
                        <SaveButton book={book} />
                      </div>
                      <div className="flex-1">
                        <BorrowButton book={book} />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {Array.isArray(filteredBooks) && filteredBooks.length > 0 && (
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 0}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg disabled:bg-gray-700 disabled:text-gray-400 hover:bg-blue-700 transition-colors duration-200"
              >
                Previous
              </button>
              <span className="py-2.5 text-white">
                Page {currentPage + 1} of {Math.ceil(filteredBooks.length / PAGE_SIZE)}
              </span>
              <button 
                onClick={() => handlePageChange('next')}
                disabled={(currentPage + 1) * PAGE_SIZE >= filteredBooks.length}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg disabled:bg-gray-700 disabled:text-gray-400 hover:bg-blue-700 transition-colors duration-200"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center group"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
        </button>
      )}
    </div>
  );
};