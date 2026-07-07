import React, { useContext, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthProvider';

const LibrarianWaitingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  
  // Get status from either location state or user context
  const status = location.state?.status || user?.status || 'pending';

  useEffect(() => {
    if (user && user.userType === 'librarian' && user.status === 'approved') {
      navigate('/librarian/dashboard');
    }
  }, [user, navigate]);

  const statusConfig = {
    pending: {
      icon: Clock,
      title: 'Application Under Review',
      description: 'Your librarian account application is currently being reviewed by our administrators.',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    rejected: {
      icon: XCircle,
      title: 'Application Rejected',
      description: 'Unfortunately, your librarian account application has been rejected. Please contact support for more information.',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10'
    },
    approved: {
      icon: CheckCircle2,
      title: 'Application Approved',
      description: 'Your librarian account has been approved! You can now access your dashboard.',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    }
  };

  const config = statusConfig[status];

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-blue-500/5 to-transparent">
        <div className="absolute inset-0 opacity-30 bg-[url('/grid.svg')]"></div>
      </div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700 p-8 text-center">
          <div className={`w-16 h-16 mx-auto mb-6 rounded-full ${config.bgColor} flex items-center justify-center`}>
            <config.icon className={`w-8 h-8 ${config.color}`} />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">{config.title}</h2>
          <p className="text-gray-400 mb-6">{config.description}</p>
          
          {status === 'pending' && (
            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">What happens next?</h3>
                <ul className="text-sm text-gray-400 text-left space-y-2">
                  <li>• Our admin team will review your application</li>
                  <li>• You'll receive an email notification once reviewed</li>
                  <li>• Approved accounts can access the librarian dashboard</li>
                </ul>
              </div>
              
              <button
                onClick={() => navigate('/')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3 transition-colors"
              >
                Return to Homepage
              </button>
            </div>
          )}
          
          {status === 'rejected' && (
            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">What can you do?</h3>
                <ul className="text-sm text-gray-400 text-left space-y-2">
                  <li>• Review the application requirements</li>
                  <li>• Contact support for more information</li>
                  <li>• Submit a new application with updated information</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  navigate('/auth/sign-up');
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 transition-colors"
              >
                Apply Again
              </button>
            </div>
          )}
          
          {status === 'approved' && (
            <button
              onClick={() => navigate('/auth/sign-in')}
              className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-3 transition-colors"
            >
              Sign In to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibrarianWaitingPage;