import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';
import Logo from '../components/Logo';

const styles = {
 page: {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '30px',
  background:
    'linear-gradient(135deg, #0f172a 0%, #1e3a8a 40%, #3b82f6 100%)',
  fontFamily: "'Segoe UI', sans-serif",
},

container: {
  width: '100%',
  maxWidth: '1100px',
  minHeight: '700px',
  display: 'flex',
  borderRadius: '28px',
  overflow: 'hidden',
  backdropFilter: 'blur(20px)',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.15)',
  boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
},

leftPanel: {
  flex: 1,
  background:
    'linear-gradient(135deg, rgba(30,64,175,0.95), rgba(59,130,246,0.95))',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '60px',
},

leftTitle: {
  fontSize: '42px',
  fontWeight: '700',
  lineHeight: '1.2',
  marginBottom: '20px',
},

leftText: {
  fontSize: '17px',
  lineHeight: '1.8',
  opacity: '0.9',
},

rightPanel: {
  flex: 1,
  background: '#ffffff',
  padding: '50px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
},

header: {
  textAlign: 'center',
  marginBottom: '30px',
},

title: {
  fontSize: '32px',
  fontWeight: '700',
  color: '#0f172a',
  marginBottom: '8px',
},

subtitle: {
  color: '#64748b',
  fontSize: '14px',
},

form: {
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
},

formGroup: {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
},

label: {
  fontSize: '14px',
  fontWeight: '600',
  color: '#334155',
},

input: {
  padding: '14px 16px',
  border: '2px solid #e2e8f0',
  borderRadius: '12px',
  fontSize: '14px',
  transition: 'all 0.3s ease',
  background: '#f8fafc',
},

select: {
  padding: '14px 16px',
  border: '2px solid #e2e8f0',
  borderRadius: '12px',
  fontSize: '14px',
  background: '#f8fafc',
  cursor: 'pointer',
},

submitBtn: {
  width: '100%',
  padding: '15px',
  border: 'none',
  borderRadius: '12px',
  background:
    'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)',
  color: '#fff',
  fontWeight: '700',
  fontSize: '15px',
  cursor: 'pointer',
  marginTop: '10px',
  boxShadow: '0 12px 30px rgba(37,99,235,0.35)',
},

footer: {
  marginTop: '25px',
  textAlign: 'center',
  color: '#64748b',
  fontSize: '14px',
},

footerLink: {
  color: '#2563eb',
  textDecoration: 'none',
  fontWeight: '700',
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

    <div style={styles.container}>

      {/* Left Side */}
      <div style={styles.leftPanel}>
        <h1 style={styles.leftTitle}>
          Find Your Dream Career with AI
        </h1>

        <p style={styles.leftText}>
          Join the next generation recruitment platform.
          Connect talented candidates with leading companies
          through intelligent matching and AI-powered hiring.
        </p>
      </div>

      {/* Right Side */}
      <div style={styles.rightPanel}>

        <div style={styles.header}>
          <Logo size="lg" />
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>
            Start your journey with NexHire today
          </p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>

          {/* Full Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onFocus={() => setFocusedInput('fullName')}
              onBlur={() => setFocusedInput(null)}
              placeholder="Enter your full name"
              style={getInputStyle('fullName')}
            />
            {errors.fullName && (
              <span style={styles.errorText}>{errors.fullName}</span>
            )}
          </div>

          {/* Email */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              placeholder="Enter your email"
              style={getInputStyle('email')}
            />
            {errors.email && (
              <span style={styles.errorText}>{errors.email}</span>
            )}
          </div>

          {/* Role */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Account Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="candidate">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          {/* Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              placeholder="Create password"
              style={getInputStyle('password')}
            />
          </div>

          {/* Confirm Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onFocus={() => setFocusedInput('confirmPassword')}
              onBlur={() => setFocusedInput(null)}
              placeholder="Confirm password"
              style={getInputStyle('confirmPassword')}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={styles.submitBtn}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

        </form>

        <div style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.footerLink}>
            Sign In
          </Link>
        </div>

      </div>

    </div>
  </div>
  
);
}

export default Register;
