import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

// ─── Placeholder dashboards (other members replace these) ───────────────────
const CandidateDashboard = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <h1 className="text-3xl font-bold text-blue-900">Candidate Dashboard</h1>
  </div>
);

const RecruiterDashboard = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <h1 className="text-3xl font-bold text-blue-900">Recruiter Dashboard</h1>
  </div>
);

const HiringDashboard = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <h1 className="text-3xl font-bold text-blue-900">Hiring Manager Dashboard</h1>
  </div>
);

const AdminDashboard = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <h1 className="text-3xl font-bold text-blue-900">Admin Dashboard</h1>
  </div>
);
// ────────────────────────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected routes */}
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