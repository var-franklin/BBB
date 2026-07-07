import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [loading, setLoading] = useState(false);

  // Create new user
  const createUser = async (email, password, userData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          ...userData
        }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.user)); // Save user to localStorage
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logOut = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('user'); // Add this line
      setUser(null);
      localStorage.removeItem('user-preferences');
      return true; // Add a return value to indicate success
    } finally {
      setLoading(false);
    }
  };

  const authInfo = {
    user,
    createUser,
    login,
    logOut,
    loading
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;