import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/api/auth/login', formData);
      console.log('Login response:', res.data);
      const token = res.data.token;
      const email = res.data.email;
      const fullName = res.data.fullName;
      const role = res.data.role;
      const expiresAt = res.data.expiresAt;
      login(token, { email, fullName, role, expiresAt });
      toast.success('Login successful!');

      // Redirect based on role
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Logo / Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Nexhire</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                         text-sm focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                         text-sm focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold
                       py-2.5 rounded-lg transition duration-200 text-sm
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-700 font-medium hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;