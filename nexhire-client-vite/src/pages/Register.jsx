// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const Register = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const registrationData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };

      await api.post('/api/auth/register', registrationData);

      toast.success('Registration successful! Please login to continue.');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);

      let errorMessage = 'An error occurred during registration. Please try again.';

      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Invalid registration data. Please check your input.';
        } else if (error.response.status === 409) {
          errorMessage = 'An account with this email already exists. Please login instead.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to the server. Please check your network connection.';
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#1a3c5e] to-[#2a5f8a] p-5 font-sans">
      <div className="bg-white rounded-2xl px-10 py-12 w-full max-w-[440px] shadow-2xl transition-transform duration-200 hover:scale-[1.01]">
        <div className="text-center mb-9">
          <h1 className="text-4xl font-bold text-[#1a3c5e] mb-2 tracking-tight">
            Nexhire
          </h1>
          <p className="text-base text-[#6b7a8f] leading-relaxed">
            Create your account to get started
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="fullName" className="text-sm font-semibold text-[#1a3c5e] tracking-wide">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className={`px-4 py-3 border-2 rounded-lg text-[15px] transition-all duration-300 bg-[#f8fafc] text-[#1a3c5e] outline-none focus:border-[#1a3c5e] focus:bg-white focus:ring-4 focus:ring-[#1a3c5e]/10 ${
                errors.fullName ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/10' : 'border-[#e1e8ee]'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.fullName && (
              <span className="text-sm text-red-500 mt-1 font-medium">{errors.fullName}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-[#1a3c5e] tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`px-4 py-3 border-2 rounded-lg text-[15px] transition-all duration-300 bg-[#f8fafc] text-[#1a3c5e] outline-none focus:border-[#1a3c5e] focus:bg-white focus:ring-4 focus:ring-[#1a3c5e]/10 ${
                errors.email ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/10' : 'border-[#e1e8ee]'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.email && (
              <span className="text-sm text-red-500 mt-1 font-medium">{errors.email}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-[#1a3c5e] tracking-wide">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`px-4 py-3 border-2 rounded-lg text-[15px] transition-all duration-300 bg-[#f8fafc] text-[#1a3c5e] outline-none focus:border-[#1a3c5e] focus:bg-white focus:ring-4 focus:ring-[#1a3c5e]/10 ${
                errors.password ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/10' : 'border-[#e1e8ee]'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              placeholder="Enter your password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.password && (
              <span className="text-sm text-red-500 mt-1 font-medium">{errors.password}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-semibold text-[#1a3c5e] tracking-wide">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`px-4 py-3 border-2 rounded-lg text-[15px] transition-all duration-300 bg-[#f8fafc] text-[#1a3c5e] outline-none focus:border-[#1a3c5e] focus:bg-white focus:ring-4 focus:ring-[#1a3c5e]/10 ${
                errors.confirmPassword ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/10' : 'border-[#e1e8ee]'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <span className="text-sm text-red-500 mt-1 font-medium">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="role" className="text-sm font-semibold text-[#1a3c5e] tracking-wide">
              Role
            </label>
            <select
              id="role"
              name="role"
              className={`px-4 py-3 border-2 rounded-lg text-[15px] transition-all duration-300 bg-[#f8fafc] text-[#1a3c5e] outline-none focus:border-[#1a3c5e] focus:bg-white focus:ring-4 focus:ring-[#1a3c5e]/10 ${
                errors.role ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/10' : 'border-[#e1e8ee]'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              value={formData.role}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
            <p className="text-xs text-[#6b7a8f] mt-1">
              Hiring Manager and Admin roles are assigned by administrators only.
            </p>
            {errors.role && (
              <span className="text-sm text-red-500 mt-1 font-medium">{errors.role}</span>
            )}
          </div>

          <button
            type="submit"
            className={`mt-2 py-3.5 px-6 bg-[#1a3c5e] text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 flex justify-center items-center gap-2.5 h-13 ${
              !isLoading 
                ? 'hover:bg-[#2a5f8a] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(26,60,94,0.3)] active:translate-y-0' 
                : 'opacity-70 cursor-not-allowed'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="inline-block w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-7 text-center border-t border-[#e8edf2] pt-6">
          <p className="text-[15px] text-[#6b7a8f]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1a3c5e] font-semibold no-underline transition-colors duration-200 hover:text-[#2a5f8a] hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Make sure we export default
export default Register;