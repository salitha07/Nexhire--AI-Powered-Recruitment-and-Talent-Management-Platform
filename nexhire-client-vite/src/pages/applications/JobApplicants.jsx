// src/pages/applications/JobApplicants.jsx
// Recruiter view: list applicants, shortlist/reject, run AI analysis,
// and schedule interviews with AI-generated prep suggestions.

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link }                  from 'react-router-dom';
import { toast, ToastContainer }            from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar              from '../../components/Navbar';
import AIAnalysisCard      from '../../components/AIAnalysisCard';
import { getApplicationsForJob, updateApplicationStatus } from '../../services/applicationsApi';
import { getInterviewPrep, scheduleInterview }            from '../../services/interviewsApi';

// ─── Design tokens ──────────────────────────────────────────────────────────
const C = {
  blue:   '#1e40af',
  blueLt: '#dbeafe',
  green:  '#166534',
  greenLt:'#dcfce7',
  red:    '#991b1b',
  redLt:  '#fee2e2',
  slate:  '#64748b',
  border: '#e2e8f0',
  bg:     '#f8fafc',
  white:  '#ffffff',
  text:   '#1e293b',
  purple: '#5b21b6',
  purpleLt:'#ede9fe',
  amber:  '#92400e',
  amberLt:'#fef3c7',
};

const statusColors = {
  Applied:    { background: C.blueLt,   color: C.blue  },
  Shortlisted:{ background: C.greenLt,  color: C.green },
  Rejected:   { background: C.redLt,    color: C.red   },
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function Badge({ label, color, bg }) {
  return (
    <span style={{
      fontSize:'11px', fontWeight:'700', padding:'3px 10px',
      borderRadius:'20px', background: bg, color,
      whiteSpace:'nowrap',
    }}>{label}</span>
  );
}

function IconBtn({ onClick, disabled, color, bg, border, children, style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding:'7px 14px', borderRadius:'8px', fontSize:'13px',
        fontWeight:'600', cursor: disabled ? 'not-allowed' : 'pointer',
        border: border || 'none',
        background: bg || 'transparent', color,
        opacity: disabled ? 0.55 : 1,
        display:'inline-flex', alignItems:'center', gap:'5px',
        transition:'opacity 0.15s',
        ...style,
      }}
    >{children}</button>
  );
}

// ─── Schedule Interview Modal ────────────────────────────────────────────────
function ScheduleModal({ app, onClose, onScheduled }) {
  const [form, setForm] = useState({
    scheduledAt: '',
    mode: 'Online',
    meetingLink: '',
  });
  const [submitting, setSubmitting]   = useState(false);
  const [loadingPrep, setLoadingPrep] = useState(false);
  const [prep, setPrep]               = useState(null);
  const [prepError, setPrepError]     = useState('');

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleGetPrep = async () => {
    setLoadingPrep(true);
    setPrepError('');
    setPrep(null);
    try {
      const data = await getInterviewPrep(app.id);
      setPrep(data);
      // Auto-fill the mode field with AI recommendation
      if (data.recommendedMode) {
        setForm(prev => ({ ...prev, mode: data.recommendedMode }));
      }
    } catch (err) {
      setPrepError(err.response?.data?.message || 'AI suggestions unavailable. Please try again.');
    } finally {
      setLoadingPrep(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.scheduledAt) {
      toast.error('Please select a date and time.');
      return;
    }
    setSubmitting(true);
    try {
      await scheduleInterview({
        applicationId: app.id,
        scheduledAt:   new Date(form.scheduledAt).toISOString(),
        mode:          form.mode,
        meetingLink:   form.meetingLink,
      });
      toast.success('Interview scheduled successfully!');
      onScheduled();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule interview.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position:'fixed', inset:0,
        background:'rgba(15,23,42,0.6)',
        display:'flex', alignItems:'center', justifyContent:'center',
        zIndex:300, padding:'20px', overflowY:'auto',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.white, borderRadius:'18px',
          width:'100%', maxWidth:'640px',
          boxShadow:'0 24px 64px rgba(0,0,0,0.22)',
          maxHeight:'90vh', overflowY:'auto',
        }}
      >
        {/* Modal Header */}
        <div style={{
          background:'linear-gradient(135deg,#1e3a5f,#1e40af,#3b82f6)',
          padding:'24px 28px', borderRadius:'18px 18px 0 0',
          display:'flex', justifyContent:'space-between', alignItems:'center',
        }}>
          <div>
            <div style={{ color:'#bfdbfe', fontSize:'12px', fontWeight:'700', letterSpacing:'1px', marginBottom:'4px' }}>
              📅 SCHEDULE INTERVIEW
            </div>
            <div style={{ color:'#fff', fontSize:'18px', fontWeight:'800' }}>
              {app.candidateFullName}
            </div>
            <div style={{ color:'#93c5fd', fontSize:'13px', marginTop:'2px' }}>
              {app.jobTitle}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%',
              width:'34px', height:'34px', color:'#fff', cursor:'pointer', fontSize:'18px',
              display:'flex', alignItems:'center', justifyContent:'center' }}
          >×</button>
        </div>

        <div style={{ padding:'28px' }}>
          {/* ── AI Suggestions Button ───────────────────────────── */}
          <div style={{
            background: prep
              ? 'linear-gradient(135deg,#1e1b4b,#312e81)'
              : 'linear-gradient(135deg,#ede9fe,#ddd6fe)',
            borderRadius:'12px', padding:'16px 20px',
            marginBottom:'24px', border:'1px solid #c4b5fd',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: prep ? '16px' : '0' }}>
              <div>
                <div style={{ fontWeight:'800', fontSize:'14px', color: prep ? '#e0e7ff' : C.purple }}>
                  ✨ AI Interview Prep
                </div>
                <div style={{ fontSize:'12px', color: prep ? '#a5b4fc' : '#7c3aed', marginTop:'2px' }}>
                  {prep
                    ? `Mode: ${prep.recommendedMode} · ${prep.recommendedDuration}`
                    : 'Get tailored questions & focus areas for this candidate'
                  }
                </div>
              </div>
              <IconBtn
                onClick={handleGetPrep}
                disabled={loadingPrep}
                color={prep ? '#e0e7ff' : C.purple}
                bg={prep ? 'rgba(255,255,255,0.12)' : '#fff'}
                border={`1.5px solid ${prep ? '#a5b4fc' : '#c4b5fd'}`}
              >
                {loadingPrep ? '⏳ Analyzing…' : prep ? '🔄 Refresh' : '✨ Get AI Suggestions'}
              </IconBtn>
            </div>

            {/* Error state */}
            {prepError && (
              <div style={{ color:'#fca5a5', fontSize:'13px', marginTop:'8px' }}>⚠️ {prepError}</div>
            )}

            {/* AI Prep Results */}
            {prep && (
              <div>
                {/* Rationale */}
                <div style={{
                  background:'rgba(255,255,255,0.08)', borderRadius:'8px',
                  padding:'12px 14px', marginBottom:'14px',
                  color:'#c7d2fe', fontSize:'13px', lineHeight:'1.7',
                  borderLeft:'3px solid #818cf8',
                }}>
                  {prep.rationale}
                </div>

                {/* Focus Areas */}
                {prep.focusAreas?.length > 0 && (
                  <div style={{ marginBottom:'14px' }}>
                    <div style={{ color:'#a5b4fc', fontSize:'11px', fontWeight:'700',
                      letterSpacing:'1px', marginBottom:'8px' }}>FOCUS AREAS TO PROBE</div>
                    <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                      {prep.focusAreas.map((area, i) => (
                        <span key={i} style={{
                          background:'rgba(129,140,248,0.2)', color:'#c7d2fe',
                          padding:'4px 12px', borderRadius:'20px', fontSize:'12px',
                          fontWeight:'600', border:'1px solid rgba(165,180,252,0.3)',
                        }}>{area}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Questions */}
                {prep.suggestedQuestions?.length > 0 && (
                  <div>
                    <div style={{ color:'#a5b4fc', fontSize:'11px', fontWeight:'700',
                      letterSpacing:'1px', marginBottom:'10px' }}>AI-GENERATED INTERVIEW QUESTIONS</div>
                    <ol style={{ margin:0, paddingLeft:'20px', display:'flex', flexDirection:'column', gap:'10px' }}>
                      {prep.suggestedQuestions.map((q, i) => (
                        <li key={i} style={{
                          color:'#e0e7ff', fontSize:'13px', lineHeight:'1.65',
                          background:'rgba(255,255,255,0.06)', borderRadius:'8px',
                          padding:'10px 14px', cursor:'pointer',
                          border:'1px solid rgba(165,180,252,0.2)',
                        }}
                          title="Click to copy"
                          onClick={() => {
                            navigator.clipboard.writeText(q);
                            toast.info('Question copied!', { autoClose: 1500 });
                          }}
                        >
                          {q}
                          <span style={{ marginLeft:'8px', fontSize:'10px', color:'#818cf8' }}>📋</span>
                        </li>
                      ))}
                    </ol>
                    <div style={{ color:'#6366f1', fontSize:'11px', marginTop:'8px' }}>
                      Click any question to copy it
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Schedule Form ──────────────────────────────────── */}
          <form onSubmit={handleSubmit}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px' }}>
              {/* Date & Time */}
              <div>
                <label style={{ fontSize:'12px', fontWeight:'700', color:'#374151',
                  display:'block', marginBottom:'6px' }}>Date & Time *</label>
                <input
                  type="datetime-local"
                  name="scheduledAt"
                  value={form.scheduledAt}
                  onChange={handleChange}
                  required
                  style={{ width:'100%', padding:'10px 12px', borderRadius:'8px',
                    border:'1.5px solid #e2e8f0', fontSize:'14px', color: C.text,
                    background:'#f8fafc', boxSizing:'border-box', outline:'none' }}
                />
              </div>

              {/* Mode */}
              <div>
                <label style={{ fontSize:'12px', fontWeight:'700', color:'#374151',
                  display:'block', marginBottom:'6px' }}>
                  Interview Mode
                  {prep && (
                    <span style={{ marginLeft:'6px', color: C.purple, fontSize:'11px' }}>
                      ✨ AI: {prep.recommendedMode}
                    </span>
                  )}
                </label>
                <select
                  name="mode"
                  value={form.mode}
                  onChange={handleChange}
                  style={{ width:'100%', padding:'10px 12px', borderRadius:'8px',
                    border:'1.5px solid #e2e8f0', fontSize:'14px', color: C.text,
                    background:'#f8fafc', boxSizing:'border-box', outline:'none', cursor:'pointer' }}
                >
                  <option value="Online">🌐 Online</option>
                  <option value="In-Person">🏢 In-Person</option>
                  <option value="Phone">📞 Phone</option>
                </select>
              </div>
            </div>

            {/* Meeting Link */}
            <div style={{ marginBottom:'20px' }}>
              <label style={{ fontSize:'12px', fontWeight:'700', color:'#374151',
                display:'block', marginBottom:'6px' }}>Meeting Link (optional)</label>
              <input
                type="url"
                name="meetingLink"
                value={form.meetingLink}
                onChange={handleChange}
                placeholder="https://meet.google.com/..."
                style={{ width:'100%', padding:'10px 12px', borderRadius:'8px',
                  border:'1.5px solid #e2e8f0', fontSize:'14px', color: C.text,
                  background:'#f8fafc', boxSizing:'border-box', outline:'none' }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
              <button
                type="button" onClick={onClose}
                style={{ padding:'10px 22px', border:'1.5px solid #e2e8f0',
                  borderRadius:'8px', background: C.white, color: C.slate,
                  fontSize:'13px', fontWeight:'600', cursor:'pointer' }}
              >Cancel</button>
              <button
                type="submit"
                disabled={submitting}
                style={{ padding:'10px 26px', border:'none', borderRadius:'8px',
                  background:'linear-gradient(135deg,#1e40af,#3b82f6)', color:'#fff',
                  fontSize:'13px', fontWeight:'700', cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.65 : 1 }}
              >
                {submitting ? 'Scheduling…' : '📅 Confirm Interview'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
function JobApplicants() {
  const { id } = useParams();

  const [applicants, setApplicants]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [updatingId, setUpdatingId]     = useState(null);
  const [filter, setFilter]             = useState('All');
  const [schedulingApp, setSchedulingApp] = useState(null); // app being scheduled

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

  useEffect(() => { fetchApplicants(); }, [fetchApplicants]);

  const handleStatusChange = async (applicationId, status) => {
    setUpdatingId(applicationId);
    try {
      await updateApplicationStatus(applicationId, status);
      toast.success(`Applicant ${status.toLowerCase()}`);
      setApplicants(prev =>
        prev.map(a => a.id === applicationId ? { ...a, status } : a)
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update application.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filter === 'All'
    ? applicants
    : applicants.filter(a => a.status === filter);

  return (
    <div style={{ minHeight:'100vh', background: C.bg, fontFamily:"'Segoe UI', sans-serif" }}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Schedule Modal */}
      {schedulingApp && (
        <ScheduleModal
          app={schedulingApp}
          onClose={() => setSchedulingApp(null)}
          onScheduled={() => toast.success('Interview confirmed!')}
        />
      )}

      <Navbar />

      <div style={{ maxWidth:'960px', margin:'0 auto', padding:'40px 24px' }}>
        {/* Breadcrumb */}
        <Link to="/recruiter/dashboard" style={{ fontSize:'13px', color: C.blue, textDecoration:'none' }}>
          ← Back to Dashboard
        </Link>

        <h1 style={{ fontSize:'26px', fontWeight:'800', color: C.text, margin:'12px 0 4px' }}>
          Applicants
        </h1>
        <p style={{ fontSize:'13px', color: C.slate, marginBottom:'20px' }}>
          {loading ? 'Loading…' : `${filtered.length} of ${applicants.length} applicant${applicants.length !== 1 ? 's' : ''}`}
        </p>

        {/* Filter Tabs */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap' }}>
          {['All', 'Applied', 'Shortlisted', 'Rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding:'6px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'600',
                cursor:'pointer', border:'1px solid #e2e8f0',
                background: filter === f ? C.blue : C.white,
                color: filter === f ? '#fff' : C.slate,
                transition:'all 0.15s',
              }}
            >{f}</button>
          ))}
        </div>

        {/* States */}
        {loading && <p style={{ color: C.slate }}>Loading applicants…</p>}
        {error   && <p style={{ color: C.red }}>{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p style={{ color: C.slate }}>No applicants in this category.</p>
        )}

        {/* Applicant Cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {filtered.map(app => {
            const badge = statusColors[app.status] || statusColors.Applied;
            return (
              <div
                key={app.id}
                style={{
                  background: C.white, border:`1px solid ${C.border}`,
                  borderRadius:'14px', padding:'22px 24px',
                  boxShadow:'0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                {/* Card Header */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'8px' }}>
                  <div>
                    <div style={{ fontSize:'16px', fontWeight:'700', color: C.text }}>
                      {app.candidateFullName || app.candidateEmail}
                    </div>
                    <div style={{ fontSize:'13px', color:'#94a3b8', marginTop:'3px' }}>
                      Applied {new Date(app.appliedAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                    </div>
                    {/* Candidate profile chips */}
                    <div style={{ display:'flex', gap:'6px', marginTop:'8px', flexWrap:'wrap' }}>
                      {app.education && <Badge label={app.education} color={C.blue} bg={C.blueLt} />}
                      {app.experienceYears > 0 && <Badge label={`${app.experienceYears} yr exp`} color={C.green} bg={C.greenLt} />}
                    </div>
                  </div>
                  <Badge label={app.status} color={badge.color} bg={badge.background} />
                </div>

                {/* Skills */}
                {app.skills && (
                  <div style={{ marginTop:'12px' }}>
                    <div style={{ fontSize:'11px', fontWeight:'700', color: C.slate, letterSpacing:'0.5px', marginBottom:'5px' }}>
                      SKILLS
                    </div>
                    <div style={{ display:'flex', gap:'5px', flexWrap:'wrap' }}>
                      {app.skills.split(',').slice(0, 8).map((s, i) => (
                        <span key={i} style={{
                          background:'#f1f5f9', color:'#334155', padding:'3px 9px',
                          borderRadius:'6px', fontSize:'12px', fontWeight:'500',
                        }}>{s.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cover Letter */}
                {app.coverLetter && (
                  <p style={{ marginTop:'12px', fontSize:'13px', color:'#475569', lineHeight:'1.7',
                    background:'#f8fafc', borderRadius:'8px', padding:'10px 12px',
                    borderLeft:'3px solid #e2e8f0' }}>
                    {app.coverLetter.length > 280 ? app.coverLetter.slice(0, 280) + '…' : app.coverLetter}
                  </p>
                )}

                {/* Resume */}
                {app.resumePath ? (
                  <div style={{ display:'flex', gap:'8px', marginTop:'12px', flexWrap:'wrap' }}>
                    <a
                      href={`http://localhost:5000${app.resumePath}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ padding:'7px 14px', background: C.blue, color:'#fff',
                        textDecoration:'none', borderRadius:'8px', fontSize:'12px', fontWeight:'600' }}
                    >📄 View Resume</a>
                    <a
                      href={`http://localhost:5000${app.resumePath}`}
                      download
                      style={{ padding:'7px 14px', background:'#475569', color:'#fff',
                        textDecoration:'none', borderRadius:'8px', fontSize:'12px', fontWeight:'600' }}
                    >⬇ Download</a>
                  </div>
                ) : (
                  <p style={{ marginTop:'12px', color:'#94a3b8', fontSize:'12px' }}>No resume uploaded</p>
                )}

                {/* Action Row */}
                <div style={{ display:'flex', gap:'8px', marginTop:'16px', flexWrap:'wrap', alignItems:'center' }}>
                  {app.status === 'Applied' && (
                    <>
                      <IconBtn
                        onClick={() => handleStatusChange(app.id, 'Shortlisted')}
                        disabled={updatingId === app.id}
                        color={C.white} bg={C.green}
                      >✓ Shortlist</IconBtn>
                      <IconBtn
                        onClick={() => handleStatusChange(app.id, 'Rejected')}
                        disabled={updatingId === app.id}
                        color={C.white} bg={C.red}
                      >✕ Reject</IconBtn>
                    </>
                  )}

                  {/* Schedule Interview — only shown for shortlisted */}
                  {app.status === 'Shortlisted' && (
                    <IconBtn
                      onClick={() => setSchedulingApp(app)}
                      color={C.white}
                      bg="linear-gradient(135deg,#5b21b6,#7c3aed)"
                      style={{ boxShadow:'0 2px 8px rgba(91,33,182,0.3)' }}
                    >
                      📅 Schedule Interview
                    </IconBtn>
                  )}
                </div>

                {/* AI Analysis Card */}
                <div style={{ marginTop:'14px' }}>
                  <AIAnalysisCard applicationId={app.id} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default JobApplicants;