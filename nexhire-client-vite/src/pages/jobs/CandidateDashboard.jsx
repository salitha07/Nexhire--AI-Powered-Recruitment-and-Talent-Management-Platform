// src/pages/jobs/CandidateDashboard.jsx
// Protected: candidate role only
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#1e293b',
  },

  header: {
    background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 60%, #3b82f6 100%)',
    padding: '48px 80px',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: '24px',
  },
  headerBadge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '20px',
    padding: '4px 14px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
    marginBottom: '14px',
    color: '#bfdbfe',
  },
  headerTitle: {
    fontSize: '32px',
    fontWeight: '800',
    marginBottom: '8px',
    letterSpacing: '-0.5px',
  },
  headerSub: {
    fontSize: '15px',
    color: '#bfdbfe',
  },
  browseBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 28px',
    background: 'white',
    color: '#1e40af',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'opacity 0.2s',
  },

  // ─── CONTENT ────────────────────────────────────────
  content: {
    padding: '40px 80px',
    maxWidth: '1280px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
  },
  cardIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
  },
  cardDesc: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  cardLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    color: '#1e40af',
    fontWeight: '600',
    fontSize: '14px',
    textDecoration: 'none',
  }
};

function CandidateDashboard() {
  const { user } = useAuth();

  return (
    <div style={styles.page}>
      <Navbar />

      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.headerBadge}>🎓 CANDIDATE PORTAL</div>
          <h1 style={styles.headerTitle}>
            Hello, {user?.fullName?.split(' ')[0] || 'Candidate'}!
          </h1>
          <p style={styles.headerSub}>
            Welcome to your dashboard. Ready to find your dream job?
          </p>
        </div>
        <Link to="/jobs" style={styles.browseBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Browse Jobs
        </Link>
      </div>

      {/* Main Content (Placeholder for future features) */}
      <div style={styles.content}>
        <div style={styles.grid}>

          <div style={styles.card}>
            <div style={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div style={styles.cardTitle}>Find Jobs</div>
            <div style={styles.cardDesc}>
              Search through hundreds of active job listings and find the perfect match for your skills.
            </div>
            <Link to="/jobs" style={styles.cardLink}>
              View Job Board →
            </Link>
          </div>

          <div style={{ ...styles.card, opacity: 0.7 }}>
            <div style={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div style={styles.cardTitle}>My Applications (Coming Soon)</div>
            <div style={styles.cardDesc}>
              Track your submitted applications, view statuses, and schedule interviews.
            </div>
            <span style={{ ...styles.cardLink, color: '#94a3b8', cursor: 'not-allowed' }}>
              Module pending...
            </span>
          </div>

          <div style={{ ...styles.card, opacity: 0.7 }}>
            <div style={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div style={styles.cardTitle}>My Profile (Coming Soon)</div>
            <div style={styles.cardDesc}>
              Update your resume, skills, and preferences to improve AI job matching.
            </div>
            <span style={{ ...styles.cardLink, color: '#94a3b8', cursor: 'not-allowed' }}>
              Module pending...
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CandidateDashboard;
