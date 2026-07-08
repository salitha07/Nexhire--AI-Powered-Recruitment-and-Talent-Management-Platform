import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';
import Logo from '../components/Logo';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f0f4f8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '420px',
    padding: '48px 40px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '4px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    padding: '11px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1e293b',
    background: '#f8fafc',
    outline: 'none',
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
  },
  errorText: {
    fontSize: '11px',
    color: '#ef4444',
    marginTop: '2px',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    letterSpacing: '0.3px',
    marginTop: '4px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '13px',
    color: '#64748b',
  },
  footerLink: {
    color: '#1e40af',
    fontWeight: '600',
    textDecoration: 'none',
  },
};

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/api/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      toast.success('Account created! Please sign in.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getInputStyle = (name) => ({
    ...styles.input,
    borderColor: errors[name] ? '#ef4444' : focusedInput === name ? '#3b82f6' : '#e2e8f0',
    background: focusedInput === name ? '#ffffff' : '#f8fafc',
    boxShadow: focusedInput === name ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
  });

  return (
    <div style={styles.page}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={styles.card}>

        <div style={styles.header}>
          <Logo size="md" />
          <p style={styles.subtitle}>AI-Powered Recruitment Platform</p>
        </div>

        <h2 style={styles.title}>Create your account</h2>

        <form style={styles.form} onSubmit={handleSubmit}>

          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onFocus={() => setFocusedInput('fullName')}
              onBlur={() => setFocusedInput(null)}
              placeholder="John Doe"
              style={getInputStyle('fullName')}
            />
            {errors.fullName && <span style={styles.errorText}>{errors.fullName}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              placeholder="you@example.com"
              style={getInputStyle('email')}
            />
            {errors.email && <span style={styles.errorText}>{errors.email}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>I am a...</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              onFocus={() => setFocusedInput('role')}
              onBlur={() => setFocusedInput(null)}
              style={{
                ...styles.select,
                borderColor: focusedInput === 'role' ? '#3b82f6' : '#e2e8f0',
                boxShadow: focusedInput === 'role' ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
              }}
            >
              <option value="candidate">Job Seeker (Candidate)</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              placeholder="Min. 6 characters"
              style={getInputStyle('password')}
            />
            {errors.password && <span style={styles.errorText}>{errors.password}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onFocus={() => setFocusedInput('confirmPassword')}
              onBlur={() => setFocusedInput(null)}
              placeholder="Re-enter your password"
              style={getInputStyle('confirmPassword')}
            />
            {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.submitBtn,
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>

        </form>

        <div style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.footerLink}>Sign in</Link>
        </div>

      </div>
    </div>
  );
}

export default Register;
