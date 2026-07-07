import React from 'react';
import { BookOpen } from 'lucide-react';

const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full">
      {/* Main loading container */}
      <div className="relative">
        {/* Pulsing circle background */}
        <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/20" />
        <div className="absolute inset-0 animate-pulse rounded-full bg-blue-600/10" />
        
        {/* Rotating book icon */}
        <div className="relative z-10 animate-spin-slow">
          <BookOpen className="w-12 h-12 text-blue-500" />
        </div>
      </div>

      {/* Loading text with shimmer effect */}
      <div className="mt-6 relative overflow-hidden">
        <div className="text-lg font-medium text-gray-400">
          Loading books for you...
        </div>
        <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>

      {/* Loading progress dots */}
      <div className="flex gap-2 mt-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
            style={{
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

const style = document.createElement('style');
style.textContent = `
  @keyframes spin-slow {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes shimmer {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(200%);
    }
  }
`;
document.head.appendChild(style);

export default LoadingAnimation;