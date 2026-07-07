import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Search, Filter, Plus, X, BookOpen, User, Image, FileText, Link as LinkIcon, LibraryBig, Upload, ChevronUp, ChevronDown, CalendarDays } from 'lucide-react';
import { AuthContext } from '../../utils/AuthProvider';

const ManageBooks = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0,
    booksPerPage: 10
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookCategory, setSelectedBookCategory] = useState('Fiction');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  const bookCategories = [
    "Fiction", "Non-Fiction", "History", "Education", "Sci-Fi",
    "Fantasy", "Romance", "Children's", "Mystery", "Thriller",
    "Adventure", "Bibliography", "Memoirs", "Religion", "Art and Design"
  ];

  useEffect(() => {
    if (user && user._id) {
      fetchBooks();
    }
  }, [user, pagination.currentPage]);

  const fetchBooks = async () => {
    if (!user || !user._id) {
      console.error("No user ID available");
      return;
    }
    
    try {
      const response = await fetch(
        `http://localhost:5000/all-books?libraryId=${user._id}&page=${pagination.currentPage}&limit=${pagination.booksPerPage}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      setBooks(data.books);
      setPagination(prev => ({
        ...prev,
        totalBooks: data.pagination.totalBooks,
        totalPages: data.pagination.totalPages
      }));
    } catch (error) {
      console.error('Error fetching books:', error);
      alert("Error loading books. Please try again.");
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedBooks = [...books].sort((a, b) => {
      const aValue = a[key]?.toString().toLowerCase() || '';
      const bValue = b[key]?.toString().toLowerCase() || '';

      if (direction === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    setBooks(sortedBooks);
  };

  const handleBulkDelete = async () => {
    if (!selectedBooks.length) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedBooks.length} books?`)) {
      try {
        const response = await fetch('http://localhost:5000/books/bulk-delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookIds: selectedBooks,
            libraryId: user._id
          })
        });

        if (!response.ok) {
          throw new Error('Failed to delete books');
        }

        setBooks(books.filter(book => !selectedBooks.includes(book._id)));
        setSelectedBooks([]);
        alert("Books deleted successfully");
      } catch (error) {
        console.error('Error deleting books:', error);
        alert("Error deleting books. Please try again.");
      }
    }
  };

  // Filter books based on search term and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedBooks(filteredBooks.map(book => book._id));
    } else {
      setSelectedBooks([]);
    }
  };

  const handleSelectBook = (bookId) => {
    setSelectedBooks(prev => {
      if (prev.includes(bookId)) {
        return prev.filter(id => id !== bookId);
      }
      return [...prev, bookId];
    });
  };


  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  const handleDelete = (id, libraryId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
        fetch(`http://localhost:5000/book/${id}?libraryId=${libraryId}`, {
            method: 'DELETE',
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to delete book');
            }
            return res.json();
        })
        .then(data => {
            setBooks(books.filter(book => book._id !== id));
            alert("Book deleted successfully");
        })
        .catch(error => {
            alert("Error deleting book. Please try again.");
        });
    }
  };

  const handleBookSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
  
    const bookObj = {
      bookTitle: form.bookTitle.value,
      authorName: form.authorName.value,
      imageURL: form.imageURL.value,
      bookDescription: form.bookDescription.value,
      category: form.categoryName.value,
      bookPDFURL: form.bookPDFURL.value,
      quantity: parseInt(form.quantity.value),
      libraryId: user._id
    };
  
    fetch("http://localhost:5000/upload-book", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookObj)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to upload book');
        }
        return res.json();
      })
      .then(data => {
        alert("Book Uploaded Successfully!");
        form.reset();
        setIsModalOpen(false);
        fetchBooks();
      })
      .catch(error => {
        console.error('Error uploading book:', error);
        alert("Error uploading book. Please try again.");
      });
  };

  const categories = ['All', ...new Set(books.map(book => book.category))];

  return (
    <div className="p-6 bg-gray-900">
      {/* Header section */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Manage Books</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} /> Add Book
          </button>
        </div>
        <p className="text-gray-400 mt-2">
          Total Books: {pagination.totalBooks} | Page {pagination.currentPage} of {pagination.totalPages}
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="w-48">
          <select
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {bookCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        {selectedBooks.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Trash2 size={20} />
            Delete Selected ({selectedBooks.length})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-gray-800">
            <tr>
              <th className="px-6 py-3">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedBooks.length === filteredBooks.length && filteredBooks.length > 0}
                  className="w-4 h-4 rounded border-gray-600"
                />
              </th>
              {[
                { key: 'bookTitle', label: 'Title' },
                { key: 'authorName', label: 'Author' },
                { key: 'category', label: 'Category' },
                { key: 'quantity', label: 'Quantity' }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="px-6 py-3 cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center gap-2">
                    {label}
                    {sortConfig.key === key && (
                      sortConfig.direction === 'asc' ? 
                        <ChevronUp size={16} /> : 
                        <ChevronDown size={16} />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book._id} className="border-t border-gray-700 hover:bg-gray-800">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedBooks.includes(book._id)}
                    onChange={() => handleSelectBook(book._id)}
                    className="w-4 h-4 rounded border-gray-600"
                  />
                </td>
                <td className="px-6 py-4">{book.bookTitle}</td>
                <td className="px-6 py-4">{book.authorName}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                    {book.category}
                  </span>
                </td>
                <td className="px-6 py-4">{book.quantity}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link
                      to={`/librarian/edit-books/${book._id}`}
                      className="p-2 hover:bg-gray-700 rounded"
                    >
                      <Edit2 size={16} className="text-blue-400" />
                    </Link>
                    <button
                      onClick={() => handleDelete(book._id, user._id)}
                      className="p-2 hover:bg-gray-700 rounded"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-400">
          Showing {Math.min(((pagination.currentPage - 1) * pagination.booksPerPage) + 1, pagination.totalBooks)} to {Math.min(pagination.currentPage * pagination.booksPerPage, pagination.totalBooks)} of {pagination.totalBooks} entries
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 rounded bg-gray-800 text-white disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setPagination(prev => ({ ...prev, currentPage: i + 1 }))}
              className={`px-3 py-1 rounded ${
                pagination.currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-1 rounded bg-gray-800 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Add New Book</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <form onSubmit={handleBookSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Book Title */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Book Title
                    </div>
                  </label>
                  <input
                    type="text"
                    name="bookTitle"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter book title"
                    required
                  />
                </div>

                {/* Author Name */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Author Name
                    </div>
                  </label>
                  <input
                    type="text"
                    name="authorName"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter author name"
                    required
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Book Image URL
                    </div>
                  </label>
                  <input
                    type="text"
                    name="imageURL"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter image URL"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    <div className="flex items-center gap-2">
                      <LibraryBig className="w-4 h-4" />
                      Book Category
                    </div>
                  </label>
                  <select
                    name="categoryName"
                    value={selectedBookCategory}
                    onChange={(e) => setSelectedBookCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {bookCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>


              {/* Quantity */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Quantity
                  </div>
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="0"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter book quantity"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    Publication Date
                  </div>
                </label>
                <input
                  type="date"
                  name="publishDate"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Book Description */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Book Description
                  </div>
                </label>
                <textarea
                  name="bookDescription"
                  rows="5"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter book description..."
                  required
                />
              </div>

              {/* PDF URL */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Book PDF URL
                  </div>
                </label>
                <input
                  type="text"
                  name="bookPDFURL"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter PDF URL"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
                >
                  <Upload className="w-4 h-4" />
                  Upload Book
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;