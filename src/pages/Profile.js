import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function Profile({ theme }) {
  const { user, token, isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile form
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Stats
  const [stats, setStats] = useState(null);

  const isDark = theme === 'dark';

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load user data
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      if (! token) return;
      try {
        const response = await api. get('/auth/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response. data. stats);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, [token]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const response = await api.patch('/auth/update-profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local user data
      login(token, response.data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?. message || 'Failed to update profile'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData. confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData. newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?. data?.message || 'Failed to change password'
      });
    } finally {
      setLoading(false);
    }
  };

  if (! isAuthenticated) {
    return null;
  }

  return (
    <main className={`min-h-screen py-16 ${
      isDark ? 'bg-gradient-to-br from-bg-dark via-card to-bg-dark' : 'bg-gradient-to-br from-blue-50 via-gray-100 to-blue-50'
    }`}>
      <div className="container mx-auto px-5">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className={`rounded-2xl p-8 mb-8 ${
            isDark ? 'bg-card border border-brand' : 'bg-white border border-brand-light shadow-lg'
          }`}>
            <div className="flex items-center gap-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl ${
                isDark ?  'bg-accent/20 text-accent' : 'bg-accent-light/20 text-accent-light'
              }`}>
                👤
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-primary' : 'text-primary-light'}`}>
                  {user?. name}
                </h1>
                <p className={`${isDark ? 'text-muted' : 'text-muted-light'}`}>
                  {user?.email}
                </p>
                <p className={`text-sm mt-1 ${isDark ? 'text-muted' : 'text-muted-light'}`}>
                  Member since {user?.createdAt ?  new Date(user. createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`rounded-xl p-6 text-center ${
                isDark ? 'bg-card border border-brand' : 'bg-white border border-brand-light shadow'
              }`}>
                <p className={`text-4xl font-bold ${isDark ? 'text-accent' : 'text-accent-light'}`}>
                  {stats.totalPosts}
                </p>
                <p className={`mt-2 ${isDark ? 'text-muted' : 'text-muted-light'}`}>Total Posts</p>
              </div>
              <div className={`rounded-xl p-6 text-center ${
                isDark ? 'bg-card border border-brand' : 'bg-white border border-brand-light shadow'
              }`}>
                <p className={`text-4xl font-bold ${isDark ? 'text-primary' : 'text-primary-light'}`}>
                  {stats.topTags?. length || 0}
                </p>
                <p className={`mt-2 ${isDark ?  'text-muted' : 'text-muted-light'}`}>Topics</p>
              </div>
              <div className={`rounded-xl p-6 text-center ${
                isDark ? 'bg-card border border-brand' : 'bg-white border border-brand-light shadow'
              }`}>
                <p className={`text-4xl font-bold text-green-500`}>
                  {user?.role === 'admin' ? '👑 Admin' : '✅ Active'}
                </p>
                <p className={`mt-2 ${isDark ? 'text-muted' : 'text-muted-light'}`}>Status</p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className={`rounded-2xl overflow-hidden ${
            isDark ? 'bg-card border border-brand' : 'bg-white border border-brand-light shadow-lg'
          }`}>
            <div className="flex border-b ${isDark ? 'border-brand' : 'border-brand-light'}">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 px-6 py-4 font-medium transition-all ${
                  activeTab === 'profile'
                    ? isDark
                      ? 'bg-accent/20 text-accent border-b-2 border-accent'
                      : 'bg-accent-light/20 text-accent-light border-b-2 border-accent-light'
                    : isDark
                      ?  'text-muted hover:text-text'
                      : 'text-muted-light hover:text-text-light'
                }`}
              >
                ✏️ Edit Profile
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 px-6 py-4 font-medium transition-all ${
                  activeTab === 'password'
                    ?  isDark
                      ? 'bg-accent/20 text-accent border-b-2 border-accent'
                      : 'bg-accent-light/20 text-accent-light border-b-2 border-accent-light'
                    : isDark
                      ? 'text-muted hover:text-text'
                      : 'text-muted-light hover:text-text-light'
                }`}
              >
                🔒 Change Password
              </button>
            </div>

            <div className="p-8">
              {/* Message */}
              {message.text && (
                <div className={`mb-6 p-4 rounded-lg ${
                  message.type === 'error'
                    ? 'bg-error/20 text-error border border-error'
                    : isDark
                      ?  'bg-accent/20 text-accent border border-accent'
                      : 'bg-accent-light/20 text-accent-light border border-accent-light'
                }`}>
                  {message.type === 'success' ? '✅ ' : '❌ '}
                  {message.text}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileUpdate} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className={`font-medium text-sm uppercase tracking-wider ${
                      isDark ? 'text-text' : 'text-text-light'
                    }`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target. value })}
                      className={`border-2 rounded-lg px-4 py-3 transition-all ${
                        isDark
                          ? 'bg-bg-dark border-brand text-text focus:border-accent'
                          : 'bg-white border-brand-light text-text-light focus:border-accent-light'
                      } focus:outline-none`}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={`font-medium text-sm uppercase tracking-wider ${
                      isDark ? 'text-text' : 'text-text-light'
                    }`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target. value })}
                      className={`border-2 rounded-lg px-4 py-3 transition-all ${
                        isDark
                          ? 'bg-bg-dark border-brand text-text focus:border-accent'
                          : 'bg-white border-brand-light text-text-light focus:border-accent-light'
                      } focus:outline-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-3 text-lg font-bold rounded-lg transition-all ${
                      isDark
                        ?  'bg-accent text-bg-dark hover:bg-primary'
                        : 'bg-accent-light text-white hover:bg-primary-light'
                    } disabled:opacity-50`}
                  >
                    {loading ? '🔄 Saving...' : '💾 Save Changes'}
                  </button>
                </form>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <form onSubmit={handlePasswordChange} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className={`font-medium text-sm uppercase tracking-wider ${
                      isDark ? 'text-text' : 'text-text-light'
                    }`}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className={`border-2 rounded-lg px-4 py-3 transition-all ${
                        isDark
                          ? 'bg-bg-dark border-brand text-text focus:border-accent'
                          : 'bg-white border-brand-light text-text-light focus:border-accent-light'
                      } focus:outline-none`}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={`font-medium text-sm uppercase tracking-wider ${
                      isDark ? 'text-text' : 'text-text-light'
                    }`}>
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData. newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Minimum 6 characters"
                      className={`border-2 rounded-lg px-4 py-3 transition-all ${
                        isDark
                          ? 'bg-bg-dark border-brand text-text focus:border-accent'
                          : 'bg-white border-brand-light text-text-light focus:border-accent-light'
                      } focus:outline-none`}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={`font-medium text-sm uppercase tracking-wider ${
                      isDark ? 'text-text' : 'text-text-light'
                    }`}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className={`border-2 rounded-lg px-4 py-3 transition-all ${
                        isDark
                          ?  'bg-bg-dark border-brand text-text focus:border-accent'
                          : 'bg-white border-brand-light text-text-light focus:border-accent-light'
                      } focus:outline-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-3 text-lg font-bold rounded-lg transition-all ${
                      isDark
                        ? 'bg-accent text-bg-dark hover:bg-primary'
                        : 'bg-accent-light text-white hover:bg-primary-light'
                    } disabled:opacity-50`}
                  >
                    {loading ? '🔄 Changing.. .' : '🔒 Change Password'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className={`rounded-2xl p-8 mt-8 border-2 border-error/50 ${
            isDark ? 'bg-card' : 'bg-white'
          }`}>
            <h3 className="text-xl font-bold text-error mb-4">⚠️ Danger Zone</h3>
            <p className={`mb-4 ${isDark ? 'text-muted' : 'text-muted-light'}`}>
              Once you logout, you'll need to login again to access your account.
            </p>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="px-6 py-2 bg-error text-white font-medium rounded-lg hover:bg-error/80 transition-all"
            >
              🚪 Logout from All Devices
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}