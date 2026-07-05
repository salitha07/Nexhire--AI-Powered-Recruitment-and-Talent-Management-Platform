import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext'; 

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();  // ← This should work now
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      const response = await api.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;
      login(token, user);

      toast.success('Login successful! Welcome back.');

      const roleRedirects = {
        candidate: '/candidate/dashboard',
        recruiter: '/recruiter/dashboard',
        hiring_manager: '/hiring/dashboard',
        admin: '/admin/dashboard',
      };

      const redirectPath = roleRedirects[user.role] || '/dashboard';
      navigate(redirectPath);
    } catch (error) {
      console.error('Login error:', error);

      let errorMessage = 'An error occurred during login. Please try again.';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Invalid request. Please check your input.';
        } else if (error.response.status === 404) {
          errorMessage = 'Account not found. Please check your email or register.';
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
      <div className="bg-white rounded-2xl px-10 py-12 w-full max-w-[420px] shadow-2xl transition-transform duration-200 hover:scale-[1.01]">
        <div className="text-center mb-9">
          <h1 className="text-4xl font-bold text-[#1a3c5e] mb-2 tracking-tight">
            Nexhire
          </h1>
          <p className="text-base text-[#6b7a8f] leading-relaxed">
            Welcome back! Please login to your account.
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.password && (
              <span className="text-sm text-red-500 mt-1 font-medium">{errors.password}</span>
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
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-7 text-center border-t border-[#e8edf2] pt-6">
          <p className="text-[15px] text-[#6b7a8f]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#1a3c5e] font-semibold no-underline transition-colors duration-200 hover:text-[#2a5f8a] hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;