import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, BarChart3 } from 'lucide-react';
import readingProgressService from '../services/readingProgress';
import readingHistoryService from './ReadingHistory/ReadingHistoryService';

const ReadingProgressTracker = ({ bookId, initialProgress = 0 }) => {
  const [progress, setProgress] = useState(initialProgress);
  const [readingTime, setReadingTime] = useState(0);
  const [readingSpeed, setReadingSpeed] = useState(0);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    const savedProgress = readingProgressService.getBookProgress(bookId);
    setProgress(savedProgress.completionPercentage || 0);

    // Start reading time tracker
    const newTimer = setInterval(() => {
      setReadingTime(prev => prev + 1);
    }, 1000);
    setTimer(newTimer);

    return () => {
      if (timer) clearInterval(timer);
      // Save final progress when component unmounts
      updateProgress(progress);
    };
  }, [bookId]);

  // Calculate reading speed every minute
  useEffect(() => {
    if (readingTime % 60 === 0 && readingTime > 0) {
      const speed = Math.round((progress * 100) / (readingTime / 60));
      setReadingSpeed(speed);
    }
  }, [readingTime, progress]);

  const updateProgress = (newProgress) => {
    setProgress(newProgress);
    readingProgressService.updateProgress(bookId, {
      completionPercentage: newProgress,
      lastRead: new Date().toISOString()
    });
    readingHistoryService.addToHistory({
      id: bookId,
      readingProgress: newProgress
    });
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">{Math.round(progress)}%</span>
            </div>
            
            <div className="h-2 w-32 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {formatTime(readingTime)}
            </div>
            
            {readingSpeed > 0 && (
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {readingSpeed} words/min
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingProgressTracker;