// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#1a3c5e] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is provided and user's role is not in the list
  // Redirect to login or home instead of unauthorized
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Option 1: Redirect to login
    return <Navigate to="/login" replace />;
    
    // Option 2: Redirect to home page
    // return <Navigate to="/" replace />;
    
    // Option 3: Show an error message
    // return (
    //   <div className="min-h-screen flex justify-center items-center">
    //     <div className="text-center">
    //       <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
    //       <p className="text-gray-600 mt-2">You don't have permission to view this page.</p>
    //     </div>
    //   </div>
    // );
  }

  // If all checks pass, render the children
  return children;
};

export default ProtectedRoute;