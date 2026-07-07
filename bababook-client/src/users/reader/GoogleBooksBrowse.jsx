import React, { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowUp, ArrowLeft, Calendar, Tag, Star } from 'lucide-react';
import { Card } from 'flowbite-react';
import GoogleBooksFilter from './GoogleBooksFilter';
import SaveButton from './SaveButton';

const API_KEY = "AIzaSyDSJE4-Y1shdZ-80FQ7Dc_6c3ajSuaqNO8";
const PAGE_SIZE = 20;

export default function GoogleBooksBrowse() {
  const location = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(location.state?.filters?.searchQuery || '');
  const [selectedGenre, setSelectedGenre] = useState(location.state?.filters?.selectedGenre || 'all');
  const [selectedLanguage, setSelectedLanguage] = useState(location.state?.filters?.selectedLanguage || '');
  const [selectedOrderBy, setSelectedOrderBy] = useState(location.state?.filters?.selectedOrderBy || 'relevance');
  const [printType, setPrintType] = useState(location.state?.filters?.printType || 'all');
  const [filterOptions, setFilterOptions] = useState(location.state?.filters?.filterOptions || []);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(location.state?.filters?.showAdvancedFilters || false);
  const [currentPage, setCurrentPage] = useState(location.state?.filters?.currentPage || 0);
  const [startIndex, setStartIndex] = useState(location.state?.filters?.startIndex || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

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
    const currentFilters = {
      searchQuery,
      selectedGenre,
      selectedLanguage,
      selectedOrderBy,
      printType,
      filterOptions,
      showAdvancedFilters,
      currentPage,
      startIndex
    };
    
    navigate(location.pathname, { 
      replace: true,
      state: { ...location.state, filters: currentFilters }
    });
  }, [
    searchQuery,
    selectedGenre,
    selectedLanguage,
    selectedOrderBy,
    printType,
    filterOptions,
    showAdvancedFilters,
    currentPage,
    startIndex
  ]);
 
  const fetchBooks = useCallback(async (index, retryCount = 0) => {
    if (loading) return;
  
    setLoading(true);
    setError("");
  
    try {
      let queryString = searchQuery.trim() || '*'; 

      if (selectedGenre !== 'all') {
        queryString += `+subject:"${selectedGenre}"`;
      }
  
      const params = new URLSearchParams({
        q: queryString,
        startIndex: index,
        maxResults: PAGE_SIZE, // Reduced from PAGE_SIZE * 2 to avoid rate limiting
        key: API_KEY
      });
  
      // Add language restriction if selected
      if (selectedLanguage) {
        params.append('langRestrict', selectedLanguage);
      }
  
      // Add print type if not 'all'
      if (printType !== 'all') {
        params.append('printType', printType);
      }
  
      if (filterOptions.includes('pd-books')) {
        params.append('filter', 'free-ebooks');
        fetchedBooks = fetchedBooks.filter(book => 
          book.accessInfo?.publicDomain === true && 
          book.accessInfo?.viewability === 'ALL_PAGES'
        );
      }

      if (filterOptions.includes('pd-books')) {
        params.append('filter', 'free-ebooks');
        // Additional client-side filtering for public domain
        fetchedBooks = fetchedBooks.filter(book => 
          book.accessInfo?.publicDomain === true
        );
      }
  
      // Handle ordering
      if (['relevance', 'newest'].includes(selectedOrderBy)) {
        params.append('orderBy', selectedOrderBy);
      }
  
      // Add delay before retry attempts
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000 * retryCount)); // Exponential backoff
      }
  
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?${params.toString()}`
      );
  
      let fetchedBooks = response.data.items || [];
  
      // Client-side sorting for cases not supported by the API
      switch (selectedOrderBy) {
        case 'oldest':
          fetchedBooks.sort((a, b) => {
            const dateA = new Date(a.volumeInfo.publishedDate || '9999');
            const dateB = new Date(b.volumeInfo.publishedDate || '9999');
            return dateA - dateB;
          });
          break;
        case 'title_asc':
          fetchedBooks.sort((a, b) => {
            const titleA = (a.volumeInfo.title || '').toLowerCase();
            const titleB = (b.volumeInfo.title || '').toLowerCase();
            return titleA.localeCompare(titleB);
          });
          break;
        case 'title_desc':
          fetchedBooks.sort((a, b) => {
            const titleA = (a.volumeInfo.title || '').toLowerCase();
            const titleB = (b.volumeInfo.title || '').toLowerCase();
            return titleB.localeCompare(titleA);
          });
          break;
        case 'rating':
          fetchedBooks.sort((a, b) => {
            const ratingA = a.volumeInfo.averageRating || 0;
            const ratingB = b.volumeInfo.averageRating || 0;
            return ratingB - ratingA;
          });
          break;
        case 'popular':
          fetchedBooks.sort((a, b) => {
            const ratingsCountA = a.volumeInfo.ratingsCount || 0;
            const ratingsCountB = b.volumeInfo.ratingsCount || 0;
            return ratingsCountB - ratingsCountA;
          });
          break;
      }
  
      // Apply additional client-side filtering
      if (filterOptions.length > 1) {
        fetchedBooks = fetchedBooks.filter(book => {
          return filterOptions.every(option => {
            switch (option) {
              case 'partial':
                return book.accessInfo?.viewability === 'PARTIAL';
              case 'full':
                return book.accessInfo?.viewability === 'ALL_PAGES';
              case 'ebooks':
                return book.saleInfo?.isEbook;
              case 'free-ebooks':
                return book.saleInfo?.isEbook && book.saleInfo?.saleability === 'FREE';
              default:
                return true;
            }
          });
        });
      }
  
      // Additional language filtering for consistency
      if (selectedLanguage) {
        fetchedBooks = fetchedBooks.filter(book => 
          book.volumeInfo?.language?.toLowerCase() === selectedLanguage.toLowerCase()
        );
      }
  
      // Update books state
      if (index === 0) {
        setBooks(fetchedBooks);
      } else {
        const existingIds = new Set(books.map(book => book.id));
        const newBooks = fetchedBooks.filter(book => !existingIds.has(book.id));
        setBooks(prevBooks => [...prevBooks, ...newBooks]);
      }
  
    } catch (error) {
      console.error("Error fetching books:", error);
      
      // Handle rate limiting
      if (error.response?.status === 429) {
        if (retryCount < 3) { // Maximum 3 retry attempts
          console.log(`Rate limited. Retrying attempt ${retryCount + 1}...`);
          setError(`Rate limited. Retrying in ${2 * (retryCount + 1)} seconds...`);
          return fetchBooks(index, retryCount + 1);
        } else {
          setError("Too many requests. Please wait a moment before trying again.");
        }
      } else {
        setError(`Failed to fetch books: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, searchQuery, selectedGenre, selectedLanguage, selectedOrderBy, printType, filterOptions, PAGE_SIZE, books]);
 
  useEffect(() => {
    fetchBooks(0);
  }, []);

  const handleSearch = () => {
    setBooks([]);
    setCurrentPage(0);
    setStartIndex(0);
    fetchBooks(0);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('all');
    setSelectedLanguage('');
    setSelectedOrderBy('relevance');
    setPrintType('all');
    setFilterOptions([]);
    setCurrentPage(0);
    setStartIndex(0);
    fetchBooks(0);
  };

  const handleNextPage = () => {
    const newStartIndex = startIndex + PAGE_SIZE;
    setStartIndex(newStartIndex);
    fetchBooks(newStartIndex);
    setCurrentPage(prev => prev + 1);
    scrollToTop();
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      scrollToTop();
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Date not available';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date not available';
    }
  };

  const handleCardClick = (book, event) => {
    if (event.target.closest('button')) {
      return;
    }
    navigate(`/reader/browse/google/${book.id}`, { 
      state: { 
        bookData: book,
        previousPath: location.pathname,
        filters: {
          searchQuery,
          selectedGenre,
          selectedLanguage,
          selectedOrderBy,
          printType,
          filterOptions,
          showAdvancedFilters,
          currentPage,
          startIndex
        }
      } 
    });
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < fullStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
          }`}
        />
      );
    }
    return stars;
  };

  const getOptimizedImageUrl = (imageLinks) => {
    if (!imageLinks) return "/api/placeholder/400/600";
    
    // Try to get the best quality image available
    // First try extraLarge, then large, then thumbnail
    const imageUrl = 
      imageLinks.extraLarge || 
      imageLinks.large || 
      imageLinks.medium ||
      imageLinks.thumbnail ||
      imageLinks.smallThumbnail;
  
    if (!imageUrl) return "/api/placeholder/400/600";
  
    // Some URLs come with edge=curl parameter which can affect quality
    // Remove it and other potentially problematic parameters
    let optimizedUrl = imageUrl.split('&')[0];
  
    // Try to improve quality by modifying zoom level only if it's a Google Books URL
    if (optimizedUrl.includes('books.google.com')) {
      // Start with highest quality, but keep original URL as fallback
      const originalUrl = optimizedUrl;
      
      // Try zoom=3 first
      optimizedUrl = optimizedUrl.replace('zoom=1', 'zoom=3');
      
      // If zoom parameter wasn't present, try to add it
      if (optimizedUrl === originalUrl && !optimizedUrl.includes('zoom=')) {
        optimizedUrl = optimizedUrl + '&zoom=3';
      }
    }
  
    return optimizedUrl;
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
        <h1 className="text-3xl font-bold text-white">Google Books Library</h1>
        <p className="text-gray-400 mt-2">Search millions of books from Google Books</p>
      </header>

      <GoogleBooksFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        selectedOrderBy={selectedOrderBy}
        setSelectedOrderBy={setSelectedOrderBy}
        printType={printType}
        setPrintType={setPrintType}
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
        showAdvancedFilters={showAdvancedFilters}
        setShowAdvancedFilters={setShowAdvancedFilters}
        handleSearch={handleSearch}
        resetFilters={resetFilters}
      />

      {error && (
        <div className="text-red-400 text-center mb-8 bg-red-900/30 p-4 rounded-lg border border-red-500/20">
          {error}
          <button 
            onClick={() => setError("")} 
            className="ml-4 text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {loading && books.length === 0 && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {books.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE).map((book) => (
          <Card 
            key={book.id}
            className="group cursor-pointer overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
            onClick={(e) => handleCardClick(book, e)}
          >
            <div className="flex flex-col h-full">
              <div className="flex h-56">
                <div className="w-40 p-3 flex-shrink-0">
                  <div className="relative w-full h-full overflow-hidden rounded-lg shadow-md group-hover:shadow-blue-500/20">
                    <img
                      src={getOptimizedImageUrl(book.volumeInfo.imageLinks)}
                      alt={book.volumeInfo.title}
                      className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        // If the high quality image fails, fallback to thumbnail
                        if (book.volumeInfo.imageLinks?.thumbnail && 
                            e.target.src !== book.volumeInfo.imageLinks.thumbnail) {
                          e.target.src = book.volumeInfo.imageLinks.thumbnail;
                        } else {
                          e.target.src = "/api/placeholder/200/300";
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex-1 p-3 flex flex-col">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-white line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
                      {book.volumeInfo.title}
                    </h3>
                    <p className="text-gray-300 text-sm font-medium line-clamp-1">
                      By {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(book.volumeInfo.publishedDate)}
                    </div>
                    
                    {book.volumeInfo.categories && (
                      <div className="flex items-center gap-2 text-xs">
                        <Tag className="w-3 h-3 text-blue-400" />
                        <span className="text-blue-400">{book.volumeInfo.categories[0]}</span>
                      </div>
                    )}

                    {book.volumeInfo.averageRating && (
                      <div className="flex items-center gap-1">
                        {getRatingStars(book.volumeInfo.averageRating)}
                        <span className="text-gray-400 text-xs ml-1">
                          ({book.volumeInfo.ratingsCount?.toLocaleString() || 0})
                        </span>
                      </div>
                    )}
                  </div>

                  {book.volumeInfo.description && (
                    <p className="text-gray-400 text-xs mt-2 line-clamp-2">
                      {book.volumeInfo.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-3 pt-0">
                <SaveButton 
                  book={{
                    _id: book.id,
                    bookTitle: book.volumeInfo.title,
                    authorName: book.volumeInfo.authors?.join(", ") || "Unknown Author",
                    imageURL: book.volumeInfo.imageLinks?.thumbnail,
                    category: book.volumeInfo.categories?.[0],
                    bookDescription: book.volumeInfo.description,
                    bookPDFURL: book.accessInfo?.pdf?.downloadLink
                  }} 
                  source="google"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {books.length > 0 && (
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg disabled:bg-gray-700 disabled:text-gray-400 hover:bg-blue-700 transition-colors duration-200"
          >
            Previous
          </button>
          <span className="py-2.5 text-white">
            Page {currentPage + 1}
          </span>
          <button 
            onClick={handleNextPage}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Next
          </button>
        </div>
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
}