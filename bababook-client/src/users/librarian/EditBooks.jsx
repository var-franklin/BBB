import React, { useState } from 'react';
import { useLoaderData, useParams, useNavigate } from 'react-router-dom';
import { Save, BookOpen, User, Image, FileText, Link, LibraryBig, ArrowLeft, CalendarDays } from 'lucide-react';

const EditBooks = () => {
    const { id } = useParams();
    const book = useLoaderData();
    const navigate = useNavigate();
    
    const bookCategories = [
        "Fiction", "Non-Fiction", "History", "Education", "Sci-Fi",
        "Fantasy", "Romance", "Children's", "Mystery", "Thriller",
        "Adventure", "Bibliography", "Memoirs", "Religion", "Art and Design",
        "Classic"
    ];

    const [selectedBookCategory, setSelectedBookCategory] = useState(book?.category || bookCategories[0]);

    // Format the date for the input field
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    if (!book) {
        return (
            <div className="p-6 text-center text-white">
                <h2 className="text-xl">Error loading book data</h2>
                <p className="text-gray-400">Unable to find the requested book</p>
            </div>
        );
    }

    const handleUpdate = (event) => {
        event.preventDefault();
        const form = event.target;
    
        const updateBookObj = {
            bookTitle: form.bookTitle.value,
            authorName: form.authorName.value,
            imageURL: form.imageURL.value,
            bookDescription: form.bookDescription.value,
            category: form.categoryName.value,
            bookPDFURL: form.bookPDFURL.value,
            quantity: parseInt(form.quantity.value),
            publishDate: form.publishDate.value,
            libraryId: book.libraryId
        };
    
        fetch(`http://localhost:5000/book/${id}?libraryId=${book.libraryId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateBookObj)
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to update book');
            }
            return res.json();
        })
        .then(data => {
            alert("Book Updated Successfully!");
            navigate('/librarian/manage-books');
        })
        .catch(error => {
            alert("Error updating book. Please try again.");
        });
    };

    const handleCancel = () => {
        navigate('/librarian/manage-books');
    };

    return (
        <div className="p-6">
            <header className="mb-8">
                <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors duration-200"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Books
                </button>
                <h1 className="text-3xl font-bold text-white mb-2">Edit Book</h1>
                <p className="text-gray-400">Update book information in your library</p>
            </header>

            <form onSubmit={handleUpdate} className="space-y-6 bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border border-gray-700">
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
                            defaultValue={book.bookTitle}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            defaultValue={book.authorName}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            defaultValue={book.imageURL}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        defaultValue={book.quantity || 0}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Publish Date */}
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
                        defaultValue={formatDateForInput(book.publishDate)}
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
                        defaultValue={book.bookDescription}
                        rows="5"
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* PDF URL */}
                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        <div className="flex items-center gap-2">
                            <Link className="w-4 h-4" />
                            Book PDF URL
                        </div>
                    </label>
                    <input
                        type="text"
                        name="bookPDFURL"
                        defaultValue={book.bookPDFURL}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
                    >
                        <Save className="w-4 h-4" />
                        Update Book
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditBooks;