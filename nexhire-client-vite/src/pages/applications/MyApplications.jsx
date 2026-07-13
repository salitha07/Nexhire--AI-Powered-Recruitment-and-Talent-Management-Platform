// src/pages/applications/MyApplications.jsx
// Candidate's own application tracker
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getMyApplications } from '../../services/applicationsApi';

const statusColors = {
  Applied: { background: '#dbeafe', color: '#1e40af' },
  Shortlisted: { background: '#dcfce7', color: '#166534' },
  Rejected: { background: '#fee2e2', color: '#991b1b' },
};

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (_err) {
        setError('Failed to load your applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b', marginBottom: '24px' }}>
          My Applications
        </h1>

        {loading && <p style={{ color: '#64748b' }}>Loading…</p>}
        {error && <p style={{ color: '#991b1b' }}>{error}</p>}

        {!loading && !error && applications.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            You haven't applied to any jobs yet.{' '}
            <Link to="/jobs" style={{ color: '#1e40af', fontWeight: '600' }}>Browse jobs →</Link>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {applications.map((app) => {
            const badge = statusColors[app.status] || statusColors.Applied;
            return (
              <div
                key={app.id}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <Link
                    to={`/jobs/${app.jobId}`}
                    style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', textDecoration: 'none' }}
                  >
                    {app.jobTitle || `Job #${app.jobId}`}
                  </Link>
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
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MyApplications;