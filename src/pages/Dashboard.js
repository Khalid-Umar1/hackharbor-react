import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({ theme }) {
  const { user, token, isAuthenticated, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const navigate = useNavigate();

  const isDark = theme === 'dark';

  useEffect(() => {
    if (! isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const fetchPosts = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await api.get('/posts', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search,
          sort: sortBy
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setPosts(response.data.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        totalPages: response.data.totalPages
      }));
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [token, pagination. page, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchPosts();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeletePost = async (postId) => {
    if (! window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await api.delete(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(posts.filter(post => post._id !== postId));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
    } catch (err) {
      console. error('Error deleting post:', err);
      alert('Failed to delete post: ' + (err.response?.data?.message || err.message));
    }
  };

  if (! isAuthenticated) {
    return null;
  }

  return (
    <main className={`min-h-screen py-16 ${isDark ?  'bg-gradient-to-br from-bg-dark via-card to-bg-dark' : 'bg-gradient-to-br from-blue-50 via-gray-100 to-blue-50'}`}>
      <div className="container mx-auto px-5">
        {/* Welcome Section */}
        <div className={`rounded-2xl p-8 mb-8 ${isDark ? 'bg-card border border-brand' : 'bg-white border border-brand-light shadow-lg'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-primary' : 'text-primary-light'}`}>
                Welcome back, {user?.name || 'User'}!  👋
              </h1>
              <p className={isDark ? 'text-muted' : 'text-muted-light'}>
                {user?.email}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/profile')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${isDark ? 'bg-brand text-text hover:bg-accent hover:text-bg-dark' : 'bg-brand-light text-text-light hover:bg-accent-light hover:text-white'}`}
              >
                ⚙️ Settings
              </button>
              <button
                onClick={handleLogout}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${isDark ? 'bg-error/20 text-error border border-error hover:bg-error hover:text-white' : 'bg-error/10 text-error border border-error hover:bg-error hover:text-white'}`}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`rounded-xl p-6 ${isDark ? 'bg-card border border-brand' : 'bg-white border border-brand-light shadow'}`}>
            <h3 className={`text-lg font-medium mb-2 ${isDark ?  'text-muted' : 'text-muted-light'}`}>
              Total Posts
            </h3>
            <p className={`text-4xl font-bold ${isDark ? 'text-accent' : 'text-accent-light'}`}>
              {pagination.total}
            </p>
          </div>
          
          <div className={`rounded-xl p-6 ${isDark ? 'bg-card border border-brand' : 'bg-white border border-brand-light shadow'}`}>
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-muted' : 'text-muted-light'}`}>
              Member Since
            </h3>
            <p className={`text-2xl font-bold ${isDark ? 'text-primary' : 'text-primary-light'}`}>
              {user?.createdAt ?  new Date(user. createdAt).toLocaleDateString() : 'Today'}
            </p>
          </div>
          
          <div className={`rounded-xl p-6 ${isDark ? 'bg-card border border-brand' : 'bg-white border border-brand-light shadow'}`}>
            <h3 className={`text-lg font-medium mb-2 ${isDark ?  'text-muted' : 'text-muted-light'}`}>
              Account Status
            </h3>
            <p className="text-2xl font-bold text-green-500">
              ✅ Active
            </p>
          </div>
        </div>

        {/* Posts Section */}
        <div className={`rounded-2xl p-8 ${isDark ? 'bg-card border border-brand' : 'bg-white border border-brand-light shadow-lg'}`}>
          {/* Header with Search & Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-text' : 'text-text-light'}`}>
              📝 Your Posts
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={search}
                  onChange={(e) => setSearch(e. target.value)}
                  className={`pl-10 pr-4 py-2 rounded-lg border-2 transition-all w-full sm:w-64 ${isDark ?  'bg-bg-dark border-brand text-text placeholder-muted focus:border-accent' : 'bg-white border-brand-light text-text-light placeholder-muted-light focus:border-accent-light'} focus:outline-none`}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
              </div>
              
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${isDark ? 'bg-bg-dark border-brand text-text focus:border-accent' : 'bg-white border-brand-light text-text-light focus:border-accent-light'} focus:outline-none`}
              >
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="title">Title A-Z</option>
                <option value="-title">Title Z-A</option>
              </select>
              
              {/* Create Post Button */}
              <button
                onClick={() => navigate('/create-post')}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${isDark ? 'bg-accent text-bg-dark hover:bg-primary' : 'bg-accent-light text-white hover:bg-primary-light'}`}
              >
                ➕ Create Post
              </button>
            </div>
          </div>

          {/* Posts Content */}
          {loading ? (
            <div className={`text-center py-12 ${isDark ?  'text-muted' : 'text-muted-light'}`}>
              <div className="text-4xl mb-4">⏳</div>
              <p>Loading posts...</p>
            </div>
          ) : error ?  (
            <div className="text-center py-12 text-error">
              <div className="text-4xl mb-4">❌</div>
              <p>{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className={`text-center py-16 ${isDark ?  'text-muted' : 'text-muted-light'}`}>
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl mb-2">
                {search ? 'No posts match your search' : 'No posts yet'}
              </p>
              <p className="mb-6">
                {search ? 'Try different keywords' : 'Start sharing your thoughts!'}
              </p>
              {! search && (
                <button
                  onClick={() => navigate('/create-post')}
                  className={`px-8 py-3 rounded-lg font-bold transition-all ${isDark ? 'bg-accent text-bg-dark hover:bg-primary' : 'bg-accent-light text-white hover:bg-primary-light'}`}
                >
                  ✍️ Write Your First Post
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-6">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className={`p-6 rounded-xl transition-all hover:-translate-y-1 ${isDark ?  'bg-bg-dark border border-brand hover:border-accent hover:shadow-lg hover:shadow-accent/10' : 'bg-gray-50 border border-brand-light hover:border-accent-light hover:shadow-lg'}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <h3 className={`text-xl font-bold ${isDark ? 'text-primary' : 'text-primary-light'}`}>
                        {post.title}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/edit-post/${post._id}`)}
                          className={`px-4 py-1 rounded-lg text-sm font-medium transition-all ${isDark ? 'bg-brand text-text hover:bg-accent hover:text-bg-dark' : 'bg-brand-light text-text-light hover:bg-accent-light hover:text-white'}`}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className={`px-4 py-1 rounded-lg text-sm font-medium transition-all ${isDark ? 'bg-error/20 text-error hover:bg-error hover:text-white' : 'bg-error/10 text-error hover:bg-error hover:text-white'}`}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>

                    <p className={`mb-4 leading-relaxed ${isDark ? 'text-text' : 'text-text-light'}`}>
                      {post.body. length > 200 ? post.body.substring(0, 200) + '...' : post. body}
                    </p>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post. tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-accent/20 text-accent' : 'bg-accent-light/20 text-accent-light'}`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className={`flex items-center justify-between text-sm ${isDark ? 'text-muted' : 'text-muted-light'}`}>
                      <p>
                        📅 {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    onClick={() => setPagination(prev => ({ ... prev, page: prev.page - 1 }))}
                    disabled={pagination. page === 1}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${isDark ? 'bg-brand text-text hover:bg-accent hover:text-bg-dark disabled:opacity-50 disabled:cursor-not-allowed' : 'bg-brand-light text-text-light hover:bg-accent-light hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'}`}
                  >
                    ← Previous
                  </button>
                  
                  <span className={isDark ? 'text-text' : 'text-text-light'}>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => setPagination(prev => ({ ... prev, page: prev.page + 1 }))}
                    disabled={pagination. page === pagination.totalPages}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${isDark ? 'bg-brand text-text hover:bg-accent hover:text-bg-dark disabled:opacity-50 disabled:cursor-not-allowed' : 'bg-brand-light text-text-light hover:bg-accent-light hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'}`}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}