import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { AuthContext } from '../utils/AuthProvider';

const Logout = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [progress, setProgress] = useState(0);
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    const cleanup = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('user-preferences');
      sessionStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });
    };

    const handleLogout = async () => {
      setIsVisible(true);
      
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 4;
        });
      }, 50);

      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await logOut();
        cleanup();
        setStatus('success');
        
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      } catch (error) {
        console.error("Logout error:", error);
        setStatus('error');
        setTimeout(() => {
          cleanup();
          navigate('/');
        }, 2000);
      }

      return () => clearInterval(progressInterval);
    };

    handleLogout();
  }, [logOut, navigate]);

  const getStatusContent = () => {
    switch (status) {
      case 'loading':
        return {
          icon: <LogOut className="w-12 h-12 text-blue-400" />,
          title: "See You Soon!",
          message: "We're safely signing you out..."
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-12 h-12 text-green-400" />,
          title: "Successfully Signed Out",
          message: "Thank you for using BaBaBook!"
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-12 h-12 text-red-400" />,
          title: "Oops!",
          message: "There was an issue signing you out, but we'll redirect you to safety."
        };
      default:
        return {
          icon: <LogOut className="w-12 h-12 text-blue-400" />,
          title: "Logging Out",
          message: "Please wait..."
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-blue-500/5 to-transparent">
        <div className="absolute inset-0 opacity-30 bg-[url('/grid.svg')]"></div>
      </div>
      
      <div className={`text-center transform transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="flex justify-center mb-8">
          <div className={`p-4 rounded-full transition-all duration-300 ${
            status === 'success' ? 'bg-green-500/10' :
            status === 'error' ? 'bg-red-500/10' :
            'bg-blue-500/10'
          }`}>
            {statusContent.icon}
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">
          {statusContent.title}
        </h1>
        
        <p className="text-gray-400 text-lg mb-8 max-w-md">
          {statusContent.message}
        </p>
        
        {status === 'loading' && (
          <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto mb-8 overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        
        <button
          onClick={() => navigate('/')}
          className="mt-8 group inline-flex items-center px-6 py-3 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Return to Home
          <ArrowRight className="ml-2 w-4 h-4 transform transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default Logout;