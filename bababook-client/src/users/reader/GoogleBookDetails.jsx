import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft,
  BookOpen,
  Calendar,
  Tag,
  ExternalLink,
  Star,
  Globe,
  BookText,
  Languages,
  ChevronDown,
  ChevronUp,
  Quote,
  Users,
  AlertCircle,
  Share2,
  Bookmark
} from 'lucide-react';
import { Alert } from 'flowbite-react';
import SaveButton from './SaveButton';

const GoogleBookDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const book = location.state?.bookData;
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showCopyIndicator, setShowCopyIndicator] = useState(false);

  const handleBackClick = () => {
    navigate('/reader/browse/google', { 
      state: { filters: location.state?.filters }
    });
  };


  const handleReadNow = () => {
    navigate(`/reader/browse/google/${book.id}/read`, { 
      state: { 
        previousLocation: location,
        bookData: book,
        filters: location.state?.filters 
      }
    });
  };

  if (!book) {
    return (
      <div className="p-6">
        <Alert color="failure" className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span className="font-medium">Book details not found</span>
        </Alert>
      </div>
    );
  }

  const {
    volumeInfo: {
      title,
      subtitle,
      authors,
      publishedDate,
      description,
      categories,
      imageLinks,
      previewLink,
      publisher,
      pageCount,
      language,
      averageRating,
      ratingsCount,
      industryIdentifiers
    }
  } = book;

  const getRatingStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-yellow-400' 
            : i === Math.floor(rating) && rating % 1 >= 0.5
            ? 'text-yellow-400 fill-yellow-400/50'
            : 'text-gray-600'
        }`}
      />
    ));
  };

  const MetadataItem = ({ icon: Icon, label, value }) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <span className="text-sm text-gray-400">{label}:</span>
        <span className="text-sm text-gray-200">{value}</span>
      </div>
    );
  };

  const ActionButton = ({ icon: Icon, label, href, onClick, primary = false }) => {
    const className = `
      flex items-center justify-center gap-2 px-4 py-2 rounded-lg
      transition-all duration-200 hover:scale-[1.02] text-sm font-medium
      ${primary 
        ? 'bg-blue-600 hover:bg-blue-700 text-white'
        : 'bg-gray-700/50 hover:bg-gray-600/50 text-white'}
    `;
    
    if (href) {
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={className}
        >
          <Icon className="w-4 h-4" />
          {label}
        </a>
      );
    }
    
    return (
      <button onClick={onClick} className={className}>
        <Icon className="w-4 h-4" />
        {label}
      </button>
    );
  };

  const getOptimizedImageUrl = (imageLinks) => {
    if (!imageLinks) return "/api/placeholder/400/600";
    
    // Try to get the best quality image available
    // First try extraLarge, then large, then thumbnail
    const imageUrl = 
      imageLinks.extraLarge || 
      imageLinks.large || 
      imageLinks.medium ||
      imageLinks.thumbnail ||
      imageLinks.smallThumbnail;

    if (!imageUrl) return "/api/placeholder/400/600";

    // Some URLs come with edge=curl parameter which can affect quality
    // Remove it and other potentially problematic parameters
    let optimizedUrl = imageUrl.split('&')[0];

    // Try to improve quality by modifying zoom level only if it's a Google Books URL
    if (optimizedUrl.includes('books.google.com')) {
      // Start with highest quality, but keep original URL as fallback
      const originalUrl = optimizedUrl;
      
      // Try zoom=3 first
      optimizedUrl = optimizedUrl.replace('zoom=1', 'zoom=3');
      
      // If zoom parameter wasn't present, try to add it
      if (optimizedUrl === originalUrl && !optimizedUrl.includes('zoom=')) {
        optimizedUrl = optimizedUrl + '&zoom=3';
      }
    }

    return optimizedUrl;
  };

  const handleShare = async () => {
    try {
      // Use the preview link or construct a URL to your app
      const shareUrl = book.volumeInfo?.previewLink || window.location.href;
      await navigator.clipboard.writeText(shareUrl);
      
      // Show the indicator
      setShowCopyIndicator(true);
      
      // Hide after 2 seconds
      setTimeout(() => {
        setShowCopyIndicator(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
              <div className="flex gap-2">
                <ActionButton 
                  icon={Share2} 
                  label={showCopyIndicator ? "Copied!" : "Share"} 
                  onClick={handleShare}
                />
              </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Book Cover and Actions */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                <img
                  src={getOptimizedImageUrl(imageLinks)}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // If the high quality image fails, fallback to thumbnail
                    if (imageLinks?.thumbnail && e.target.src !== imageLinks.thumbnail) {
                      e.target.src = imageLinks.thumbnail;
                    } else {
                      e.target.src = "/api/placeholder/400/600";
                    }
                  }}
                />
              </div>

              <div className="flex flex-col gap-3">
                <ActionButton
                  icon={BookOpen}
                  label="Read Now"
                  onClick={handleReadNow}
                  primary
                />
                {previewLink && (
                  <ActionButton
                    icon={ExternalLink}
                    label="Preview on Google Books"
                    onClick={() => window.open(previewLink, '_blank')}
                  />
                )}
                <SaveButton 
                  book={{
                    _id: book.id,
                    bookTitle: book.volumeInfo.title,
                    authorName: book.volumeInfo.authors?.join(", ") || "Unknown Author",
                    imageURL: getOptimizedImageUrl(book.volumeInfo.imageLinks),
                    category: book.volumeInfo.categories?.[0],
                    bookDescription: book.volumeInfo.description,
                    bookPDFURL: book.accessInfo?.pdf?.downloadLink
                  }}
                  source="google"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Book Details */}
          <div className="lg:w-2/3 space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-white">{title}</h1>
              {subtitle && <p className="text-xl text-gray-400">{subtitle}</p>}
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <p className="text-gray-300">
                    {authors?.join(', ') || 'Unknown Author'}
                  </p>
                </div>
                {categories?.map(category => (
                  <span key={category} className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
                    {category}
                  </span>
                ))}
              </div>

              {averageRating && (
                <div className="flex items-center gap-3 bg-gray-800/30 rounded-lg p-3">
                  <div className="flex gap-1">{getRatingStars(averageRating)}</div>
                  <div className="text-sm">
                    <span className="font-bold text-white">{averageRating.toFixed(1)}</span>
                    <span className="text-gray-400 ml-1">
                      ({ratingsCount?.toLocaleString()} ratings)
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-800/30 rounded-lg p-4 space-y-3">
              <MetadataItem icon={Globe} label="Publisher" value={publisher} />
              <MetadataItem icon={BookText} label="Pages" value={pageCount && `${pageCount.toLocaleString()}`} />
              <MetadataItem 
                icon={Languages} 
                label="Language" 
                value={language && new Intl.DisplayNames(['en'], { type: 'language' }).of(language)} 
              />
              <MetadataItem 
                icon={Calendar} 
                label="Published" 
                value={publishedDate && new Date(publishedDate).toLocaleDateString()} 
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Quote className="w-5 h-5 text-blue-400" />
                About this book
              </h2>
              
              <div className="relative">
                <p className={`text-gray-300 leading-relaxed ${!showFullDescription && 'line-clamp-4'}`}>
                  {description || 'No description available'}
                </p>
                
                {description && description.length > 300 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-2 text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 text-sm"
                  >
                    <span>{showFullDescription ? 'Show less' : 'Show more'}</span>
                    {showFullDescription ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleBookDetails;