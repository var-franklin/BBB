import React, { useState, useContext } from 'react';
import { Upload, BookOpen, User, Image, FileText, Link, LibraryBig, CalendarDays } from 'lucide-react';
import { AuthContext } from '../../utils/AuthProvider';
import { useNavigate } from 'react-router-dom';
import UploadBookPDF from './UploadBookPDF';

const UploadBook = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);

    const bookCategories = [
        "Fiction", "Non-Fiction", "History", "Education", "Sci-Fi",
        "Fantasy", "Romance", "Children's", "Mystery", "Thriller",
        "Adventure", "Bibliography", "Memoirs", "Religion", "Art and Design"
    ];

    const [selectedBookCategory, setSelectedBookCategory] = useState(bookCategories[0]);

    const handleBookSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);
    
        const form = event.target;
    
        if (!user || !user._id) {
            setError("User not authenticated");
            setIsSubmitting(false);
            return;
        }
    
        try {
            let pdfFileUrl = form.bookPDFURL.value;
            
            // If there's a PDF file, upload it first
            if (pdfFile) {
                const formData = new FormData();
                formData.append('pdf', pdfFile);
                
                const uploadResponse = await fetch("http://localhost:5000/upload-pdf", {
                    method: 'POST',
                    body: formData,
                    // Add progress tracking if needed
                });
                
                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload PDF file');
                }
                
                const { fileUrl } = await uploadResponse.json();
                pdfFileUrl = fileUrl; // Use the uploaded file URL
            }
    
            const bookObj = {
                bookTitle: form.bookTitle.value,
                authorName: form.authorName.value,
                imageURL: form.imageURL.value,
                bookDescription: form.bookDescription.value,
                category: form.categoryName.value,
                bookPDFURL: form.bookPDFURL.value,
                quantity: parseInt(form.quantity.value),
                publishDate: form.publishDate.value,
                libraryId: user._id
              };
    
            const response = await fetch("http://localhost:5000/upload-book", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookObj)
            });
    
            if (!response.ok) {
                throw new Error('Failed to upload book');
            }
    
            alert("Book Uploaded Successfully!");
            navigate('/librarian/manage-books');
        } catch (error) {
            setError(error.message);
            alert("Error uploading book: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Upload Book</h1>
                <p className="text-gray-400">Add a new book to your library collection</p>
            </header>

            <form onSubmit={handleBookSubmit} className="space-y-6 bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border border-gray-700 ">
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
                            <Link className="w-4 h-4" />
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


                <UploadBookPDF 
                onPDFChange={(file) => setPdfFile(file)}
                initialPDF={book?.pdfFile?.url} // For EditBooks.jsx
                />

                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
                >
                    <Upload className="w-4 h-4" />
                    Upload Book
                </button>
            </form>
        </div>
    );
};

export default UploadBook;