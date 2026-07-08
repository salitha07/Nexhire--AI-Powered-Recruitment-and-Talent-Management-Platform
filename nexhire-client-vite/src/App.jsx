import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import Landing from './pages/Landing';

import JobListings from './pages/jobs/JobListings';
import JobDetail from './pages/jobs/JobDetail';
import CreateJob from './pages/jobs/CreateJob';
import RecruiterDashboard from './pages/jobs/RecruiterDashboard';
import CandidateDashboard from './pages/jobs/CandidateDashboard';

const HiringDashboard = () => (
  <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '24px', color: '#1e40af' }}>
    Hiring Manager Dashboard
  </div>
);

const AdminDashboard = () => (
  <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '24px', color: '#1e40af' }}>
    Admin Dashboard
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/jobs" element={<JobListings />} />
      <Route path="/jobs/:id" element={<JobDetail />} />

      {/* Protected routes */}
      <Route path="/candidate/dashboard" element={
        <ProtectedRoute allowedRoles={['candidate']}>
          <CandidateDashboard />
        </ProtectedRoute>
      } />
      <Route path="/recruiter/dashboard" element={
        <ProtectedRoute allowedRoles={['recruiter']}>
          <RecruiterDashboard />
        </ProtectedRoute>
      } />
      <Route path="/jobs/create" element={
        <ProtectedRoute allowedRoles={['recruiter']}>
          <CreateJob />
        </ProtectedRoute>
      } />
      <Route path="/hiring/dashboard" element={
        <ProtectedRoute allowedRoles={['hiring_manager']}>
          <HiringDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;