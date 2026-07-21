// src/components/AIAnalysisCard.jsx
// Reusable card displayed below each applicant row after AI analysis runs.
import { useState } from 'react';
import { rankCandidate } from '../services/aiApi';
import { toast } from 'react-toastify';

// ── Score → colour mapping ────────────────────────────────────────────────────
function getScoreStyle(score) {
  if (score >= 75) return { color: '#166534', background: '#dcfce7', border: '1px solid #86efac' };
  if (score >= 50) return { color: '#92400e', background: '#fef3c7', border: '1px solid #fcd34d' };
  return { color: '#991b1b', background: '#fee2e2', border: '1px solid #fca5a5' };
}

// ── Recommendation → colour mapping ──────────────────────────────────────────
function getRecommendationStyle(rec) {
  if (!rec) return {};
  const r = rec.toLowerCase();
  if (r.includes('strong hire')) return { color: '#166534', background: '#dcfce7' };
  if (r.includes('hire')) return { color: '#065f46', background: '#d1fae5' };
  if (r.includes('maybe')) return { color: '#92400e', background: '#fef3c7' };
  return { color: '#991b1b', background: '#fee2e2' };
}

// ── Skill pill ────────────────────────────────────────────────────────────────
function SkillPill({ skill }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '20px',
      background: '#eff6ff',
      color: '#1e40af',
      fontSize: '12px',
      fontWeight: '600',
      border: '1px solid #bfdbfe',
      margin: '3px',
    }}>
      {skill.trim()}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function AIAnalysisCard({ applicationId }) {
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState(null);

  const handleRunAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await rankCandidate(applicationId);
      setAiResult(result);
      toast.success('AI analysis complete!');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        'AI analysis failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const scoreStyle = aiResult ? getScoreStyle(aiResult.matchScore) : {};
  const recStyle = aiResult ? getRecommendationStyle(aiResult.recommendation) : {};
  const skills = aiResult?.extractedSkills
    ? aiResult.extractedSkills.split(',').filter(Boolean)
    : [];

  // Extract the verdict word and the reason sentence
  const [recVerdict, ...recReasonParts] = aiResult?.recommendation?.split('—') ?? [];
  const recReason = recReasonParts.join('—').trim();

  return (
    <div style={{ marginTop: '16px' }}>

      {/* ── Run AI Analysis Button ─────────────────────────────────────────── */}
      <button
        id={`ai-rank-btn-${applicationId}`}
        onClick={handleRunAnalysis}
        disabled={loading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '9px 18px',
          background: loading
            ? '#6366f1'
            : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '700',
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: loading ? 'none' : '0 2px 8px rgba(99,102,241,0.35)',
          transition: 'opacity 0.2s, box-shadow 0.2s',
          opacity: loading ? 0.8 : 1,
          letterSpacing: '0.02em',
        }}
      >
        {/* Spinner */}
        {loading ? (
          <>
            <svg
              style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}
              width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Analysing…
          </>
        ) : (
          <>
            {/* Sparkle icon */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
            {aiResult ? 'Re-run AI Analysis' : 'Run AI Analysis'}
          </>
        )}
      </button>

      {/* Spinner keyframes injected once */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Error state ───────────────────────────────────────────────────── */}
      {error && !loading && (
        <div style={{
          marginTop: '10px',
          padding: '10px 14px',
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#991b1b',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── AI Result Card ────────────────────────────────────────────────── */}
      {aiResult && !loading && (
        <div
          id={`ai-result-card-${applicationId}`}
          style={{
            marginTop: '14px',
            border: '1px solid #e0e7ff',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#fff',
            boxShadow: '0 4px 20px rgba(99,102,241,0.08)',
          }}
        >
          {/* Card header */}
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
            <span style={{ color: '#fff', fontWeight: '700', fontSize: '13px', letterSpacing: '0.04em' }}>
              AI Analysis Result
            </span>
            <span style={{ marginLeft: 'auto', color: '#c7d2fe', fontSize: '11px' }}>
              {new Date(aiResult.createdAt).toLocaleString()}
            </span>
          </div>

          <div style={{ padding: '18px' }}>

            {/* Match Score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{
                width: '68px', height: '68px',
                borderRadius: '50%',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                fontWeight: '800',
                fontSize: '22px',
                flexShrink: 0,
                border: '3px solid',
                ...scoreStyle,
              }}>
                {aiResult.matchScore}
                <span style={{ fontSize: '10px', fontWeight: '600', marginTop: '-2px' }}>/ 100</span>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Match Score
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginTop: '2px' }}>
                  {aiResult.matchScore >= 75 ? 'Strong Match' :
                    aiResult.matchScore >= 50 ? 'Moderate Match' : 'Weak Match'}
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Recommendation
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '5px 12px', borderRadius: '20px',
                fontSize: '13px', fontWeight: '700',
                marginBottom: recReason ? '6px' : '0',
                ...recStyle,
              }}>
                {recVerdict?.trim()}
              </div>
              {recReason && (
                <p style={{ fontSize: '13px', color: '#475569', margin: '6px 0 0', lineHeight: '1.6' }}>
                  {recReason}
                </p>
              )}
            </div>

            {/* Extracted Skills */}
            {skills.length > 0 && (
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Extracted Skills
                </div>
                <div>
                  {skills.map((skill, i) => <SkillPill key={i} skill={skill} />)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AIAnalysisCard;
