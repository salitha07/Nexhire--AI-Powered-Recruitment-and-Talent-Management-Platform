import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Logo from '../components/Logo';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f0f4f8',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },

  // Navbar
  navbar: {
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    padding: '14px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userBadge: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
  },
  roleBadge: {
    background: '#dbeafe',
    color: '#1e40af',
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  logoutBtn: {
    background: 'none',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '13px',
    color: '#374151',
    cursor: 'pointer',
  },

  // Layout
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
  },

  // Page header
  pageHeader: {
    marginBottom: '28px',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '4px',
  },
  pageSubtitle: {
    fontSize: '14px',
    color: '#64748b',
  },

  // Stats row
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '28px',
  },
  statCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '20px 24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
  },
  statLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1e293b',
  },
  statSub: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '4px',
  },

  // Tabs
  tabs: {
    display: 'flex',
    gap: '4px',
    background: '#ffffff',
    padding: '6px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    marginBottom: '24px',
    width: 'fit-content',
  },
  tab: {
    padding: '8px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    color: 'white',
    fontWeight: '600',
  },
  tabInactive: {
    background: 'transparent',
    color: '#64748b',
  },

  // Cards
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
    marginBottom: '16px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  candidateName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '4px',
  },
  candidateMeta: {
    fontSize: '13px',
    color: '#64748b',
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  // Status badges
  badge: {
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 12px',
    borderRadius: '20px',
    textTransform: 'capitalize',
  },
  badgeShortlisted: { background: '#dbeafe', color: '#1e40af' },
  badgeInterview: { background: '#fef3c7', color: '#92400e' },
  badgeHired: { background: '#d1fae5', color: '#065f46' },
  badgeRejected: { background: '#fee2e2', color: '#991b1b' },

  // Action buttons
  btnRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '16px',
  },
  btnPrimary: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnSuccess: {
    padding: '8px 16px',
    background: '#d1fae5',
    color: '#065f46',
    border: '1px solid #6ee7b7',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnDanger: {
    padding: '8px 16px',
    background: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnOutline: {
    padding: '8px 16px',
    background: 'white',
    color: '#374151',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  // Feedback modal overlay
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    padding: '20px',
  },
  modal: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '6px',
  },
  modalSubtitle: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '16px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    padding: '10px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1e293b',
    background: '#f8fafc',
    outline: 'none',
  },
  textarea: {
    padding: '10px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1e293b',
    background: '#f8fafc',
    outline: 'none',
    resize: 'vertical',
    minHeight: '100px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  select: {
    padding: '10px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1e293b',
    background: '#f8fafc',
    outline: 'none',
    cursor: 'pointer',
  },
  modalBtnRow: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },

  // Score stars
  scoreRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px',
  },
  scoreLabel: {
    fontSize: '13px',
    color: '#64748b',
  },
  scoreBadge: {
    background: '#fef3c7',
    color: '#92400e',
    fontSize: '13px',
    fontWeight: '700',
    padding: '2px 10px',
    borderRadius: '20px',
  },

  // Empty state
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#94a3b8',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '8px',
  },
  emptyDesc: {
    fontSize: '14px',
    color: '#94a3b8',
  },

  // Interview card extras
  interviewTime: {
    background: '#f0f4f8',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '13px',
    color: '#374151',
    display: 'flex',
    gap: '16px',
    marginTop: '12px',
    flexWrap: 'wrap',
  },
};

// ── Mock data (replace with real API calls when backend is ready) ──────────
const mockShortlisted = [
  {
    id: 1,
    candidateName: 'Ashan Perera',
    email: 'ashan@example.com',
    jobTitle: 'Frontend Developer',
    appliedAt: '2026-07-10',
    yearsOfExperience: 3,
    status: 'shortlisted',
    score: null,
    feedback: null,
    interviewDate: null,
  },
  {
    id: 2,
    candidateName: 'Nimasha Silva',
    email: 'nimasha@example.com',
    jobTitle: 'Backend Engineer',
    appliedAt: '2026-07-09',
    yearsOfExperience: 5,
    status: 'interview',
    score: null,
    feedback: null,
    interviewDate: '2026-07-18T10:00',
  },
  {
    id: 3,
    candidateName: 'Kasun Fernando',
    email: 'kasun@example.com',
    jobTitle: 'DevOps Engineer',
    appliedAt: '2026-07-08',
    yearsOfExperience: 4,
    status: 'interview',
    score: 85,
    feedback: 'Strong technical background, good communication skills.',
    interviewDate: '2026-07-15T14:00',
  },
];

const mockInterviews = [
  {
    id: 1,
    candidateName: 'Nimasha Silva',
    jobTitle: 'Backend Engineer',
    scheduledAt: '2026-07-18T10:00',
    status: 'scheduled',
    feedback: null,
    score: null,
  },
  {
    id: 2,
    candidateName: 'Kasun Fernando',
    jobTitle: 'DevOps Engineer',
    scheduledAt: '2026-07-15T14:00',
    status: 'completed',
    feedback: 'Strong technical background, good communication skills.',
    score: 85,
  },
];

function getBadgeStyle(status) {
  if (status === 'shortlisted') return styles.badgeShortlisted;
  if (status === 'interview') return styles.badgeInterview;
  if (status === 'hired') return styles.badgeHired;
  if (status === 'rejected') return styles.badgeRejected;
  return styles.badgeShortlisted;
}

function HiringDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('candidates');
  const [candidates, setCandidates] = useState(mockShortlisted);
  const [interviews, setInterviews] = useState(mockInterviews);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({
    score: '',
    feedback: '',
    decision: 'hired',
  });

  const handleLogout = () => { logout(); navigate('/login'); };

  const openFeedbackModal = (candidate) => {
    setSelectedCandidate(candidate);
    setFeedbackForm({
      score: candidate.score || '',
      feedback: candidate.feedback || '',
      decision: candidate.status === 'hired' ? 'hired' : 'hired',
    });
    setShowFeedbackModal(true);
  };

  const submitFeedback = () => {
    if (!feedbackForm.score || !feedbackForm.feedback) {
      toast.error('Please fill in score and feedback');
      return;
    }
    setCandidates(prev => prev.map(c =>
      c.id === selectedCandidate.id
        ? { ...c, score: feedbackForm.score, feedback: feedbackForm.feedback, status: feedbackForm.decision }
        : c
    ));
    setInterviews(prev => prev.map(i =>
      i.candidateName === selectedCandidate.candidateName
        ? { ...i, score: feedbackForm.score, feedback: feedbackForm.feedback, status: 'completed' }
        : i
    ));
    toast.success(`Decision saved — ${feedbackForm.decision === 'hired' ? '🎉 Candidate hired!' : 'Candidate rejected'}`);
    setShowFeedbackModal(false);
  };

  const updateStatus = (id, status) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    toast.success(`Status updated to ${status}`);
  };

  const stats = {
    total: candidates.length,
    shortlisted: candidates.filter(c => c.status === 'shortlisted').length,
    interviews: candidates.filter(c => c.status === 'interview').length,
    hired: candidates.filter(c => c.status === 'hired').length,
  };

  return (
    <div style={styles.page}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Navbar */}
      <nav style={styles.navbar}>
        <Logo size="sm" />
        <div style={styles.navRight}>
          <span style={styles.roleBadge}>Hiring Manager</span>
          <span style={styles.userBadge}>👤 {user?.fullName}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>

        {/* Page Header */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Hiring Manager Dashboard</h1>
          <p style={styles.pageSubtitle}>
            Review candidates, conduct interviews, and make hiring decisions.
          </p>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Candidates</div>
            <div style={styles.statValue}>{stats.total}</div>
            <div style={styles.statSub}>Under review</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Shortlisted</div>
            <div style={{ ...styles.statValue, color: '#1e40af' }}>{stats.shortlisted}</div>
            <div style={styles.statSub}>Awaiting interview</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Interviews</div>
            <div style={{ ...styles.statValue, color: '#92400e' }}>{stats.interviews}</div>
            <div style={styles.statSub}>Scheduled / completed</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Hired</div>
            <div style={{ ...styles.statValue, color: '#065f46' }}>{stats.hired}</div>
            <div style={styles.statSub}>This cycle</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {['candidates', 'interviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tab,
                ...(activeTab === tab ? styles.tabActive : styles.tabInactive),
              }}
            >
              {tab === 'candidates' ? '👥 Shortlisted Candidates' : '📅 Interviews'}
            </button>
          ))}
        </div>

        {/* ── CANDIDATES TAB ── */}
        {activeTab === 'candidates' && (
          <>
            {candidates.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>👥</div>
                <div style={styles.emptyTitle}>No shortlisted candidates yet</div>
                <div style={styles.emptyDesc}>Candidates shortlisted by recruiters will appear here.</div>
              </div>
            ) : (
              candidates.map(candidate => (
                <div key={candidate.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div>
                      <div style={styles.candidateName}>{candidate.candidateName}</div>
                      <div style={styles.candidateMeta}>
                        <span style={styles.metaItem}>✉️ {candidate.email}</span>
                        <span style={styles.metaItem}>💼 {candidate.jobTitle}</span>
                        <span style={styles.metaItem}>🗓️ Applied {candidate.appliedAt}</span>
                        <span style={styles.metaItem}>⏱️ {candidate.yearsOfExperience} yrs exp</span>
                      </div>
                    </div>
                    <span style={{ ...styles.badge, ...getBadgeStyle(candidate.status) }}>
                      {candidate.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Interview time if set */}
                  {candidate.interviewDate && (
                    <div style={styles.interviewTime}>
                      <span>📅 Interview scheduled:</span>
                      <strong>{new Date(candidate.interviewDate).toLocaleString()}</strong>
                    </div>
                  )}

                  {/* Score & feedback if available */}
                  {candidate.score && (
                    <div style={styles.scoreRow}>
                      <span style={styles.scoreLabel}>Interview Score:</span>
                      <span style={styles.scoreBadge}>{candidate.score}/100</span>
                    </div>
                  )}
                  {candidate.feedback && (
                    <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px', fontStyle: 'italic' }}>
                      "{candidate.feedback}"
                    </p>
                  )}

                  {/* Action buttons */}
                  <div style={styles.btnRow}>
                    {candidate.status === 'shortlisted' && (
                      <button
                        style={styles.btnPrimary}
                        onClick={() => updateStatus(candidate.id, 'interview')}
                      >
                        📅 Schedule Interview
                      </button>
                    )}
                    {candidate.status === 'interview' && (
                      <button
                        style={styles.btnPrimary}
                        onClick={() => openFeedbackModal(candidate)}
                      >
                        ✍️ Add Feedback & Decision
                      </button>
                    )}
                    {(candidate.status === 'hired' || candidate.status === 'rejected') && (
                      <button
                        style={styles.btnOutline}
                        onClick={() => openFeedbackModal(candidate)}
                      >
                        ✏️ Edit Feedback
                      </button>
                    )}
                    {candidate.status !== 'rejected' && candidate.status !== 'hired' && (
                      <button
                        style={styles.btnDanger}
                        onClick={() => updateStatus(candidate.id, 'rejected')}
                      >
                        ❌ Reject
                      </button>
                    )}
                    {candidate.status === 'interview' && (
                      <button
                        style={styles.btnSuccess}
                        onClick={() => updateStatus(candidate.id, 'hired')}
                      >
                        ✅ Mark as Hired
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* ── INTERVIEWS TAB ── */}
        {activeTab === 'interviews' && (
          <>
            {interviews.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📅</div>
                <div style={styles.emptyTitle}>No interviews scheduled</div>
                <div style={styles.emptyDesc}>Scheduled interviews will appear here.</div>
              </div>
            ) : (
              interviews.map(interview => (
                <div key={interview.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div>
                      <div style={styles.candidateName}>{interview.candidateName}</div>
                      <div style={styles.candidateMeta}>
                        <span style={styles.metaItem}>💼 {interview.jobTitle}</span>
                        <span style={styles.metaItem}>
                          📅 {new Date(interview.scheduledAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span style={{
                      ...styles.badge,
                      ...(interview.status === 'completed' ? styles.badgeHired : styles.badgeInterview),
                    }}>
                      {interview.status}
                    </span>
                  </div>

                  {interview.score && (
                    <div style={styles.scoreRow}>
                      <span style={styles.scoreLabel}>Score:</span>
                      <span style={styles.scoreBadge}>{interview.score}/100</span>
                    </div>
                  )}
                  {interview.feedback && (
                    <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px', fontStyle: 'italic' }}>
                      "{interview.feedback}"
                    </p>
                  )}

                  {interview.status === 'scheduled' && (
                    <div style={styles.btnRow}>
                      <button
                        style={styles.btnPrimary}
                        onClick={() => {
                          const c = candidates.find(x => x.candidateName === interview.candidateName);
                          if (c) openFeedbackModal(c);
                        }}
                      >
                        ✍️ Add Interview Feedback
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </>
        )}

      </div>

      {/* ── FEEDBACK MODAL ── */}
      {showFeedbackModal && selectedCandidate && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalTitle}>Interview Feedback</div>
            <div style={styles.modalSubtitle}>
              {selectedCandidate.candidateName} — {selectedCandidate.jobTitle}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Score (out of 100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={feedbackForm.score}
                onChange={e => setFeedbackForm({ ...feedbackForm, score: e.target.value })}
                placeholder="e.g. 85"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Feedback Notes</label>
              <textarea
                value={feedbackForm.feedback}
                onChange={e => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                placeholder="Write your interview feedback here..."
                style={styles.textarea}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Hiring Decision</label>
              <select
                value={feedbackForm.decision}
                onChange={e => setFeedbackForm({ ...feedbackForm, decision: e.target.value })}
                style={styles.select}
              >
                <option value="hired">✅ Hire this candidate</option>
                <option value="rejected">❌ Reject this candidate</option>
                <option value="interview">🔄 Keep in interview stage</option>
              </select>
            </div>

            <div style={styles.modalBtnRow}>
              <button
                style={styles.btnOutline}
                onClick={() => setShowFeedbackModal(false)}
              >
                Cancel
              </button>
              <button style={styles.btnPrimary} onClick={submitFeedback}>
                Save Decision
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default HiringDashboard;