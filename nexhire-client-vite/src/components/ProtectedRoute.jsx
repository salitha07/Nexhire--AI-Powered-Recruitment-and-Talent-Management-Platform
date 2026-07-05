// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component that guards routes based on authentication and role
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authorized
 * @param {string[]} props.allowedRoles - Array of allowed roles (e.g., ['candidate', 'admin'])
 * 
 * @example
 * // Single role
 * <ProtectedRoute allowedRoles={['candidate']}>
 *   <CandidateDashboard />
 * </ProtectedRoute>
 * 
 * @example
 * // Multiple roles
 * <ProtectedRoute allowedRoles={['recruiter', 'hiring_manager']}>
 *   <RecruiterDashboard />
 * </ProtectedRoute>
 * 
 * @example
 * // No role restriction (just requires authentication)
 * <ProtectedRoute>
 *   <UserProfile />
 * </ProtectedRoute>
 */
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
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If all checks pass, render the children
  return children;
};

// Make sure we export default
export default ProtectedRoute;