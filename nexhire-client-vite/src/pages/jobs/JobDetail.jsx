// src/pages/jobs/JobDetail.jsx
// Single job detail view — loads job by :id from URL params
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getJobById } from '../../services/jobsApi';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#1e293b',
  },

  // ─── HERO ───────────────────────────────────────────
  hero: {
    background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 60%, #3b82f6 100%)',
    padding: '48px 80px',
    color: 'white',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: '#bfdbfe',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '28px',
    transition: 'color 0.2s',
  },
  jobMeta: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '16px',
    alignItems: 'center',
  },
  typeBadge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 12px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
  },
  activeBadge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 12px',
    borderRadius: '20px',
    background: '#dcfce7',
    color: '#166534',
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '16px',
    letterSpacing: '-0.5px',
  },
  heroInfo: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  heroInfoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: '#bfdbfe',
  },

  // ─── LAYOUT ─────────────────────────────────────────
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '32px',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '40px 80px',
  },

  // ─── MAIN CONTENT ───────────────────────────────────
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  section: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sectionTitleIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bodyText: {
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.8',
    whiteSpace: 'pre-wrap',
  },

  // ─── SIDEBAR ────────────────────────────────────────
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sideCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
  },
  applyBtn: {
    display: 'block',
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    letterSpacing: '0.3px',
    transition: 'opacity 0.2s',
    boxSizing: 'border-box',
  },
  applyNote: {
    fontSize: '12px',
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: '10px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '13px',
  },
  detailLabel: {
    color: '#94a3b8',
    fontWeight: '500',
  },
  detailValue: {
    color: '#1e293b',
    fontWeight: '600',
    textAlign: 'right',
    maxWidth: '160px',
  },

  // ─── STATES ─────────────────────────────────────────
  loadingCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  errorBox: {
    background: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    color: '#991b1b',
    margin: '40px 80px',
  },
};

const typeBadgeColors = {
  'full-time': { background: '#dbeafe', color: '#1e40af' },
  'part-time': { background: '#fef3c7', color: '#92400e' },
  'remote':    { background: '#dcfce7', color: '#166534' },
  'hybrid':    { background: '#ede9fe', color: '#5b21b6' },
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getJobById(id);
        setJob(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('This job posting was not found or has been removed.');
        } else {
          setError('Failed to load job details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div style={styles.page}>
        <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
        <Navbar />
        <div style={styles.loadingCenter}>
          <div style={styles.spinner} />
          <span style={{ color: '#64748b', fontSize: '14px' }}>Loading job details…</span>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.errorBox}>
          <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
            {error || 'Job not found'}
          </div>
          <Link to="/jobs" style={{ color: '#1e40af', fontWeight: '600', textDecoration: 'none' }}>
            ← Back to Job Listings
          </Link>
        </div>
      </div>
    );
  }

  const badgeStyle = typeBadgeColors[job.type?.toLowerCase()] || {};

  return (
    <div style={styles.page}>
      <style>{'@keyframes spin { to { transform: rotate(360deg); } } .apply-btn:hover { opacity: 0.88 !important; }'}</style>
      <Navbar />

      {/* Hero */}
      <div style={styles.hero}>
        <Link to="/jobs" className="back-link" style={styles.backLink}>
          ← Back to Job Listings
        </Link>

        <div style={styles.jobMeta}>
          <span style={{ ...styles.typeBadge }}>
            {job.type}
          </span>
          {job.isActive && (
            <span style={styles.activeBadge}>✓ Actively Hiring</span>
          )}
        </div>

        <h1 style={styles.heroTitle}>{job.title}</h1>

        <div style={styles.heroInfo}>
          <span style={styles.heroInfoItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {job.location}
          </span>
          {job.salaryRange && (
            <span style={styles.heroInfoItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              {job.salaryRange}
            </span>
          )}
          <span style={styles.heroInfoItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {job.postedByFullName || job.postedByEmail}
          </span>
          <span style={styles.heroInfoItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Posted {formatDate(job.createdAt)}
          </span>
        </div>
      </div>

      {/* Content Layout */}
      <div style={styles.layout}>

        {/* Main Content */}
        <div style={styles.mainContent}>

          {/* Description */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <div style={styles.sectionTitleIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              Job Description
            </div>
            <p style={styles.bodyText}>{job.description}</p>
          </div>

          {/* Requirements */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <div style={styles.sectionTitleIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              Requirements
            </div>
            <p style={styles.bodyText}>{job.requirements}</p>
          </div>

        </div>

        {/* Sidebar */}
        <div style={styles.sidebar}>

          {/* Apply Card */}
          <div style={styles.sideCard}>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
              Interested in this role?
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>
              Submit your application and our team will be in touch.
            </div>

            {isAuthenticated && user?.role === 'candidate' ? (
              <>
                <button className="apply-btn" style={styles.applyBtn}>
                  Apply Now →
                </button>
                <p style={styles.applyNote}>Application module coming soon</p>
              </>
            ) : !isAuthenticated ? (
              <>
                <Link to="/register" style={styles.applyBtn}>
                  Sign Up to Apply →
                </Link>
                <p style={styles.applyNote}>
                  Already have an account?{' '}
                  <Link to="/login" style={{ color: '#3b82f6' }}>Sign in</Link>
                </p>
              </>
            ) : (
              <div style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', padding: '8px 0' }}>
                Only candidates can apply for jobs.
              </div>
            )}
          </div>

          {/* Job Details Card */}
          <div style={styles.sideCard}>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>
              Job Details
            </div>
            {[
              { label: 'Job Type', value: job.type },
              { label: 'Location', value: job.location },
              { label: 'Salary', value: job.salaryRange || 'Not specified' },
              { label: 'Posted', value: formatDate(job.createdAt) },
              { label: 'Status', value: job.isActive ? '✅ Active' : '⏸ Closed' },
            ].map(({ label, value }) => (
              <div key={label} style={styles.detailRow}>
                <span style={styles.detailLabel}>{label}</span>
                <span style={styles.detailValue}>{value}</span>
              </div>
            ))}
          </div>

          {/* Posted By Card */}
          <div style={styles.sideCard}>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>
              Posted By
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '16px', fontWeight: '700', flexShrink: 0,
              }}>
                {(job.postedByFullName || job.postedByEmail || 'R').charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                  {job.postedByFullName || 'Recruiter'}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{job.postedByEmail}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default JobDetail;
