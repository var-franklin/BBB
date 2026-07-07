import React, { useEffect, useState } from 'react'

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      const toggleVisibility = () => {
        setIsVisible(window.pageYOffset > 300);
      };
  
      window.addEventListener('scroll', toggleVisibility);
      return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);
  
    const ScrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };
  
    return (
      <button
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-blue-500 text-white shadow-lg transition-all duration-300 hover:bg-blue-600 focus:outline-none z-[60] ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        onClick={ScrollToTop}
        aria-label="Scroll to top"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    );
  };

export default ScrollToTop