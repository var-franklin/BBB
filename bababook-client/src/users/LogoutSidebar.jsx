import React from 'react';
import { LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StyleSheet = () => (
  <style>
    {`
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
        100% {
          transform: scale(1);
        }
      }

      .logout-pulse {
        animation: pulse 2s infinite;
      }

      .logout-icon {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .logout-button:hover .logout-icon {
        transform: translateX(-2px);
      }

      .logout-button:hover .chevron-icon {
        transform: translateX(2px);
      }
    `}
  </style>
);

const LogoutSidebar = ({ className }) => {
  const navigate = useNavigate();
  
  const handleLogoutClick = () => {
    navigate('/auth/logout');
  };

  return (
    <>
      <StyleSheet />
      <button
        onClick={handleLogoutClick}
        className={`logout-button flex items-center justify-between px-4 py-3 text-gray-300 
        rounded-lg transition-all duration-300 group border border-transparent
        hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-500/5
        hover:border-red-500/20 hover:shadow-lg hover:shadow-red-500/10 ${className}`}
      >
        <div className="flex items-center space-x-3">
          <LogOut className="w-5 h-5 logout-icon group-hover:text-red-400 transition-colors duration-300" />
          <span className="group-hover:text-red-400 transition-colors duration-300">Log Out</span>
        </div>
        <ChevronRight className="w-4 h-4 chevron-icon opacity-0 group-hover:opacity-100 text-red-400 transition-all duration-300" />
      </button>
    </>
  );
};

export default LogoutSidebar;