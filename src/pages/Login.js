import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login({ theme }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (! formData.email. trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors. email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.password) {
      newErrors. password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e. preventDefault();
    setMessage('');

    if (!validateForm()) {
      setMessage('Please fix the errors below');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData. email. trim(),
          password: formData.password
        }),
      });

      const data = await response.json();

      if (! response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and user data
      login(data.token, data.user);
      
      setMessage('Login successful! Redirecting...');
      setFormData({ email: '', password: '' });
      
      // Redirect to dashboard after 1. 5 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Login Error:', error);
      setMessage('Error: ' + error. message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ... errors, [field]: '' });
    }
  };

  return (
    <main className={`min-h-screen flex items-center justify-center py-16 ${
      isDark ? 'bg-gradient-to-br from-bg-dark via-card to-bg-dark' : 'bg-gradient-to-br from-blue-50 via-gray-100 to-blue-50'
    }`}>
      <div className="container mx-auto px-5">
        <div className="max-w-md mx-auto">
          <div className={`rounded-2xl p-12 hover:-translate-y-0.5 transition-all shadow-lg ${
            isDark
              ?  'bg-card border border-brand hover:border-accent hover:shadow-accent/10'
              : 'bg-white border border-brand-light hover:border-accent-light hover:shadow-accent-light/20'
          }`}>
            <h2 className={`text-3xl font-bold text-center mb-8 ${isDark ? 'text-primary' : 'text-primary-light'}`}>
              Login to HackHarbor
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className={`font-medium text-sm uppercase tracking-wider ${
                  isDark ?  'text-text' : 'text-text-light'
                }`}>
                  Email Address <span className="text-error">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className={`border-2 rounded-lg px-4 py-3 transition-all ${
                    errors.email
                      ? 'border-error'
                      : isDark
                        ?  'bg-bg-dark border-brand text-text placeholder-muted focus:border-accent'
                        : 'bg-white border-brand-light text-text-light placeholder-muted-light focus:border-accent-light'
                  } focus:outline-none focus:ring-4 ${isDark ?  'focus:ring-accent/10' : 'focus:ring-accent-light/10'}`}
                />
                {errors.email && (
                  <p className="text-error text-sm mt-1">⚠️ {errors.email}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className={`font-medium text-sm uppercase tracking-wider ${
                  isDark ? 'text-text' : 'text-text-light'
                }`}>
                  Password <span className="text-error">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className={`border-2 rounded-lg px-4 py-3 transition-all ${
                    errors.password
                      ? 'border-error'
                      : isDark
                        ? 'bg-bg-dark border-brand text-text placeholder-muted focus:border-accent'
                        : 'bg-white border-brand-light text-text-light placeholder-muted-light focus:border-accent-light'
                  } focus:outline-none focus:ring-4 ${isDark ? 'focus:ring-accent/10' : 'focus:ring-accent-light/10'}`}
                />
                {errors.password && (
                  <p className="text-error text-sm mt-1">⚠️ {errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 text-lg font-bold rounded-lg transition-all mt-4 ${
                  isDark
                    ? 'bg-accent text-bg-dark hover:bg-primary hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30'
                    : 'bg-accent-light text-white hover:bg-primary-light hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-light/30'
                } disabled:opacity-50`}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              {message && (
                <div className={`text-center p-3 rounded-lg font-medium ${
                  message.includes('Error') || message.includes('fix')
                    ? 'bg-error/20 text-error border border-error'
                    : isDark
                      ?  'bg-accent/20 text-accent border border-accent'
                      : 'bg-accent-light/20 text-accent-light border border-accent-light'
                }`}>
                  {message.includes('successful') ? '✅ ' : '❌ '}
                  {message}
                </div>
              )}

              <div className="text-center mt-6">
                <p className={`text-sm ${isDark ?  'text-muted' : 'text-muted-light'}`}>
                  Don't have an account? {' '}
                  <Link to="/signup" className={`font-medium transition-colors ${
                    isDark ? 'text-accent hover:text-primary' : 'text-accent-light hover:text-primary-light'
                  } hover:underline`}>
                    Sign up here
                  </Link>
                </p>
              </div>
            </form>

            <p className={`text-xs text-center mt-6 ${isDark ? 'text-muted' : 'text-muted-light'}`}>
              <span className="text-error">*</span> Required fields
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}