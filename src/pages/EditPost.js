import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function EditPost({ theme }) {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // Get post ID from URL
  
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    tags: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const isDark = theme === 'dark';

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch existing post data
  useEffect(() => {
    const fetchPost = async () => {
      if (! token || !id) return;

      try {
        setLoading(true);
        const response = await api.get(`/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const post = response.data;
        setFormData({
          title: post.title || '',
          body: post.body || '',
          tags: post. tags ?  post.tags.join(', ') : ''
        });
      } catch (err) {
        console.error('Error fetching post:', err);
        setMessage('Error: Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [token, id]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.title. trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
      isValid = false;
    }

    if (! formData.body. trim()) {
      newErrors.body = 'Content is required';
      isValid = false;
    } else if (formData.body.trim().length < 10) {
      newErrors.body = 'Content must be at least 10 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // Convert tags string to array
      const tagsArray = formData.tags
        . split(',')
        . map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await api.patch(`/posts/${id}`, {
        title: formData. title. trim(),
        body: formData.body.trim(),
        tags: tagsArray
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage('Post updated successfully!  Redirecting...');
      
      // Redirect to dashboard after 1. 5 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Error updating post:', error);
      setMessage('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ... errors, [field]: '' });
    }
  };

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <main className={`min-h-screen py-16 flex items-center justify-center ${
        isDark ? 'bg-gradient-to-br from-bg-dark via-card to-bg-dark' : 'bg-gradient-to-br from-blue-50 via-gray-100 to-blue-50'
      }`}>
        <div className={`text-center ${isDark ? 'text-muted' : 'text-muted-light'}`}>
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl">Loading post...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen py-16 ${
      isDark ?  'bg-gradient-to-br from-bg-dark via-card to-bg-dark' : 'bg-gradient-to-br from-blue-50 via-gray-100 to-blue-50'
    }`}>
      <div className="container mx-auto px-5">
        <div className="max-w-2xl mx-auto">
          <div className={`rounded-2xl p-8 md:p-12 ${
            isDark
              ? 'bg-card border border-brand'
              : 'bg-white border border-brand-light shadow-lg'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className={`text-3xl font-bold ${isDark ? 'text-primary' : 'text-primary-light'}`}>
                ✏️ Edit Post
              </h1>
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  isDark
                    ?  'bg-brand text-text hover:bg-accent hover:text-bg-dark'
                    : 'bg-brand-light text-text-light hover:bg-accent-light hover:text-white'
                }`}
              >
                ← Back
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Title Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="title" className={`font-medium text-sm uppercase tracking-wider ${
                  isDark ?  'text-text' : 'text-text-light'
                }`}>
                  Post Title <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter a catchy title..."
                  className={`border-2 rounded-lg px-4 py-3 transition-all ${
                    errors.title
                      ? 'border-error'
                      : isDark
                        ? 'bg-bg-dark border-brand text-text placeholder-muted focus:border-accent'
                        : 'bg-white border-brand-light text-text-light placeholder-muted-light focus:border-accent-light'
                  } focus:outline-none focus:ring-4 ${isDark ? 'focus:ring-accent/10' : 'focus:ring-accent-light/10'}`}
                />
                {errors.title && (
                  <p className="text-error text-sm">⚠️ {errors.title}</p>
                )}
              </div>

              {/* Body/Content Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="body" className={`font-medium text-sm uppercase tracking-wider ${
                  isDark ? 'text-text' : 'text-text-light'
                }`}>
                  Content <span className="text-error">*</span>
                </label>
                <textarea
                  id="body"
                  value={formData. body}
                  onChange={(e) => handleInputChange('body', e.target. value)}
                  placeholder="Write your post content here..."
                  rows={8}
                  className={`border-2 rounded-lg px-4 py-3 transition-all resize-none ${
                    errors.body
                      ? 'border-error'
                      : isDark
                        ? 'bg-bg-dark border-brand text-text placeholder-muted focus:border-accent'
                        : 'bg-white border-brand-light text-text-light placeholder-muted-light focus:border-accent-light'
                  } focus:outline-none focus:ring-4 ${isDark ? 'focus:ring-accent/10' : 'focus:ring-accent-light/10'}`}
                />
                {errors.body && (
                  <p className="text-error text-sm">⚠️ {errors.body}</p>
                )}
                <p className={`text-xs ${isDark ? 'text-muted' : 'text-muted-light'}`}>
                  {formData.body. length} characters
                </p>
              </div>

              {/* Tags Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="tags" className={`font-medium text-sm uppercase tracking-wider ${
                  isDark ? 'text-text' : 'text-text-light'
                }`}>
                  Tags <span className={`text-xs ${isDark ? 'text-muted' : 'text-muted-light'}`}>(optional)</span>
                </label>
                <input
                  type="text"
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="cybersecurity, hacking, tutorial (comma separated)"
                  className={`border-2 rounded-lg px-4 py-3 transition-all ${
                    isDark
                      ?  'bg-bg-dark border-brand text-text placeholder-muted focus:border-accent'
                      : 'bg-white border-brand-light text-text-light placeholder-muted-light focus:border-accent-light'
                  } focus:outline-none focus:ring-4 ${isDark ?  'focus:ring-accent/10' : 'focus:ring-accent-light/10'}`}
                />
                <p className={`text-xs ${isDark ? 'text-muted' : 'text-muted-light'}`}>
                  Separate multiple tags with commas
                </p>
              </div>

              {/* Preview Tags */}
              {formData.tags && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.split(',').map((tag, index) => (
                    tag.trim() && (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          isDark
                            ? 'bg-accent/20 text-accent'
                            : 'bg-accent-light/20 text-accent-light'
                        }`}
                      >
                        #{tag. trim()}
                      </span>
                    )
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className={`flex-1 px-8 py-4 text-lg font-bold rounded-lg transition-all ${
                    isDark
                      ?  'bg-accent text-bg-dark hover:bg-primary hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30'
                      : 'bg-accent-light text-white hover:bg-primary-light hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-light/30'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {saving ?  '🔄 Saving.. .' : '💾 Save Changes'}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className={`px-8 py-4 text-lg font-bold rounded-lg transition-all ${
                    isDark
                      ? 'bg-brand text-text hover:bg-error/20 hover:text-error'
                      : 'bg-brand-light text-text-light hover:bg-error/10 hover:text-error'
                  }`}
                >
                  ❌ Cancel
                </button>
              </div>

              {/* Message */}
              {message && (
                <div className={`text-center p-4 rounded-lg font-medium ${
                  message.includes('Error')
                    ? 'bg-error/20 text-error border border-error'
                    : isDark
                      ?  'bg-accent/20 text-accent border border-accent'
                      : 'bg-accent-light/20 text-accent-light border border-accent-light'
                }`}>
                  {message. includes('successfully') ? '✅ ' : '❌ '}
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}