import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LibraryBig, Globe } from 'lucide-react';
import { Card } from 'flowbite-react';

const BrowseLibrary = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Browse Libraries</h1>
        <p className="text-gray-400 mt-2">Choose a library to explore books</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Local Library Card */}
        <Card 
          className="group cursor-pointer overflow-hidden bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
          onClick={() => navigate('/reader/browse/local')}
        >
          <div className="p-6">
            <div className="mb-4 w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <LibraryBig className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">Local Library</h2>
            <p className="text-gray-400 mb-4">
              Browse our curated collection of books available in our local library system. Find books added by our librarians and discover new reads.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Access to physical books
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Curated by our librarians
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Easy reservation system
              </li>
            </ul>
          </div>
        </Card>

        {/* Google Books Card */}
        <Card 
          className="group cursor-pointer overflow-hidden bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
          onClick={() => navigate('/reader/browse/google')}
        >
          <div className="p-6">
            <div className="mb-4 w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Globe className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">Google Books Library</h2>
            <p className="text-gray-400 mb-4">
              Explore millions of books from Google Books. Access digital previews, reviews, and detailed information about books worldwide.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Vast digital collection
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Book previews available
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Global book database
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BrowseLibrary;