import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const GoogleBooksFilter = ({
  searchQuery,
  setSearchQuery,
  selectedGenre,
  setSelectedGenre,
  selectedLanguage,
  setSelectedLanguage,
  selectedOrderBy,
  setSelectedOrderBy,
  printType,
  setPrintType,
  filterOptions,
  setFilterOptions,
  showAdvancedFilters,
  setShowAdvancedFilters,
  handleSearch,
  resetFilters
}) => {
  const genres = [
    'all',
    'fiction',
    'mystery',
    'romance',
    'science',
    'history',
    'biography',
    'fantasy',
    'thriller',
    'horror',
    'poetry',
    'drama',
    'children'
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' }
  ];

  // Updated orderByOptions to use title sorting instead of author
  const orderByOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'newest', label: 'Publication Date (Newest)' },
    { value: 'oldest', label: 'Publication Date (Oldest)' },
    { value: 'title_asc', label: 'Title (A-Z)' },
    { value: 'title_desc', label: 'Title (Z-A)' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const printTypes = [
    { value: 'all', label: 'All' },
    { value: 'books', label: 'Books' },
    { value: 'magazines', label: 'Magazines' }
  ];

  const filterOptionsList = [
    { value: 'partial', label: 'Preview Available' },
    { value: 'full', label: 'Full Text Available' },
    { value: 'ebooks', label: 'Google eBooks' },
    { value: 'free-ebooks', label: 'Free eBooks' },
    { value: 'pd-books', label: 'Public Domain Books' }  
  ];

  return (
    <div className="mb-8 space-y-4 bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
      {/* Basic Search */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              className="w-full pl-10 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
        >
          <Filter className="w-5 h-5" />
          {showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
        >
          <Search className="w-5 h-5" />
          Search
        </button>

        {(showAdvancedFilters || searchQuery || selectedGenre !== 'all' || selectedLanguage || filterOptions.length > 0) && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
            Reset All
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Genre</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre === 'all' ? 'All Genres' : genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Languages</option>
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Print Type</label>
              <select
                value={printType}
                onChange={(e) => setPrintType(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {printTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Order By</label>
              <select
                value={selectedOrderBy}
                onChange={(e) => setSelectedOrderBy(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {orderByOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Availability Options</label>
            <div className="flex flex-wrap gap-3">
              {filterOptionsList.map(option => (
                <label key={option.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filterOptions.includes(option.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilterOptions(prev => [...prev, option.value]);
                      } else {
                        setFilterOptions(prev => prev.filter(val => val !== option.value));
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
                  />
                  <span className="text-gray-300">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleBooksFilter;