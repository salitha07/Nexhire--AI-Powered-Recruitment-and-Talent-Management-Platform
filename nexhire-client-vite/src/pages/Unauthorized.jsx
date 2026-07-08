import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

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
  logoRow: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '32px',
  },
  iconCircle: {
    width: '72px',
    height: '72px',
    background: '#fee2e2',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px auto',
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
    navigate('/');
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.logoRow}>
          <Logo size="sm" />
        </div>

        <div style={styles.iconCircle}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>

        <h1 style={styles.title}>Access Denied</h1>
        <p style={styles.message}>
          You don't have permission to view this page.<br />
          Please contact your administrator if you think this is a mistake.
        </p>

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
