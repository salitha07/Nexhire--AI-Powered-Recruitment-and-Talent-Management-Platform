// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import AuthProvider from './context/AuthContext';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';  // ← This should work now

import ProtectedRoute from './components/ProtectedRoute';

// Placeholder Dashboard Components
const CandidateDashboard = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-[#1a3c5e]">Candidate Dashboard</h1>
      <p className="text-gray-600 mt-2">Welcome to your candidate dashboard. This page will be replaced with the actual implementation.</p>
    </div>
  </div>
);

const RecruiterDashboard = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-[#1a3c5e]">Recruiter Dashboard</h1>
      <p className="text-gray-600 mt-2">Welcome to your recruiter dashboard. This page will be replaced with the actual implementation.</p>
    </div>
  </div>
);

const HiringDashboard = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-[#1a3c5e]">Hiring Manager Dashboard</h1>
      <p className="text-gray-600 mt-2">Welcome to your hiring manager dashboard. This page will be replaced with the actual implementation.</p>
    </div>
  </div>
);

const AdminDashboard = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-[#1a3c5e]">Admin Dashboard</h1>
      <p className="text-gray-600 mt-2">Welcome to the admin dashboard. This page will be replaced with the actual implementation.</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Protected Routes */}
          <Route
            path="/candidate/dashboard"
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/hiring/dashboard"
            element={
              <ProtectedRoute allowedRoles={['hiring_manager']}>
                <HiringDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;