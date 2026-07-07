import React, { useState, useEffect } from 'react';
import { Book, MapPin, Phone, Mail, User, Search } from 'lucide-react';
import { TextInput, Button } from 'flowbite-react';
import FindLibrariesMapView from './FindLibrariesMapView';

const FindLibraries = () => {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedView, setSelectedView] = useState('grid');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const response = await fetch('http://localhost:5000/all-libraries');
        const data = await response.json();
        const approvedLibraries = data
          .filter(user => user.userType === 'librarian' && user.status === 'approved')
          .map(library => ({
            ...library,
            totalBooks: Math.floor(Math.random() * 50000) + 10000
          }));
        setLibraries(approvedLibraries);
      } catch (error) {
        console.error('Error fetching libraries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraries();
  }, []);

  const filteredLibraries = libraries.filter(library => {
    const searchMatch = library.libraryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       library.libraryAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return searchMatch;
    if (selectedFilter === 'large') return searchMatch && library.totalBooks >= 30000;
    if (selectedFilter === 'medium') return searchMatch && library.totalBooks >= 15000 && library.totalBooks < 30000;
    return searchMatch && library.totalBooks < 15000;
  });

  const LibraryCard = ({ library }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500/30 
                    hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Book className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">{library.libraryName}</h3>
        </div>
        
        <div className="space-y-3 text-gray-300">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <p>{library.libraryAddress}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <p>Managed by: {library.firstName} {library.lastName}</p>
          </div>
          
          {library.phoneNumber && (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <p>{library.phoneNumber}</p>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <p>{library.email}</p>
          </div>

          <div className="pt-3 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <Book className="w-5 h-5 text-blue-400" />
              <span className="text-lg font-semibold text-blue-400">
                {library.totalBooks.toLocaleString()} Books
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SearchAndFilters = () => (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="text-gray-400 w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search libraries by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <Button
            color={selectedView === 'grid' ? 'blue' : 'gray'}
            onClick={() => setSelectedView('grid')}
          >
            Grid View
          </Button>
          <Button
            color={selectedView === 'map' ? 'blue' : 'gray'}
            onClick={() => setSelectedView('map')}
          >
            Map View
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {['all', 'large', 'medium', 'small'].map((filter) => (
          <Button
            key={filter}
            color={selectedFilter === filter ? 'blue' : 'gray'}
            onClick={() => setSelectedFilter(filter)}
            size="sm"
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)} {filter !== 'all' && 'Libraries'}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-700 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Find Libraries</h1>
        <p className="text-gray-400">
          Discover and connect with libraries in your area. Browse through our network of partner 
          libraries and explore their collections.
        </p>
      </div>

      <SearchAndFilters />

      {selectedView === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLibraries.map((library) => (
            <LibraryCard key={library._id} library={library} />
          ))}
        </div>
      ) : (
        <FindLibrariesMapView 
          libraries={filteredLibraries} 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      )}

      {!loading && filteredLibraries.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300">No libraries found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default FindLibraries;