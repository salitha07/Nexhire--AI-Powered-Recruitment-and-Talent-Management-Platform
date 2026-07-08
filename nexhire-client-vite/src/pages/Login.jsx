import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
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
    gap: '18px',
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
    transition: 'border-color 0.2s',
  },
  forgotRow: {
    textAlign: 'right',
    marginTop: '-8px',
  },
  forgotBtn: {
    background: 'none',
    border: 'none',
    fontSize: '12px',
    color: '#3b82f6',
    cursor: 'pointer',
    padding: '0',
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

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/api/auth/login', formData);
      const token = res.data.token;
      const email = res.data.email;
      const fullName = res.data.fullName;
      const role = res.data.role;
      const expiresAt = res.data.expiresAt;
      login(token, { email, fullName, role, expiresAt });
      toast.success('Login successful!');
      if (role === 'candidate') navigate('/candidate/dashboard');
      else if (role === 'recruiter') navigate('/recruiter/dashboard');
      else if (role === 'hiring_manager') navigate('/hiring/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
      else navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getInputStyle = (name) => ({
    ...styles.input,
    borderColor: focusedInput === name ? '#3b82f6' : '#e2e8f0',
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

        <h2 style={styles.title}>Sign in to your account</h2>

        <form style={styles.form} onSubmit={handleSubmit}>
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
              required
            />
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
              placeholder="Enter your password"
              style={getInputStyle('password')}
              required
            />
          </div>

          <div style={styles.forgotRow}>
            <button type="button" style={styles.forgotBtn}>
              Forgot your password?
            </button>
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
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.footerLink}>Create one</Link>
        </div>

      </div>
    </div>
  );
}

export default Login;
