// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';  // This should work now

// Create the Auth Context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app load, read token from localStorage and fetch user
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch current user from the API
  const fetchUser = async (authToken) => {
    try {
      // Set the token in axios headers for this request
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      const response = await api.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // If token is invalid, clear localStorage and reset state
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = (newToken, userData) => {
    // Save token to localStorage
    localStorage.setItem('token', newToken);
    
    // Update state
    setToken(newToken);
    setUser(userData);
    
    // Set the token in axios headers for future requests
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    
    // Reset state
    setToken(null);
    setUser(null);
    
    // Remove token from axios headers
    delete api.defaults.headers.common['Authorization'];
    
    // Redirect to login
    window.location.href = '/login';
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export default for convenience
export default AuthProvider;