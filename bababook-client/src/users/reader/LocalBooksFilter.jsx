import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const LocalBooksFilter = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedLanguage,
  setSelectedLanguage,
  sortBy,
  setSortBy,
  filterOptions,
  localSetFilterOptions,
  printType,
  setPrintType,
  showAdvancedFilters,
  setShowAdvancedFilters,
  resetFilters,
  handleSearch
}) => {
  const categories = [
    'all',
    'Classic',
    'Fiction',
    'Non-Fiction',
    'Science',
    'History',
    'Biography',
    'Fantasy',
    'Mystery',
    'Romance',
    'Thriller',
    'Horror',
    'Poetry',
    'Drama',
    'Children'
  ];

  const languages = [
    'all',
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Chinese',
    'Japanese',
    'Korean',
    'Russian'
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'titleAsc', label: 'Title (A-Z)' },
    { value: 'titleDesc', label: 'Title (Z-A)' },
    { value: 'dateNew', label: 'Newest First' },
    { value: 'dateOld', label: 'Oldest First' }
  ];

  const filterOptionsList = [
    { value: 'available', label: 'Available for Borrowing' },
    { value: 'digital', label: 'Digital Copy Available' },
    { value: 'physical', label: 'Physical Copy Available' },
    { value: 'free', label: 'Free to Borrow' }
  ];

  const printTypes = [
    { value: 'all', label: 'All' },
    { value: 'books', label: 'Books' },
    { value: 'magazines', label: 'Magazines' }
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
              placeholder="Search by title, author, or description..."
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

        {(showAdvancedFilters || searchQuery || selectedCategory !== 'all' || selectedLanguage !== 'all') && (
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Genre' : category}
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
                {languages.map(language => (
                  <option key={language} value={language}>
                    {language === 'all' ? 'All Languages' : language}
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
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
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
                        localSetFilterOptions(prev => [...prev, option.value]);
                      } else {
                        localSetFilterOptions(prev => prev.filter(val => val !== option.value));
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

export default LocalBooksFilter;