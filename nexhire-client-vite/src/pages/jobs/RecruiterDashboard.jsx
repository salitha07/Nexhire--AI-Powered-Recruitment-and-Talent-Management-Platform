// src/pages/jobs/RecruiterDashboard.jsx
// Protected: recruiter role only — view/edit/delete own job postings
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMyJobs, deleteJob, updateJob } from '../../services/jobsApi';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#1e293b',
  },

  // ─── HEADER ─────────────────────────────────────────
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
  headerLeft: {},
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
  postBtn: {
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
    flexShrink: 0,
    transition: 'opacity 0.2s',
  },

  // ─── STATS ROW ──────────────────────────────────────
  statsRow: {
    display: 'flex',
    gap: '20px',
    padding: '32px 80px 0',
    maxWidth: '1280px',
    margin: '0 auto',
    flexWrap: 'wrap',
  },
  statCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px 28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: '1',
    minWidth: '160px',
  },
  statIconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1e293b',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '4px',
    fontWeight: '500',
  },

  // ─── CONTENT AREA ───────────────────────────────────
  content: {
    padding: '32px 80px 48px',
    maxWidth: '1280px',
    margin: '0 auto',
  },
  contentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  contentTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
  },
  contentSubtitle: {
    fontSize: '13px',
    color: '#64748b',
  },

  // ─── JOB TABLE CARDS ────────────────────────────────
  jobCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px 28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  },
  jobCardLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
    minWidth: '200px',
  },

  jobTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: '1.3',
  },
  jobCompany: {
    fontSize: '13px',
    color: '#3b82f6',
    fontWeight: '600',
    marginTop: '4px',
  },
  jobMeta: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  jobMetaItem: {
    fontSize: '13px',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: '500',
  },
  typeBadge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  jobCardRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  viewBtn: {
    padding: '8px 16px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    background: 'white',
    color: '#64748b',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'border-color 0.2s',
  },
  applicantsBtn: {
    padding: '8px 16px',
    border: '1.5px solid #c7d2fe',
    borderRadius: '8px',
    background: '#eef2ff',
    color: '#4338ca',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s',
  },
  editBtn: {
    padding: '8px 16px',
    border: '1.5px solid #bfdbfe',
    borderRadius: '8px',
    background: '#eff6ff',
    color: '#1e40af',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s',
  },
  deleteBtn: {
    padding: '8px 16px',
    border: '1.5px solid #fecaca',
    borderRadius: '8px',
    background: '#fff5f5',
    color: '#dc2626',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s',
  },

  // ─── EMPTY STATE ────────────────────────────────────
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  emptyIcon: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px auto',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
  },
  emptyDesc: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '24px',
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 28px',
    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    textDecoration: 'none',
  },

  // ─── MODAL ──────────────────────────────────────────
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    padding: '20px',
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    padding: '36px',
    width: '100%',
    maxWidth: '540px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '-4px',
  },
  modalInput: {
    padding: '11px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1e293b',
    background: '#f8fafc',
    outline: 'none',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box',
  },
  modalTextarea: {
    padding: '11px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1e293b',
    background: '#f8fafc',
    outline: 'none',
    fontFamily: 'inherit',
    width: '100%',
    resize: 'vertical',
    minHeight: '90px',
    boxSizing: 'border-box',
    lineHeight: '1.6',
  },
  modalSelect: {
    padding: '11px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1e293b',
    background: '#f8fafc',
    outline: 'none',
    fontFamily: 'inherit',
    width: '100%',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  modalLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '4px',
    display: 'block',
  },
  modalBtns: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '4px',
  },
  cancelModalBtn: {
    padding: '10px 22px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    background: 'white',
    color: '#64748b',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  saveModalBtn: {
    padding: '10px 22px',
    border: 'none',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    color: 'white',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
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
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function EditModal({ job, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: job.title,
    description: job.description,
    requirements: job.requirements,
    location: job.location,
    type: job.type,
    salaryRange: job.salaryRange,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.title || !form.description || !form.requirements || !form.location || !form.type) {
      toast.error('Please fill all required fields.');
      return;
    }
    setSaving(true);
    try {
      const updated = await updateJob(job.id, form);
      toast.success('Job updated successfully!');
      onSaved(updated);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update job.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalTitle}>✏️ Edit Job</div>

        {[
          { name: 'title', label: 'Job Title', el: 'input' },
          { name: 'description', label: 'Description', el: 'textarea' },
          { name: 'requirements', label: 'Requirements', el: 'textarea' },
          { name: 'location', label: 'Location', el: 'input' },
          { name: 'salaryRange', label: 'Salary Range', el: 'input' },
        ].map(({ name, label, el }) => (
          <div key={name}>
            <label style={styles.modalLabel}>{label}</label>
            {el === 'textarea' ? (
              <textarea
                name={name}
                value={form[name]}
                onChange={handleChange}
                style={styles.modalTextarea}
              />
            ) : (
              <input
                type="text"
                name={name}
                value={form[name]}
                onChange={handleChange}
                style={styles.modalInput}
              />
            )}
          </div>
        ))}

        <div>
          <label style={styles.modalLabel}>Job Type</label>
          <select name="type" value={form.type} onChange={handleChange} style={styles.modalSelect}>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div style={styles.modalBtns}>
          <button style={styles.cancelModalBtn} onClick={onClose}>Cancel</button>
          <button
            style={{ ...styles.saveModalBtn, opacity: saving ? 0.65 : 1 }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchMyJobs = async () => {
      setLoading(true);
      try {
        // Uses GET /api/jobs/mine — server filters by the recruiter's JWT user ID.
        // This is accurate and includes inactive/closed jobs too.
        const myJobs = await getMyJobs();
        setJobs(myJobs);
      } catch (_err) {
        toast.error('Failed to load your jobs.');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyJobs();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteJob(id);
      setJobs(prev => prev.filter(j => j.id !== id));
      toast.success('Job deleted successfully.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete job.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaved = (updated) => {
    setJobs(prev => prev.map(j => j.id === updated.id ? updated : j));
    setEditingJob(null);
  };

  const activeJobs = jobs.filter(j => j.isActive);

  return (
    <div style={styles.page}>
      <ToastContainer position="top-right" autoClose={3000} />
      {editingJob && (
        <EditModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSaved={handleSaved}
        />
      )}
      <Navbar />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerBadge}>💼 RECRUITER PORTAL</div>
          <h1 style={styles.headerTitle}>
            Welcome back, {user?.fullName?.split(' ')[0] || 'Recruiter'}!
          </h1>
          <p style={styles.headerSub}>
            Manage your job postings and track your recruitment pipeline.
          </p>
        </div>
        <Link to="/jobs/create" style={styles.postBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Post New Job
        </Link>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        {[
          {
            label: 'Total Posted', value: jobs.length,
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            ),
          },
          {
            label: 'Active Listings', value: activeJobs.length,
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            ),
          },
          {
            label: 'Closed / Inactive', value: jobs.length - activeJobs.length,
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            ),
          },
        ].map(({ label, value, icon }) => (
          <div key={label} style={styles.statCard}>
            <div style={styles.statIconBox}>{icon}</div>
            <div>
              <div style={styles.statNumber}>{loading ? '–' : value}</div>
              <div style={styles.statLabel}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Job List */}
      <div style={styles.content}>
        <div style={styles.contentHeader}>
          <div>
            <div style={styles.contentTitle}>Your Job Postings</div>
            <div style={styles.contentSubtitle}>
              {loading ? 'Loading…' : `${jobs.length} posting${jobs.length === 1 ? '' : 's'}`}
            </div>
          </div>
          <Link to="/jobs" style={{ ...styles.viewBtn, textDecoration: 'none' }}>
            👁 View Public Board
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ ...styles.jobCard, height: '88px',
                background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && jobs.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div style={styles.emptyTitle}>No jobs posted yet</div>
            <div style={styles.emptyDesc}>
              Create your first job listing to start finding great candidates.
            </div>
            <Link to="/jobs/create" style={styles.primaryBtn}>
              + Post Your First Job
            </Link>
          </div>
        )}

        {/* Job Cards */}
        {!loading && jobs.map(job => {
          const badgeStyle = typeBadgeColors[job.type?.toLowerCase()] || {};
          return (
            <div key={job.id} style={styles.jobCard}>
              <div style={styles.jobCardLeft}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={styles.jobTitle}>{job.title}</div>
                      <div style={styles.jobCompany}>{job.location}</div>
                    </div>
                    <span style={{ ...styles.typeBadge, ...badgeStyle }}>{job.type}</span>
                  </div>

                  <div style={styles.jobMeta}>
                    {job.salaryRange && (
                      <span style={styles.jobMetaItem}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="1" x2="12" y2="23" />
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        {job.salaryRange}
                      </span>
                    )}
                    <span style={styles.jobMetaItem}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {formatDate(job.createdAt)}
                    </span>
                    <span style={{
                      ...styles.typeBadge,
                      ...(job.isActive
                        ? { background: '#dcfce7', color: '#166534' }
                        : { background: '#f1f5f9', color: '#475569' }),
                    }}>
                      {job.isActive ? '● Active' : '● Closed'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={styles.jobCardRight}>
                <Link to={`/jobs/${job.id}`} style={{ ...styles.viewBtn, textDecoration: 'none' }}>
                  View
                </Link>
                <Link to={`/jobs/${job.id}/applicants`} style={{ ...styles.applicantsBtn, textDecoration: 'none' }}>
                  👥 Applicants
                </Link>
                <button style={styles.editBtn} onClick={() => setEditingJob(job)}>
                  ✏️ Edit
                </button>
                <button
                  style={{ ...styles.deleteBtn, opacity: deletingId === job.id ? 0.5 : 1 }}
                  onClick={() => handleDelete(job.id)}
                  disabled={deletingId === job.id}
                >
                  🗑️ {deletingId === job.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{'@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }'}</style>
    </div>
  );
}

export default RecruiterDashboard;