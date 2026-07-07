import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f0f4f8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '420px',
    padding: '48px 40px',
    textAlign: 'center',
  },
  iconCircle: {
    width: '72px',
    height: '72px',
    background: '#fee2e2',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px auto',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: '10px',
  },
  message: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.6',
    marginBottom: '32px',
  },
  btnPrimary: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '12px',
  },
  btnSecondary: {
    width: '100%',
    padding: '12px',
    background: 'white',
    color: '#374151',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '32px',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e3a5f',
    letterSpacing: '-0.5px',
  },
};

function Unauthorized() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const goToDashboard = () => {
    if (!user) { navigate('/login'); return; }
    if (user.role === 'candidate') navigate('/candidate/dashboard');
    else if (user.role === 'recruiter') navigate('/recruiter/dashboard');
    else if (user.role === 'hiring_manager') navigate('/hiring/dashboard');
    else if (user.role === 'admin') navigate('/admin/dashboard');
    else navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span style={styles.logoText}>Nexhire</span>
        </div>

        {/* Icon */}
        <div style={styles.iconCircle}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="#dc2626" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>

        {/* Text */}
        <h1 style={styles.title}>Access Denied</h1>
        <p style={styles.message}>
          You don't have permission to view this page.<br />
          Please contact your administrator if you think this is a mistake.
        </p>

        {/* Buttons */}
        <button style={styles.btnPrimary} onClick={goToDashboard}>
          Go to My Dashboard
        </button>
        <button style={styles.btnSecondary} onClick={handleLogout}>
          Logout
        </button>

      </div>
    </div>
  );
}

export default Unauthorized;
