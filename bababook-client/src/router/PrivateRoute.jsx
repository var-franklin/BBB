import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../utils/AuthProvider';

const roleBasedRedirects = {
  admin: '/admin/dashboard',
  librarian: '/librarian/dashboard',
  reader: '/reader/dashboard'
};

const allowedPaths = {
  admin: ['/admin'],
  librarian: ['/librarian'],
  reader: ['/reader']
};

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  const basePath = '/' + location.pathname.split('/')[1];
  const hasAccess = allowedPaths[user.userType]?.includes(basePath);

  if (!hasAccess) {
    const correctPath = roleBasedRedirects[user.userType];
    return <Navigate to={correctPath} replace />;
  }

  if (user.userType === 'librarian') {
    if (user.status === 'pending') {
      return <Navigate to="/auth/waiting" state={{ status: 'pending' }} replace />;
    }
    if (user.status === 'rejected') {
      return <Navigate to="/auth/waiting" state={{ status: 'rejected' }} replace />;
    }
  }

  return children;
};

export default PrivateRoute;