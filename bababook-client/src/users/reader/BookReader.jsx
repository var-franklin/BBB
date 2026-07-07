import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Eye, 
  Book, 
  AlertCircle, 
  ExternalLink,
  ArrowLeft,
  Type,
  Loader2
} from 'lucide-react';
import { Alert, Dropdown } from 'flowbite-react';

const BookReader = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readingMode, setReadingMode] = useState('preview');

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch book data');
        }

        const data = await response.json();
        setBook(data);

        // Determine reading mode based on viewability
        if (data.accessInfo?.viewability === 'ALL_PAGES') {
          // Open Google Books web reader in a new tab if available
          if (data.accessInfo?.webReaderLink) {
            window.open(data.accessInfo.webReaderLink, '_blank', 'noopener,noreferrer');
            // Instead of navigating back, just close this component
            navigate(-1);
            return;
          }
          setReadingMode('preview');
        } else if (data.accessInfo?.viewability === 'PARTIAL') {
          setReadingMode('preview');
        } else {
          setReadingMode('unavailable');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookData();
    }
  }, [id, navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="failure" className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <span className="font-medium">{error}</span>
      </Alert>
    );
  }

  const ReadingModeHeader = () => {
    const modes = {
      preview: { icon: Eye, text: 'Preview Mode', color: 'text-yellow-500' },
      unavailable: { icon: Lock, text: 'Not Available', color: 'text-red-500' }
    };

    const { icon: Icon, text, color } = modes[readingMode] || modes.unavailable;

    return (
      <div className={`flex items-center gap-2 ${color} mb-4`}>
        <Icon className="w-5 h-5" />
        <span className="font-medium">{text}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>

            <h1 className="text-lg font-medium truncate max-w-[200px] md:max-w-md">
              {book?.volumeInfo?.title || 'Reading View'}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <ReadingModeHeader />
        
        <div className="space-y-4">
          <Alert color="warning" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">
              {readingMode === 'unavailable' 
                ? 'This book is not available for reading. You can purchase it or find it at your local library.'
                : 'This book is available in preview mode only. Visit Google Books to access the full content.'}
            </span>
          </Alert>
          
          {book?.volumeInfo?.previewLink && (
            <a
              href={book.volumeInfo.previewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-500 hover:text-blue-400"
            >
              <ExternalLink className="w-4 h-4" />
              View on Google Books
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookReader;