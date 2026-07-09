// src/pages/jobs/CreateJob.jsx
// Recruiter-only protected page — form to create a new job posting
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createJob } from '../../services/jobsApi';
import Navbar from '../../components/Navbar';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#1e293b',
  },

  // ─── HEADER ─────────────────────────────────────────
  pageHeader: {
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
    marginBottom: '20px',
  },
  headerTitle: {
    fontSize: '32px',
    fontWeight: '800',
    marginBottom: '8px',
    letterSpacing: '-0.5px',
  },
  headerSubtitle: {
    fontSize: '15px',
    color: '#bfdbfe',
  },

  // ─── FORM CONTAINER ─────────────────────────────────
  formContainer: {
    maxWidth: '760px',
    margin: '0 auto',
    padding: '40px 80px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
    padding: '40px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
  },
  cardSubtitle: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '32px',
  },

  // ─── FORM FIELDS ────────────────────────────────────
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  required: {
    color: '#ef4444',
    fontSize: '13px',
  },
  input: {
    padding: '11px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1e293b',
    background: '#f8fafc',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box',
  },
  textarea: {
    padding: '11px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1e293b',
    background: '#f8fafc',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '120px',
    width: '100%',
    boxSizing: 'border-box',
    lineHeight: '1.6',
  },
  select: {
    padding: '11px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1e293b',
    background: '#f8fafc',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    paddingRight: '36px',
  },
  hint: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '-2px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e2e8f0',
    margin: '8px 0',
  },
  footerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  cancelBtn: {
    padding: '12px 24px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    background: 'white',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'border-color 0.2s',
  },
  submitBtn: {
    padding: '12px 32px',
    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '0.3px',
    transition: 'opacity 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  // ─── VALIDATION ERROR ───────────────────────────────
  fieldError: {
    fontSize: '12px',
    color: '#ef4444',
    marginTop: '-2px',
  },
};

const initialForm = {
  title: '',
  description: '',
  requirements: '',
  location: '',
  type: '',
  salaryRange: '',
};

function CreateJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Job title is required.';
    if (!form.description.trim()) errs.description = 'Description is required.';
    if (!form.requirements.trim()) errs.requirements = 'Requirements are required.';
    if (!form.location.trim()) errs.location = 'Location is required.';
    if (!form.type) errs.type = 'Please select a job type.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const getFocusedStyle = (name) => ({
    borderColor: errors[name] ? '#ef4444' : focused === name ? '#3b82f6' : '#e2e8f0',
    background: focused === name ? '#ffffff' : '#f8fafc',
    boxShadow: focused === name && !errors[name]
      ? '0 0 0 3px rgba(59,130,246,0.1)'
      : errors[name]
      ? '0 0 0 3px rgba(239,68,68,0.08)'
      : 'none',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsLoading(true);
    try {
      await createJob(form);
      toast.success('Job posted successfully! 🎉');
      setTimeout(() => navigate('/recruiter/dashboard'), 1200);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create job. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />

      {/* Page Header */}
      <div style={styles.pageHeader}>
        <Link to="/recruiter/dashboard" style={styles.backLink}>
          ← Back to Dashboard
        </Link>
        <h1 style={styles.headerTitle}>Post a New Job</h1>
        <p style={styles.headerSubtitle}>
          Fill in the details below to create a new job listing.
        </p>
      </div>

      {/* Form Card */}
      <div style={styles.formContainer}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Job Details</div>
          <div style={styles.cardSubtitle}>
            Fields marked with <span style={styles.required}>*</span> are required.
          </div>

          <form style={styles.form} onSubmit={handleSubmit} noValidate>

            {/* Title */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Job Title <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                onFocus={() => setFocused('title')}
                onBlur={() => setFocused(null)}
                placeholder="e.g. Senior Frontend Developer"
                style={{ ...styles.input, ...getFocusedStyle('title') }}
                maxLength={200}
              />
              {errors.title && <span style={styles.fieldError}>{errors.title}</span>}
            </div>

            {/* Description */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Job Description <span style={styles.required}>*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                onFocus={() => setFocused('description')}
                onBlur={() => setFocused(null)}
                placeholder="Describe the role, responsibilities, team culture, and what success looks like..."
                style={{ ...styles.textarea, ...getFocusedStyle('description') }}
              />
              {errors.description
                ? <span style={styles.fieldError}>{errors.description}</span>
                : <span style={styles.hint}>Be specific about day-to-day responsibilities.</span>
              }
            </div>

            {/* Requirements */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Requirements <span style={styles.required}>*</span>
              </label>
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                onFocus={() => setFocused('requirements')}
                onBlur={() => setFocused(null)}
                placeholder="List required skills, experience, qualifications, education..."
                style={{ ...styles.textarea, ...getFocusedStyle('requirements') }}
              />
              {errors.requirements
                ? <span style={styles.fieldError}>{errors.requirements}</span>
                : <span style={styles.hint}>Tip: List requirements as bullet points for readability.</span>
              }
            </div>

            {/* Row: Location + Type */}
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Location <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  onFocus={() => setFocused('location')}
                  onBlur={() => setFocused(null)}
                  placeholder="e.g. Colombo, Sri Lanka"
                  style={{ ...styles.input, ...getFocusedStyle('location') }}
                  maxLength={100}
                />
                {errors.location && <span style={styles.fieldError}>{errors.location}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Job Type <span style={styles.required}>*</span>
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  onFocus={() => setFocused('type')}
                  onBlur={() => setFocused(null)}
                  style={{ ...styles.select, ...getFocusedStyle('type') }}
                >
                  <option value="">Select type…</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                {errors.type && <span style={styles.fieldError}>{errors.type}</span>}
              </div>
            </div>

            {/* Salary Range */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Salary Range</label>
              <input
                type="text"
                name="salaryRange"
                value={form.salaryRange}
                onChange={handleChange}
                onFocus={() => setFocused('salaryRange')}
                onBlur={() => setFocused(null)}
                placeholder="e.g. LKR 100,000 – 150,000 / month"
                style={{ ...styles.input, ...getFocusedStyle('salaryRange') }}
                maxLength={100}
              />
              <span style={styles.hint}>Optional — leave blank if you prefer not to disclose.</span>
            </div>

            <hr style={styles.divider} />

            {/* Footer */}
            <div style={styles.footerRow}>
              <Link to="/recruiter/dashboard" style={styles.cancelBtn}>
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                style={{ ...styles.submitBtn, opacity: isLoading ? 0.65 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
              >
                {isLoading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ animation: 'spin 0.8s linear infinite' }}>
                      <line x1="12" y1="2" x2="12" y2="6" />
                      <line x1="12" y1="18" x2="12" y2="22" />
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                      <line x1="2" y1="12" x2="6" y2="12" />
                      <line x1="18" y1="12" x2="22" y2="12" />
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                    </svg>
                    Posting…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Post Job
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>

      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    </div>
  );
}

export default CreateJob;
