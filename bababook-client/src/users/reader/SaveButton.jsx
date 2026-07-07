import React, { useState, useEffect, useContext } from 'react';
import { BookmarkIcon } from 'lucide-react';
import { AuthContext } from '../../utils/AuthProvider';

const SaveButton = ({ book, source = 'local' }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`http://localhost:5000/reader/saved-books/${user._id}`);
        const savedBooks = await response.json();
        
        const isBookSaved = savedBooks.some(saved => 
          saved.bookData.id === book._id && saved.bookData.source === source
        );
        setIsSaved(isBookSaved);
      } catch (err) {
        console.error('Error checking saved status:', err);
      }
    };

    checkIfSaved();
  }, [user, book._id, source]);

  const saveBook = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      setError(null);

      if (isSaved) {
        await fetch(`http://localhost:5000/reader/saved-books/${user._id}/${book._id}`, {
          method: 'DELETE',
        });
        setIsSaved(false);
      } else {
        // Prepare book data based on source
        const bookData = source === 'google' ? {
          id: book._id,
          title: book.volumeInfo?.title,
          author: book.volumeInfo?.authors?.join(", ") || "Unknown Author",
          thumbnail: book.volumeInfo?.imageLinks?.thumbnail,
          category: book.volumeInfo?.categories?.[0],
          description: book.volumeInfo?.description,
          pdfUrl: book.accessInfo?.pdf?.downloadLink,
          // Store additional Google Books specific data
          publishedDate: book.volumeInfo?.publishedDate,
          publisher: book.volumeInfo?.publisher,
          pageCount: book.volumeInfo?.pageCount,
          language: book.volumeInfo?.language,
          averageRating: book.volumeInfo?.averageRating,
          ratingsCount: book.volumeInfo?.ratingsCount,
          previewLink: book.volumeInfo?.previewLink,
          // Store all image links
          imageLinks: book.volumeInfo?.imageLinks,
          // Store the complete volume info for reconstruction
          volumeInfo: book.volumeInfo,
          accessInfo: book.accessInfo,
          source: 'google'
        } : {
          id: book._id,
          title: book.bookTitle,
          author: book.authorName,
          thumbnail: book.imageURL,
          category: book.category,
          description: book.bookDescription,
          pdfUrl: book.bookPDFURL,
          source: 'local'
        };

        const response = await fetch('http://localhost:5000/reader/save-book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user._id,
            bookData
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to save book');
        }
        setIsSaved(true);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error saving book:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      onClick={saveBook}
      disabled={isSaving}
      className={`inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] ${
        isSaved 
          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30' 
          : 'bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 border border-gray-700'
      }`}
    >
      <BookmarkIcon 
        className={`w-4 h-4 mr-1.5 transition-transform duration-200 ${
          isSaved ? 'fill-blue-400 text-blue-400' : 'text-gray-400'
        }`}
      />
      <span className="relative top-px">
        {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
      </span>
    </button>
  );
};

export default SaveButton;