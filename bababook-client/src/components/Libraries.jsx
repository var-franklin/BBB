import React, { useState, useEffect } from 'react';
import { Book, MapPin, Phone, Mail, User } from 'lucide-react';
import LibraryModal from './LibraryModal';

const Libraries = () => {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const response = await fetch('http://localhost:5000/all-libraries');
        const data = await response.json();
        // Filter only approved librarian accounts and add mock total books
        const approvedLibraries = data
          .filter(user => user.userType === 'librarian' && user.status === 'approved')
          .map(library => ({
            ...library,
            totalBooks: Math.floor(Math.random() * 50000) + 10000 // Random number between 10,000 and 60,000
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

  const handleLibraryClick = (library) => {
    setSelectedLibrary(library);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-500/10 to-transparent py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to BaBaBook Libraries
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Discover local libraries where you can borrow physical copies of your favorite books. 
              Browse through our network of partner libraries and explore their collections.
            </p>
          </div>
        </div>
      </div>

      {/* Libraries Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center text-gray-400">Loading libraries...</div>
        ) : libraries.length === 0 ? (
          <div className="text-center text-gray-400">No libraries available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {libraries.map((library) => (
              <div 
                key={library._id} 
                className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => handleLibraryClick(library)}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Book className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-semibold text-white">{library.libraryName}</h3>
                  </div>
                  
                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                      <p>{library.libraryAddress}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <p>Managed by: {library.firstName} {library.lastName}</p>
                    </div>
                    
                    {library.phoneNumber && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <p>{library.phoneNumber}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
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
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <LibraryModal 
        library={selectedLibrary}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Libraries;