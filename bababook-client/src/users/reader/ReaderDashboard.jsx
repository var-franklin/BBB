import React, { useState, useEffect } from 'react';
import { Book, BookOpen, Clock, Heart, Library, ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StyleSheet = () => (
  <style>
    {`
      @keyframes fadeInScale {
        0% { 
          opacity: 0; 
          transform: scale(0.95);
        }
        100% { 
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes slideInFromBottom {
        0% { 
          opacity: 0;
          transform: translateY(20px);
        }
        100% { 
          opacity: 1;
          transform: translateY(0);
        }
      }

      .dashboard-header {
        animation: fadeInScale 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }

      .stat-card {
        animation: slideInFromBottom 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) forwards;
        opacity: 0;
      }

      .reading-section {
        animation: slideInFromBottom 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) forwards;
        opacity: 0;
        animation-delay: 0.2s;
      }

      .saved-section {
        animation: slideInFromBottom 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) forwards;
        opacity: 0;
        animation-delay: 0.4s;
      }
    `}
  </style>
);

const ReaderDashboard = () => {
  const stats = [
    { title: 'Currently Borrowed', value: '3', icon: Book, change: '2 due next week' },
    { title: 'Saved Books', value: '12', icon: Heart, change: '+3 this month' },
    { title: 'Reading History', value: '45', icon: Clock, change: 'Last 6 months' },
    { title: 'Local Libraries', value: '8', icon: Library, change: 'Within 10km' },
  ];

  const currentlyReading = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      dueDate: "2024-01-15",
      progress: 65,
      coverColor: "from-blue-400 to-purple-500",
      library: "Central Library"
    },
    {
      id: 2,
      title: "Dune",
      author: "Frank Herbert",
      dueDate: "2024-01-20",
      progress: 30,
      coverColor: "from-orange-400 to-red-500",
      library: "Science Fiction Library"
    },
    {
      id: 3,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      dueDate: "2024-01-18",
      progress: 85,
      coverColor: "from-green-400 to-emerald-600",
      library: "Fantasy Library"
    }
  ];

  const savedBooks = [
    {
      id: 1,
      title: "1984",
      author: "George Orwell",
      savedDate: "2024-01-01",
      platform: "Google Books",
      coverColor: "from-red-400 to-pink-500"
    },
    {
      id: 2,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      savedDate: "2024-01-05",
      platform: "Project Gutenberg",
      coverColor: "from-purple-400 to-indigo-500"
    },
    {
      id: 3,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      savedDate: "2024-01-08",
      platform: "Apple Books",
      coverColor: "from-yellow-400 to-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6 lg:p-8">
      <StyleSheet />
      
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-500/10 via-blue-500/5 to-transparent -z-10">
        <div className="absolute inset-0 opacity-30 bg-[url('/grid.svg')]"></div>
      </div>

      {/* Dashboard Header */}
      <header className="dashboard-header mb-12">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
          Reader Dashboard
        </h1>
        <p className="text-gray-400 mt-2">Track your reading journey and manage your books</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-card group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 
            hover:border-blue-500 hover:transform hover:scale-105 transition-all duration-300
            hover:shadow-lg hover:shadow-blue-500/10"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg transform transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-500/20">
                <stat.icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
              </div>
              <span className="text-blue-400 text-sm group-hover:text-blue-300">{stat.change}</span>
            </div>
            <h3 className="text-gray-400 text-sm group-hover:text-gray-300">{stat.title}</h3>
            <p className="text-white text-2xl font-semibold mt-2 group-hover:text-blue-300">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Currently Reading Section */}
        <div className="reading-section bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Currently Reading</h2>
            <Link 
              to="/reader/borrowed-books" 
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center group"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {currentlyReading.map((book) => (
              <div 
                key={book.id} 
                className="group bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800 
                hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-16 rounded-lg bg-gradient-to-br ${book.coverColor} flex-shrink-0`} />
                    <div>
                      <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors">{book.title}</h3>
                      <p className="text-gray-400 text-sm">{book.author}</p>
                      <p className="text-gray-500 text-sm mt-1">{book.library}</p>
                    </div>
                  </div>
                  <span className="text-red-400 text-sm">Due: {book.dueDate}</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{book.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300"
                      style={{ width: `${book.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Books Section */}
        <div className="saved-section bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Saved Books</h2>
            <Link 
              to="/reader/saved-books" 
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center group"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {savedBooks.map((book) => (
              <div 
                key={book.id} 
                className="group bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800 
                hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-16 rounded-lg bg-gradient-to-br ${book.coverColor} flex-shrink-0`} />
                    <div>
                      <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors">{book.title}</h3>
                      <p className="text-gray-400 text-sm">{book.author}</p>
                      <p className="text-blue-400/80 text-sm mt-1">{book.platform}</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-2">Saved on: {book.savedDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderDashboard;