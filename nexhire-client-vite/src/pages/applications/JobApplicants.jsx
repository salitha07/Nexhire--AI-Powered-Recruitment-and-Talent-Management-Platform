// src/pages/applications/JobApplicants.jsx
// Recruiter's view of applicants for one job — shortlist/reject
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../components/Navbar';
import { getApplicationsForJob, updateApplicationStatus } from '../../services/applicationsApi';
import AIAnalysisCard from '../../components/AIAnalysisCard';

const statusColors = {
  Applied: { background: '#dbeafe', color: '#1e40af' },
  Shortlisted: { background: '#dcfce7', color: '#166534' },
  Rejected: { background: '#fee2e2', color: '#991b1b' },
};

function JobApplicants() {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState('All');

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getApplicationsForJob(id);
      setApplicants(data);
    } catch {
      setError('Failed to load applicants. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

 useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  fetchApplicants();
}, [fetchApplicants]);

  const handleStatusChange = async (applicationId, status) => {
    setUpdatingId(applicationId);
    try {
      await updateApplicationStatus(applicationId, status);
      toast.success(`Applicant ${status.toLowerCase()}`);
      setApplicants((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status } : a))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered =
    filter === 'All' ? applicants : applicants.filter((a) => a.status === filter);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <Link to="/recruiter/dashboard" style={{ fontSize: '13px', color: '#1e40af', textDecoration: 'none' }}>
          ← Back to Dashboard
        </Link>

        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b', margin: '12px 0 20px' }}>
          Applicants
        </h1>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['All', 'Applied', 'Shortlisted', 'Rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                background: filter === f ? '#1e40af' : '#fff',
                color: filter === f ? '#fff' : '#475569',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: '#64748b' }}>Loading…</p>}
        {error && <p style={{ color: '#991b1b' }}>{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p style={{ color: '#64748b' }}>No applicants in this category.</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((app) => {
            const badge = statusColors[app.status] || statusColors.Applied;
            return (
              <div
                key={app.id}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>
                      {app.candidateFullName || app.candidateEmail}
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      ...badge,
                    }}
                  >
                    {app.status}
                  </span>
                </div>

                {app.coverLetter && (
                  <p style={{ fontSize: '13px', color: '#475569', marginTop: '12px', lineHeight: '1.6' }}>
                    {app.coverLetter}
                  </p>
                )}

                {app.status === 'Applied' && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                    <button
                      onClick={() => handleStatusChange(app.id, 'Shortlisted')}
                      disabled={updatingId === app.id}
                      style={{
                        padding: '8px 16px',
                        background: '#166534',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Shortlist
                    </button>
                    <button
                      onClick={() => handleStatusChange(app.id, 'Rejected')}
                      disabled={updatingId === app.id}
                      style={{
                        padding: '8px 16px',
                        background: '#991b1b',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}

                {/* ── AI Analysis ───────────────────────────────────────── */}
                <AIAnalysisCard applicationId={app.id} />

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default JobApplicants;