// src/components/Navbar.jsx
// Reusable authenticated navbar — matches Landing.jsx design system exactly
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 80px',
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  navLogoIcon: {
    width: '34px',
    height: '34px',
    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  navLogoText: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e3a5f',
    letterSpacing: '-0.5px',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  navLink: {
    fontSize: '14px',
    color: '#64748b',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  userName: {
    fontSize: '14px',
    color: '#1e293b',
    fontWeight: '600',
    background: '#f1f5f9',
    padding: '6px 14px',
    borderRadius: '20px',
  },
  logoutBtn: {
    padding: '8px 20px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    background: 'white',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  loginBtn: {
    padding: '8px 20px',
    border: '1.5px solid #1e40af',
    borderRadius: '8px',
    background: 'white',
    color: '#1e40af',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  primaryBtn: {
    padding: '8px 20px',
    border: 'none',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  roleBadge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
};

const roleBadgeColors = {
  recruiter:      { background: '#dbeafe', color: '#1e40af' },
  candidate:      { background: '#dcfce7', color: '#166534' },
  hiring_manager: { background: '#fef3c7', color: '#92400e' },
  admin:          { background: '#fce7f3', color: '#9d174d' },
};

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const badgeColor = roleBadgeColors[user?.role] || {};

  return (
    <nav style={styles.navbar}>
      {/* Logo */}
      <Link to="/" style={styles.navLogo}>
        <div style={styles.navLogoIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <span style={styles.navLogoText}>Nexhire</span>
      </Link>

      {/* Right Side */}
      <div style={styles.navRight}>
        {/* Browse Jobs — always visible */}
        <Link to="/jobs" style={styles.navLink}>Browse Jobs</Link>

        {isAuthenticated ? (
          <>
            {/* Role-specific links */}
            {user?.role === 'recruiter' && (
              <>
                <Link to="/recruiter/dashboard" style={styles.navLink}>My Jobs</Link>
                <Link to="/jobs/create" style={styles.primaryBtn}>+ Post Job</Link>
              </>
            )}
            {user?.role === 'candidate' && (
              <Link to="/candidate/dashboard" style={styles.navLink}>Dashboard</Link>
            )}
            {user?.role === 'hiring_manager' && (
              <Link to="/hiring/dashboard" style={styles.navLink}>Dashboard</Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin/dashboard" style={styles.navLink}>Admin</Link>
            )}

            {/* Role badge */}
            <span style={{ ...styles.roleBadge, ...badgeColor }}>
              {user?.role?.replace('_', ' ')}
            </span>

            {/* User name */}
            <span style={styles.userName}>
              {user?.fullName?.split(' ')[0] || user?.email}
            </span>

            {/* Logout */}
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.loginBtn}>Sign In</Link>
            <Link to="/register" style={styles.primaryBtn}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
