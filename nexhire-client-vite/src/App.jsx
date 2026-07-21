import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import Landing from './pages/Landing';

import HiringDashboard from './pages/HiringDashboard';

import JobListings from './pages/jobs/JobListings';
import JobDetail from './pages/jobs/JobDetail';
import ApplyJobPage from './pages/jobs/ApplyJobPage';
import CreateJob from './pages/jobs/CreateJob';
import RecruiterDashboard from './pages/jobs/RecruiterDashboard';
import CandidateDashboard from './pages/jobs/CandidateDashboard';

import MyApplications from './pages/applications/MyApplications';
import JobApplicants from './pages/applications/JobApplicants';

import AdminDashboard from './pages/admin/AdminDashboard';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';



function AppRoutes() {

  return (

    <Routes>


      {/* Public Routes */}

      <Route 
        path="/" 
        element={<Landing />} 
      />


      <Route 
        path="/login" 
        element={<Login />} 
      />


      <Route 
        path="/register" 
        element={<Register />} 
      />


      <Route 
        path="/unauthorized" 
        element={<Unauthorized />} 
      />



      {/* Jobs */}

      <Route 
        path="/jobs" 
        element={<JobListings />} 
      />


      <Route 
        path="/jobs/:id" 
        element={<JobDetail />} 
      />



      {/* Apply Job Page */}

      <Route
        path="/jobs/:id/apply"
        element={
          <ProtectedRoute allowedRoles={['candidate']}>

            <ApplyJobPage />

          </ProtectedRoute>
        }
      />



      {/* Candidate Dashboard */}

      <Route
        path="/candidate/dashboard"
        element={
          <ProtectedRoute allowedRoles={['candidate']}>

            <CandidateDashboard />

          </ProtectedRoute>
        }
      />



      {/* Recruiter Dashboard */}

      <Route
        path="/recruiter/dashboard"
        element={
          <ProtectedRoute allowedRoles={['recruiter']}>

            <RecruiterDashboard />

          </ProtectedRoute>
        }
      />



      {/* Create Job */}

      <Route
        path="/jobs/create"
        element={
          <ProtectedRoute allowedRoles={['recruiter']}>

            <CreateJob />

          </ProtectedRoute>
        }
      />



      {/* Candidate Applications */}

      <Route
        path="/applications/my"
        element={
          <ProtectedRoute allowedRoles={['candidate']}>

            <MyApplications />

          </ProtectedRoute>
        }
      />



      {/* Recruiter Applicants */}

      <Route
        path="/jobs/:id/applicants"
        element={
          <ProtectedRoute allowedRoles={['recruiter']}>

            <JobApplicants />

          </ProtectedRoute>
        }
      />



      {/* Hiring Manager */}

      <Route
        path="/hiring/dashboard"
        element={
          <ProtectedRoute allowedRoles={['hiring_manager']}>

            <HiringDashboard />

          </ProtectedRoute>
        }
      />



      {/* Admin */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>

            <AdminDashboard />

          </ProtectedRoute>
        }
      />



      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>

            <AdminDashboard />

          </ProtectedRoute>
        }
      />



      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={['admin']}>

            <AnalyticsDashboard />

          </ProtectedRoute>
        }
      />


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