// src/pages/jobs/CandidateDashboard.jsx
// Protected: candidate role only
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { getMyApplications } from '../../services/applicationsApi';
import { getAIResult, rankCandidate } from '../../services/aiApi';
import { getAllJobs } from '../../services/jobsApi';

// ─── Helpers ────────────────────────────────────────────────────────────────

const STATUS_COLORS = {
  Applied:     { background: '#dbeafe', color: '#1e40af' },
  Shortlisted: { background: '#dcfce7', color: '#166534' },
  Rejected:    { background: '#fee2e2', color: '#991b1b' },
  Interview:   { background: '#fef3c7', color: '#92400e' },
};

function getScoreColor(score) {
  if (score >= 75) return '#16a34a';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function getRecStyle(rec) {
  if (!rec) return {};
  const r = rec.toLowerCase();
  if (r.includes('strong hire')) return { background: '#dcfce7', color: '#166534' };
  if (r.includes('hire'))        return { background: '#d1fae5', color: '#065f46' };
  if (r.includes('maybe'))       return { background: '#fef3c7', color: '#92400e' };
  return { background: '#fee2e2', color: '#991b1b' };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const style = STATUS_COLORS[status] || STATUS_COLORS.Applied;
  return (
    <span style={{
      fontSize: '12px', fontWeight: '700', padding: '4px 12px',
      borderRadius: '20px', whiteSpace: 'nowrap', ...style,
    }}>
      {status}
    </span>
  );
}

function SkillTag({ skill }) {
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
      background: '#eff6ff', color: '#1e40af', fontSize: '11px',
      fontWeight: '600', border: '1px solid #bfdbfe', margin: '3px 3px 0 0',
    }}>
      {skill.trim()}
    </span>
  );
}

// AI Insight drawer for a single application row
function AIInsightDrawer({ applicationId }) {
  const [state, setState] = useState('idle'); // idle | loading | done | error | running
  const [result, setResult] = useState(null);
  const [errMsg, setErrMsg] = useState('');

  // Load cached result on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setState('loading');
      try {
        const data = await getAIResult(applicationId);
        if (!cancelled) { setResult(data); setState('done'); }
      } catch {
        if (!cancelled) setState('idle'); // no result yet — show run button
      }
    })();
    return () => { cancelled = true; };
  }, [applicationId]);

  const handleRun = async () => {
    setState('running');
    setErrMsg('');
    try {
      const data = await rankCandidate(applicationId);
      setResult(data);
      setState('done');
    } catch (err) {
      setErrMsg(err.response?.data?.message || 'AI analysis failed. Please try again.');
      setState('error');
    }
  };

  const skills = result?.extractedSkills
    ? result.extractedSkills.split(',').filter(Boolean)
    : [];
  const [recVerdict, ...recParts] = result?.recommendation?.split('—') ?? [];
  const recReason = recParts.join('—').trim();
  const recStyle  = getRecStyle(result?.recommendation);

  return (
    <div style={{
      marginTop: '12px', padding: '16px', borderRadius: '10px',
      background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)',
      border: '1px solid #e0e7ff',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        {/* Sparkle */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
        </svg>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#4338ca' }}>
          AI Insight
        </span>
      </div>

      {/* Loading */}
      {(state === 'loading' || state === 'running') && (
        <div style={{ color: '#6366f1', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg style={{ animation: 'spin 0.8s linear infinite' }} width="14" height="14"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          {state === 'running' ? 'Running AI analysis…' : 'Loading result…'}
        </div>
      )}

      {/* No result yet */}
      {state === 'idle' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>No AI analysis yet.</span>
          <button
            onClick={handleRun}
            style={{
              padding: '6px 16px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
              color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px',
              fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 6px rgba(99,102,241,0.3)',
            }}>
            ✨ Run Analysis
          </button>
        </div>
      )}

      {/* Error */}
      {state === 'error' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: '#991b1b' }}>⚠️ {errMsg}</span>
          <button onClick={handleRun} style={{
            padding: '6px 16px', background: '#fee2e2', color: '#991b1b',
            border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
          }}>
            Retry
          </button>
        </div>
      )}

      {/* Result */}
      {state === 'done' && result && (
        <div>
          {/* Score bar */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Match Score
              </span>
              <span style={{ fontSize: '13px', fontWeight: '800', color: getScoreColor(result.matchScore) }}>
                {result.matchScore}%
              </span>
            </div>
            <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{
                width: `${result.matchScore}%`, height: '100%', borderRadius: '10px',
                background: `linear-gradient(90deg, ${getScoreColor(result.matchScore)}, ${getScoreColor(result.matchScore)}aa)`,
                transition: 'width 0.8s ease',
              }} />
            </div>
          </div>

          {/* Recommendation pill */}
          {recVerdict && (
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '5px' }}>
                Recommendation
              </span>
              <span style={{
                display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
                fontSize: '12px', fontWeight: '700', ...recStyle,
              }}>
                {recVerdict.trim()}
              </span>
              {recReason && (
                <p style={{ fontSize: '12px', color: '#475569', margin: '5px 0 0', lineHeight: '1.6' }}>
                  {recReason}
                </p>
              )}
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '5px' }}>
                Extracted Skills
              </span>
              <div>
                {skills.map((s, i) => <SkillTag key={i} skill={s} />)}
              </div>
            </div>
          )}

          {/* Re-run */}
          <button onClick={handleRun} style={{
            marginTop: '12px', padding: '5px 14px', background: 'transparent',
            border: '1px solid #c7d2fe', color: '#6366f1', borderRadius: '8px',
            fontSize: '11px', fontWeight: '700', cursor: 'pointer',
          }}>
            ↻ Re-run Analysis
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Application Row ─────────────────────────────────────────────────────────

function ApplicationRow({ app }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px',
      padding: '18px 20px', transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Row header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Job icon */}
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
          background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>

        {/* Title + date */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link
            to={`/jobs/${app.jobId}`}
            style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', textDecoration: 'none' }}
          >
            {app.jobTitle || `Job #${app.jobId}`}
          </Link>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
            Applied {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <StatusBadge status={app.status} />

        {/* AI toggle */}
        <button
          onClick={() => setExpanded(v => !v)}
          title="Toggle AI Insight"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
            fontSize: '12px', fontWeight: '700', transition: 'all 0.2s',
            background: expanded ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : '#f1f5f9',
            color: expanded ? '#fff' : '#6366f1',
            border: expanded ? 'none' : '1px solid #e0e7ff',
            boxShadow: expanded ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
          }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
          </svg>
          {expanded ? 'Hide AI' : 'AI Insight'}
        </button>
      </div>

      {/* Expandable AI drawer */}
      {expanded && <AIInsightDrawer applicationId={app.id} />}
    </div>
  );
}

// ─── Job Recommendation Card ──────────────────────────────────────────────────

function JobRecommendationCard({ job }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px',
      padding: '22px', transition: 'all 0.2s', cursor: 'pointer',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.12)'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
    >
      {/* AI badge + type */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{
          fontSize: '10px', fontWeight: '700', padding: '3px 10px',
          borderRadius: '20px', background: '#ede9fe', color: '#7c3aed',
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          ✨ AI Pick
        </span>
        {job.type && (
          <span style={{
            fontSize: '10px', fontWeight: '600', color: '#64748b',
            background: '#f1f5f9', padding: '3px 10px', borderRadius: '20px',
          }}>
            {job.type}
          </span>
        )}
      </div>

      {/* Title */}
      <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
        <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '6px', lineHeight: '1.4' }}>
          {job.title}
        </div>
      </Link>

      {/* Location */}
      {job.location && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {job.location}
        </div>
      )}

      {/* Salary + CTA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {job.salaryRange ? (
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#16a34a' }}>
            💰 {job.salaryRange}
          </span>
        ) : <span />}
        <Link to={`/jobs/${job.id}`} style={{
          fontSize: '12px', fontWeight: '700', color: '#6366f1', textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: '4px',
        }}>
          View Job →
        </Link>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

function CandidateDashboard() {
  const { user } = useAuth();
  const [applications, setApplications]       = useState([]);
  const [appsLoading, setAppsLoading]         = useState(true);
  const [appsError, setAppsError]             = useState(null);
  const [jobs, setJobs]                       = useState([]);
  const [jobsLoading, setJobsLoading]         = useState(true);
  const [activeTab, setActiveTab]             = useState('applications'); // 'applications' | 'profile'

  // Load applications
  useEffect(() => {
    (async () => {
      setAppsLoading(true);
      setAppsError(null);
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch {
        setAppsError('Failed to load your applications. Please try again.');
      } finally {
        setAppsLoading(false);
      }
    })();
  }, []);

  // Load recommended jobs (top 3 from active listings)
  useEffect(() => {
    (async () => {
      setJobsLoading(true);
      try {
        const data = await getAllJobs();
        setJobs((data || []).slice(0, 3));
      } catch {
        setJobs([]);
      } finally {
        setJobsLoading(false);
      }
    })();
  }, []);

  // Derived stats
  const totalApps       = applications.length;
  const shortlisted     = applications.filter(a => a.status === 'Shortlisted').length;
  const rejected        = applications.filter(a => a.status === 'Rejected').length;
  const underReview     = applications.filter(a => a.status === 'Applied' || a.status === 'Interview').length;

  const firstName = user?.fullName?.split(' ')[0] || 'Candidate';

  // ─── Styles ────────────────────────────────────────────────────────────────

  const S = {
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
    content: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '40px 80px',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '800',
      color: '#1e293b',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '16px',
      marginBottom: '32px',
    },
    statCard: {
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
    },
    tabRow: {
      display: 'flex',
      gap: '8px',
      marginBottom: '20px',
      borderBottom: '2px solid #e2e8f0',
      paddingBottom: '0',
    },
    tab: (active) => ({
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '700',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      borderBottom: active ? '2px solid #6366f1' : '2px solid transparent',
      color: active ? '#6366f1' : '#64748b',
      marginBottom: '-2px',
      transition: 'color 0.2s',
    }),
  };

  return (
    <div style={S.page}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <Navbar />

      {/* ── Hero Header ── */}
      <div style={S.header}>
        <div>
          <div style={{
            display: 'inline-block', background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px',
            padding: '4px 14px', fontSize: '11px', fontWeight: '700',
            letterSpacing: '1px', marginBottom: '14px', color: '#bfdbfe',
          }}>
            🎓 CANDIDATE PORTAL
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>
            Hello, {firstName}!
          </h1>
          <p style={{ fontSize: '15px', color: '#bfdbfe' }}>
            Track your applications, view AI insights, and explore new opportunities.
          </p>
        </div>
        <Link to="/jobs" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '12px 28px', background: 'white', color: '#1e40af',
          border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
          cursor: 'pointer', textDecoration: 'none',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Browse Jobs
        </Link>
      </div>

      {/* ── Main Content ── */}
      <div style={S.content}>

        {/* ── Stats Row ── */}
        <div style={S.statsRow}>
          {[
            { label: 'Total Applied',   value: totalApps,   color: '#1e40af', bg: '#dbeafe' },
            { label: 'Shortlisted',     value: shortlisted, color: '#166534', bg: '#dcfce7' },
            { label: 'Under Review',    value: underReview, color: '#92400e', bg: '#fef3c7' },
            { label: 'Not Selected',    value: rejected,    color: '#991b1b', bg: '#fee2e2' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} style={S.statCard}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px', background: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 10px',
              }}>
                <span style={{ fontSize: '20px', fontWeight: '900', color }}>{value}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={S.tabRow}>
          {[
            { id: 'applications', label: '📋 My Applications' },
            { id: 'profile',      label: '👤 Profile & Stats' },
          ].map(({ id, label }) => (
            <button key={id} style={S.tab(activeTab === id)} onClick={() => setActiveTab(id)}>
              {label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════ */}
        {/* TAB: My Applications                                     */}
        {/* ════════════════════════════════════════════════════════ */}
        {activeTab === 'applications' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={S.sectionTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Application Tracker
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginLeft: '4px' }}>
                ({totalApps} total)
              </span>
            </div>

            {/* Loading */}
            {appsLoading && (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#6366f1' }}>
                <svg style={{ animation: 'spin 0.8s linear infinite' }} width="28" height="28"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                <p style={{ marginTop: '12px', color: '#64748b' }}>Loading your applications…</p>
              </div>
            )}

            {/* Error */}
            {!appsLoading && appsError && (
              <div style={{
                padding: '20px', background: '#fee2e2', border: '1px solid #fca5a5',
                borderRadius: '12px', color: '#991b1b', fontSize: '14px',
              }}>
                ⚠️ {appsError}
              </div>
            )}

            {/* Empty */}
            {!appsLoading && !appsError && applications.length === 0 && (
              <div style={{
                textAlign: 'center', padding: '64px 0', color: '#64748b',
                background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0',
              }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>📭</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                  No applications yet
                </div>
                <p style={{ fontSize: '14px', marginBottom: '20px' }}>
                  Start applying to jobs and your activity will appear here.
                </p>
                <Link to="/jobs" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 24px',
                  background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff',
                  borderRadius: '10px', fontWeight: '700', textDecoration: 'none', fontSize: '14px',
                }}>
                  Browse Jobs →
                </Link>
              </div>
            )}

            {/* Application list */}
            {!appsLoading && !appsError && applications.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {applications.map(app => (
                  <ApplicationRow key={app.id} app={app} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════ */}
        {/* TAB: Profile & Stats                                      */}
        {/* ════════════════════════════════════════════════════════ */}
        {activeTab === 'profile' && (
          <div style={{ animation: 'fadeIn 0.3s ease', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

            {/* Profile card */}
            <div style={{
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px',
              padding: '32px', gridColumn: 'span 1',
            }}>
              {/* Avatar */}
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', fontWeight: '900', color: '#fff', marginBottom: '20px',
              }}>
                {(user?.fullName || 'C')[0].toUpperCase()}
              </div>

              <div style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
                {user?.fullName || 'Candidate'}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                {user?.email}
              </div>

              <span style={{
                display: 'inline-block', padding: '4px 14px', borderRadius: '20px',
                fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px',
                background: '#dcfce7', color: '#166534', marginBottom: '24px',
              }}>
                {user?.role || 'candidate'}
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { label: 'Applications', value: totalApps, color: '#6366f1', bg: '#ede9fe' },
                  { label: 'Shortlisted',  value: shortlisted, color: '#16a34a', bg: '#dcfce7' },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} style={{
                    textAlign: 'center', padding: '16px', borderRadius: '10px', background: bg,
                  }}>
                    <div style={{ fontSize: '28px', fontWeight: '900', color }}>{value}</div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginTop: '4px' }}>{label}</div>
                  </div>
                ))}
              </div>

              <Link to="/jobs" style={{
                display: 'block', marginTop: '20px', padding: '12px', textAlign: 'center',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff',
                borderRadius: '10px', fontWeight: '700', fontSize: '14px', textDecoration: 'none',
              }}>
                🔍 Find More Jobs
              </Link>
            </div>

            {/* AI Recommended Jobs */}
            <div style={{ gridColumn: 'span 1' }}>
              <div style={{ ...S.sectionTitle, marginBottom: '14px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                </svg>
                AI Recommended Jobs
              </div>

              {jobsLoading && (
                <p style={{ color: '#64748b', fontSize: '14px' }}>Loading recommendations…</p>
              )}

              {!jobsLoading && jobs.length === 0 && (
                <p style={{ color: '#64748b', fontSize: '14px' }}>No open jobs at the moment.</p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {jobs.map(job => (
                  <JobRecommendationCard key={job.id} job={job} />
                ))}
              </div>

              {!jobsLoading && (
                <Link to="/jobs" style={{
                  display: 'block', marginTop: '16px', textAlign: 'center',
                  fontSize: '13px', fontWeight: '700', color: '#6366f1', textDecoration: 'none',
                }}>
                  View all jobs →
                </Link>
              )}
            </div>

          </div>
        )}

        {/* ── AI Recommended Jobs (always visible below applications tab) ── */}
        {activeTab === 'applications' && (
          <div style={{ marginTop: '48px', animation: 'fadeIn 0.3s ease' }}>
            <div style={S.sectionTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
              AI Recommended For You
            </div>

            {jobsLoading && (
              <p style={{ color: '#64748b', fontSize: '14px' }}>Loading recommendations…</p>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {jobs.map(job => (
                <JobRecommendationCard key={job.id} job={job} />
              ))}
            </div>

            {!jobsLoading && (
              <div style={{ textAlign: 'right', marginTop: '12px' }}>
                <Link to="/jobs" style={{ fontSize: '13px', fontWeight: '700', color: '#6366f1', textDecoration: 'none' }}>
                  Explore all jobs →
                </Link>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default CandidateDashboard;
