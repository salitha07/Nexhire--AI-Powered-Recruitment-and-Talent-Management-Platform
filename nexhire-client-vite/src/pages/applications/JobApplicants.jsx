// src/pages/applications/JobApplicants.jsx
// Recruiter view: list applicants, shortlist/reject, run AI analysis,
// schedule & reschedule interviews with AI prep suggestions.

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link }                  from 'react-router-dom';
import { toast, ToastContainer }            from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar              from '../../components/Navbar';
import AIAnalysisCard      from '../../components/AIAnalysisCard';
import { getApplicationsForJob, updateApplicationStatus } from '../../services/applicationsApi';
import {
  getInterviewPrep,
  scheduleInterview,
  updateInterview,
  getInterviewsForApplication,
} from '../../services/interviewsApi';

// ─── Design tokens ──────────────────────────────────────────────────────────
const C = {
  blue:    '#1e40af', blueLt:   '#dbeafe',
  green:   '#166534', greenLt:  '#dcfce7',
  red:     '#991b1b', redLt:    '#fee2e2',
  slate:   '#64748b', border:   '#e2e8f0',
  bg:      '#f8fafc', white:    '#ffffff', text: '#1e293b',
  purple:  '#5b21b6', purpleLt: '#ede9fe',
  teal:    '#0f766e', tealLt:   '#ccfbf1',
};

const statusColors = {
  Applied:    { background: C.blueLt,  color: C.blue  },
  Shortlisted:{ background: C.greenLt, color: C.green },
  Rejected:   { background: C.redLt,   color: C.red   },
};

const modeIcon = { Online: '🌐', 'In-Person': '🏢', Phone: '📞' };

// ─── Helpers ────────────────────────────────────────────────────────────────
function Badge({ label, color, bg }) {
  return (
    <span style={{ fontSize:'11px', fontWeight:'700', padding:'3px 10px',
      borderRadius:'20px', background: bg, color, whiteSpace:'nowrap' }}>
      {label}
    </span>
  );
}

function Btn({ onClick, disabled, color, bg, border, children, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding:'7px 14px', borderRadius:'8px', fontSize:'13px', fontWeight:'600',
      cursor: disabled ? 'not-allowed' : 'pointer', border: border || 'none',
      background: bg || 'transparent', color, opacity: disabled ? 0.55 : 1,
      display:'inline-flex', alignItems:'center', gap:'5px', transition:'opacity 0.15s',
      ...style,
    }}>{children}</button>
  );
}

// ─── Scheduled Interview Info Chip ───────────────────────────────────────────
function InterviewChip({ interview, onEdit }) {
  const d = new Date(interview.scheduledAt);
  const label = d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  const isPast = d < new Date();

  return (
    <div style={{
      display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap',
      background: isPast ? '#f1f5f9' : C.tealLt,
      border: `1px solid ${isPast ? '#cbd5e1' : '#5eead4'}`,
      borderRadius:'10px', padding:'10px 14px', marginTop:'12px',
    }}>
      <div style={{ fontSize:'18px' }}>{modeIcon[interview.mode] || '📅'}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:'12px', fontWeight:'700',
          color: isPast ? C.slate : C.teal, letterSpacing:'0.4px' }}>
          {isPast ? 'PAST INTERVIEW' : 'INTERVIEW SCHEDULED'}
        </div>
        <div style={{ fontSize:'13px', fontWeight:'600', color: C.text, marginTop:'2px' }}>
          {label} · {interview.mode}
        </div>
        {interview.meetingLink && (
          <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer"
            style={{ fontSize:'12px', color: C.blue, textDecoration:'none', marginTop:'2px', display:'block' }}>
            🔗 {interview.meetingLink.length > 40
              ? interview.meetingLink.slice(0, 40) + '…'
              : interview.meetingLink}
          </a>
        )}
      </div>
      <Btn
        onClick={onEdit}
        color={C.purple} bg={C.purpleLt}
        border={`1px solid #c4b5fd`}
        style={{ flexShrink:0 }}
      >✏️ Reschedule</Btn>
    </div>
  );
}

// ─── Schedule / Reschedule Modal ─────────────────────────────────────────────
function ScheduleModal({ app, existingInterview, onClose, onSaved }) {
  const isEdit = !!existingInterview;

  // Pre-fill with existing data when editing
  const toLocalInput = (isoStr) => {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    // datetime-local expects "YYYY-MM-DDTHH:mm"
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [form, setForm] = useState({
    scheduledAt: isEdit ? toLocalInput(existingInterview.scheduledAt) : '',
    mode:        isEdit ? existingInterview.mode        : 'Online',
    meetingLink: isEdit ? existingInterview.meetingLink : '',
  });

  const [submitting, setSubmitting]   = useState(false);
  const [loadingPrep, setLoadingPrep] = useState(false);
  const [prep, setPrep]               = useState(null);
  const [prepError, setPrepError]     = useState('');

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleGetPrep = async () => {
    setLoadingPrep(true); setPrepError(''); setPrep(null);
    try {
      const data = await getInterviewPrep(app.id);
      setPrep(data);
      if (data.recommendedMode) setForm(prev => ({ ...prev, mode: data.recommendedMode }));
    } catch (err) {
      setPrepError(err.response?.data?.message || 'AI suggestions unavailable. Try again.');
    } finally { setLoadingPrep(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.scheduledAt) { toast.error('Please select a date and time.'); return; }
    const scheduledAt = new Date(form.scheduledAt).toISOString();
    if (new Date(scheduledAt) <= new Date()) {
      toast.error('Interview time must be in the future.');
      return;
    }
    setSubmitting(true);
    try {
      let result;
      if (isEdit) {
        result = await updateInterview(existingInterview.id, {
          status: 'Scheduled',
          scheduledAt,
        });
        // Also update mode/link if changed — backend only supports scheduledAt+status for now
        // We store the updated form values optimistically on the result
        result = { ...result, mode: form.mode, meetingLink: form.meetingLink };
      } else {
        result = await scheduleInterview({
          applicationId: app.id,
          scheduledAt,
          mode:        form.mode,
          meetingLink: form.meetingLink,
        });
      }
      toast.success(isEdit ? 'Interview rescheduled!' : 'Interview scheduled!');
      onSaved(result);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save interview.');
    } finally { setSubmitting(false); }
  };

  return (
    <div onClick={onClose} style={{
      position:'fixed', inset:0, background:'rgba(15,23,42,0.6)',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:300, padding:'20px', overflowY:'auto',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.white, borderRadius:'18px',
        width:'100%', maxWidth:'640px',
        boxShadow:'0 24px 64px rgba(0,0,0,0.22)',
        maxHeight:'90vh', overflowY:'auto',
      }}>
        {/* Header */}
        <div style={{
          background: isEdit
            ? 'linear-gradient(135deg,#1e3a5f,#5b21b6)'
            : 'linear-gradient(135deg,#1e3a5f,#1e40af,#3b82f6)',
          padding:'24px 28px', borderRadius:'18px 18px 0 0',
          display:'flex', justifyContent:'space-between', alignItems:'center',
        }}>
          <div>
            <div style={{ color:'#bfdbfe', fontSize:'12px', fontWeight:'700', letterSpacing:'1px', marginBottom:'4px' }}>
              {isEdit ? '✏️ RESCHEDULE INTERVIEW' : '📅 SCHEDULE INTERVIEW'}
            </div>
            <div style={{ color:'#fff', fontSize:'18px', fontWeight:'800' }}>
              {app.candidateFullName}
            </div>
            <div style={{ color:'#93c5fd', fontSize:'13px', marginTop:'2px' }}>{app.jobTitle}</div>
          </div>
          <button onClick={onClose} style={{
            background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%',
            width:'34px', height:'34px', color:'#fff', cursor:'pointer', fontSize:'18px',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>×</button>
        </div>

        <div style={{ padding:'28px' }}>
          {/* ── AI Suggestions Panel ─────────────────────────── */}
          <div style={{
            background: prep
              ? 'linear-gradient(135deg,#1e1b4b,#312e81)'
              : 'linear-gradient(135deg,#ede9fe,#ddd6fe)',
            borderRadius:'12px', padding:'16px 20px', marginBottom:'24px',
            border:'1px solid #c4b5fd',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: prep ? '16px' : '0' }}>
              <div>
                <div style={{ fontWeight:'800', fontSize:'14px', color: prep ? '#e0e7ff' : C.purple }}>
                  ✨ AI Interview Prep
                </div>
                <div style={{ fontSize:'12px', color: prep ? '#a5b4fc' : '#7c3aed', marginTop:'2px' }}>
                  {prep
                    ? `Mode: ${prep.recommendedMode} · ${prep.recommendedDuration}`
                    : 'Get tailored questions & focus areas for this candidate'}
                </div>
              </div>
              <Btn onClick={handleGetPrep} disabled={loadingPrep}
                color={prep ? '#e0e7ff' : C.purple}
                bg={prep ? 'rgba(255,255,255,0.12)' : '#fff'}
                border={`1.5px solid ${prep ? '#a5b4fc' : '#c4b5fd'}`}>
                {loadingPrep ? '⏳ Analyzing…' : prep ? '🔄 Refresh' : '✨ Get AI Suggestions'}
              </Btn>
            </div>

            {prepError && <div style={{ color:'#fca5a5', fontSize:'13px', marginTop:'8px' }}>⚠️ {prepError}</div>}

            {prep && (
              <div>
                <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:'8px',
                  padding:'12px 14px', marginBottom:'14px', color:'#c7d2fe',
                  fontSize:'13px', lineHeight:'1.7', borderLeft:'3px solid #818cf8' }}>
                  {prep.rationale}
                </div>

                {prep.focusAreas?.length > 0 && (
                  <div style={{ marginBottom:'14px' }}>
                    <div style={{ color:'#a5b4fc', fontSize:'11px', fontWeight:'700', letterSpacing:'1px', marginBottom:'8px' }}>
                      FOCUS AREAS TO PROBE
                    </div>
                    <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                      {prep.focusAreas.map((area, i) => (
                        <span key={i} style={{ background:'rgba(129,140,248,0.2)', color:'#c7d2fe',
                          padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'600',
                          border:'1px solid rgba(165,180,252,0.3)' }}>{area}</span>
                      ))}
                    </div>
                  </div>
                )}

                {prep.suggestedQuestions?.length > 0 && (
                  <div>
                    <div style={{ color:'#a5b4fc', fontSize:'11px', fontWeight:'700', letterSpacing:'1px', marginBottom:'10px' }}>
                      AI-GENERATED INTERVIEW QUESTIONS
                    </div>
                    <ol style={{ margin:0, paddingLeft:'20px', display:'flex', flexDirection:'column', gap:'10px' }}>
                      {prep.suggestedQuestions.map((q, i) => (
                        <li key={i}
                          onClick={() => { navigator.clipboard.writeText(q); toast.info('Question copied!', { autoClose:1500 }); }}
                          title="Click to copy"
                          style={{ color:'#e0e7ff', fontSize:'13px', lineHeight:'1.65',
                            background:'rgba(255,255,255,0.06)', borderRadius:'8px', padding:'10px 14px',
                            cursor:'pointer', border:'1px solid rgba(165,180,252,0.2)' }}>
                          {q} <span style={{ marginLeft:'8px', fontSize:'10px', color:'#818cf8' }}>📋</span>
                        </li>
                      ))}
                    </ol>
                    <div style={{ color:'#6366f1', fontSize:'11px', marginTop:'8px' }}>Click any question to copy it</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Form ─────────────────────────────────────────── */}
          <form onSubmit={handleSubmit}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px' }}>
              <div>
                <label style={{ fontSize:'12px', fontWeight:'700', color:'#374151', display:'block', marginBottom:'6px' }}>
                  Date & Time *
                </label>
                <input type="datetime-local" name="scheduledAt"
                  value={form.scheduledAt} onChange={handleChange} required
                  style={{ width:'100%', padding:'10px 12px', borderRadius:'8px',
                    border:'1.5px solid #e2e8f0', fontSize:'14px', color: C.text,
                    background:'#f8fafc', boxSizing:'border-box', outline:'none' }} />
              </div>

              <div>
                <label style={{ fontSize:'12px', fontWeight:'700', color:'#374151', display:'block', marginBottom:'6px' }}>
                  Interview Mode
                  {prep && <span style={{ marginLeft:'6px', color: C.purple, fontSize:'11px' }}>✨ AI: {prep.recommendedMode}</span>}
                </label>
                <select name="mode" value={form.mode} onChange={handleChange}
                  style={{ width:'100%', padding:'10px 12px', borderRadius:'8px',
                    border:'1.5px solid #e2e8f0', fontSize:'14px', color: C.text,
                    background:'#f8fafc', boxSizing:'border-box', outline:'none', cursor:'pointer' }}>
                  <option value="Online">🌐 Online</option>
                  <option value="In-Person">🏢 In-Person</option>
                  <option value="Phone">📞 Phone</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom:'20px' }}>
              <label style={{ fontSize:'12px', fontWeight:'700', color:'#374151', display:'block', marginBottom:'6px' }}>
                Meeting Link (optional)
              </label>
              <input type="url" name="meetingLink" value={form.meetingLink} onChange={handleChange}
                placeholder="https://meet.google.com/..."
                style={{ width:'100%', padding:'10px 12px', borderRadius:'8px',
                  border:'1.5px solid #e2e8f0', fontSize:'14px', color: C.text,
                  background:'#f8fafc', boxSizing:'border-box', outline:'none' }} />
            </div>

            <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
              <button type="button" onClick={onClose} style={{
                padding:'10px 22px', border:'1.5px solid #e2e8f0', borderRadius:'8px',
                background: C.white, color: C.slate, fontSize:'13px', fontWeight:'600', cursor:'pointer' }}>
                Cancel
              </button>
              <button type="submit" disabled={submitting} style={{
                padding:'10px 26px', border:'none', borderRadius:'8px',
                background: isEdit
                  ? 'linear-gradient(135deg,#5b21b6,#7c3aed)'
                  : 'linear-gradient(135deg,#1e40af,#3b82f6)',
                color:'#fff', fontSize:'13px', fontWeight:'700',
                cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.65 : 1 }}>
                {submitting ? 'Saving…' : isEdit ? '✏️ Save Changes' : '📅 Confirm Interview'}
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

  const [applicants,    setApplicants]    = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [updatingId,    setUpdatingId]    = useState(null);
  const [filter,        setFilter]        = useState('All');
  // Map of applicationId → latest interview object
  const [interviewMap,  setInterviewMap]  = useState({});
  // App being scheduled/rescheduled
  const [modalApp,      setModalApp]      = useState(null);

  // Fetch interviews for all shortlisted applicants in parallel
  const loadInterviews = useCallback(async (apps) => {
    const shortlisted = apps.filter(a => a.status === 'Shortlisted');
    const results = await Promise.allSettled(
      shortlisted.map(a => getInterviewsForApplication(a.id))
    );
    const map = {};
    results.forEach((r, i) => {
      if (r.status === 'fulfilled' && r.value?.length > 0) {
        // Take the most recently created interview
        const sorted = [...r.value].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        map[shortlisted[i].id] = sorted[0];
      }
    });
    setInterviewMap(map);
  }, []);

  const fetchApplicants = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await getApplicationsForJob(id);
      setApplicants(data);
      await loadInterviews(data);
    } catch {
      setError('Failed to load applicants. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id, loadInterviews]);

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
    } finally { setUpdatingId(null); }
  };

  // Called when interview is saved (new or updated)
  const handleInterviewSaved = (interview) => {
    setInterviewMap(prev => ({
      ...prev,
      [interview.applicationId]: interview,
    }));
  };

  const filtered = filter === 'All' ? applicants : applicants.filter(a => a.status === filter);

  return (
    <div style={{ minHeight:'100vh', background: C.bg, fontFamily:"'Segoe UI', sans-serif" }}>
      <ToastContainer position="top-right" autoClose={3000} />

      {modalApp && (
        <ScheduleModal
          app={modalApp}
          existingInterview={interviewMap[modalApp.id] || null}
          onClose={() => setModalApp(null)}
          onSaved={handleInterviewSaved}
        />
      )}

      <Navbar />

      <div style={{ maxWidth:'960px', margin:'0 auto', padding:'40px 24px' }}>
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
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:'6px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'600',
              cursor:'pointer', border:'1px solid #e2e8f0', transition:'all 0.15s',
              background: filter === f ? C.blue : C.white,
              color: filter === f ? '#fff' : C.slate,
            }}>{f}</button>
          ))}
        </div>

        {loading && <p style={{ color: C.slate }}>Loading applicants…</p>}
        {error   && <p style={{ color: C.red }}>{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p style={{ color: C.slate }}>No applicants in this category.</p>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {filtered.map(app => {
            const badge     = statusColors[app.status] || statusColors.Applied;
            const interview = interviewMap[app.id] || null;

            return (
              <div key={app.id} style={{
                background: C.white, border:`1px solid ${C.border}`,
                borderRadius:'14px', padding:'22px 24px',
                boxShadow:'0 2px 8px rgba(0,0,0,0.05)',
              }}>
                {/* Header row */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'8px' }}>
                  <div>
                    <div style={{ fontSize:'16px', fontWeight:'700', color: C.text }}>
                      {app.candidateFullName || app.candidateEmail}
                    </div>
                    <div style={{ fontSize:'13px', color:'#94a3b8', marginTop:'3px' }}>
                      Applied {new Date(app.appliedAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                    </div>
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
                    <div style={{ fontSize:'11px', fontWeight:'700', color: C.slate, letterSpacing:'0.5px', marginBottom:'5px' }}>SKILLS</div>
                    <div style={{ display:'flex', gap:'5px', flexWrap:'wrap' }}>
                      {app.skills.split(',').slice(0, 8).map((s, i) => (
                        <span key={i} style={{ background:'#f1f5f9', color:'#334155', padding:'3px 9px',
                          borderRadius:'6px', fontSize:'12px', fontWeight:'500' }}>{s.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cover letter */}
                {app.coverLetter && (
                  <p style={{ marginTop:'12px', fontSize:'13px', color:'#475569', lineHeight:'1.7',
                    background:'#f8fafc', borderRadius:'8px', padding:'10px 12px', borderLeft:'3px solid #e2e8f0' }}>
                    {app.coverLetter.length > 280 ? app.coverLetter.slice(0, 280) + '…' : app.coverLetter}
                  </p>
                )}

                {/* Resume */}
                {app.resumePath ? (
                  <div style={{ display:'flex', gap:'8px', marginTop:'12px', flexWrap:'wrap' }}>
                    <a href={`http://localhost:5000${app.resumePath}`} target="_blank" rel="noopener noreferrer"
                      style={{ padding:'7px 14px', background: C.blue, color:'#fff',
                        textDecoration:'none', borderRadius:'8px', fontSize:'12px', fontWeight:'600' }}>
                      📄 View Resume
                    </a>
                    <a href={`http://localhost:5000${app.resumePath}`} download
                      style={{ padding:'7px 14px', background:'#475569', color:'#fff',
                        textDecoration:'none', borderRadius:'8px', fontSize:'12px', fontWeight:'600' }}>
                      ⬇ Download
                    </a>
                  </div>
                ) : (
                  <p style={{ marginTop:'12px', color:'#94a3b8', fontSize:'12px' }}>No resume uploaded</p>
                )}

                {/* Action buttons */}
                <div style={{ display:'flex', gap:'8px', marginTop:'16px', flexWrap:'wrap', alignItems:'center' }}>
                  {app.status === 'Applied' && (
                    <>
                      <Btn onClick={() => handleStatusChange(app.id, 'Shortlisted')}
                        disabled={updatingId === app.id} color={C.white} bg={C.green}>
                        ✓ Shortlist
                      </Btn>
                      <Btn onClick={() => handleStatusChange(app.id, 'Rejected')}
                        disabled={updatingId === app.id} color={C.white} bg={C.red}>
                        ✕ Reject
                      </Btn>
                    </>
                  )}

                  {/* Show Schedule button only if shortlisted AND no interview yet */}
                  {app.status === 'Shortlisted' && !interview && (
                    <Btn
                      onClick={() => setModalApp(app)}
                      color={C.white}
                      bg="linear-gradient(135deg,#5b21b6,#7c3aed)"
                      style={{ boxShadow:'0 2px 8px rgba(91,33,182,0.3)' }}>
                      📅 Schedule Interview
                    </Btn>
                  )}
                </div>

                {/* ── Interview chip (shows after scheduling) ── */}
                {app.status === 'Shortlisted' && interview && (
                  <InterviewChip
                    interview={interview}
                    onEdit={() => setModalApp(app)}
                  />
                )}

                {/* AI Analysis */}
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