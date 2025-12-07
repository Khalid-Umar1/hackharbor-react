import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function CreatePost({ theme }) {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    tags: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const isDark = theme === 'dark';

  // Redirect if not logged in
  if (! isAuthenticated) {
    navigate('/login');
    return null;
  }

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors. title = 'Title is required';
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

  const handleImageChange = (e) => {
    const file = e.target. files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (! allowedTypes.includes(file.type)) {
        setMessage('Error: Only JPEG, PNG, GIF, and WebP images are allowed');
        return;
      }
      // Validate file size (5MB max)
      if (file. size > 5 * 1024 * 1024) {
        setMessage('Error: Image size must be less than 5MB');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setMessage('');
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Use FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend. append('title', formData.title. trim());
      formDataToSend. append('body', formData.body.trim());
      
      // Convert tags string to array and append
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag. length > 0);
      tagsArray.forEach(tag => formDataToSend.append('tags', tag));
      
      // Append image if exists
      if (image) {
        formDataToSend. append('image', image);
      }

      const response = await api.post('/posts', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        setMessage('Post created successfully!  Redirecting...');
        setFormData({ title: '', body: '', tags: '' });
        setImage(null);
        setImagePreview(null);
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setMessage('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <main className={`min-h-screen py-16 ${
      isDark ? 'bg-gradient-to-br from-bg-dark via-card to-bg-dark' : 'bg-gradient-to-br from-blue-50 via-gray-100 to-blue-50'
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
                ✍️ Create New Post
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
                  isDark ? 'text-text' : 'text-text-light'
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
                {errors. title && (
                  <p className="text-error text-sm">⚠️ {errors.title}</p>
                )}
              </div>

              {/* Image Upload Field */}
              <div className="flex flex-col gap-2">
                <label className={`font-medium text-sm uppercase tracking-wider ${
                  isDark ? 'text-text' : 'text-text-light'
                }`}>
                  Featured Image <span className={`text-xs ${isDark ? 'text-muted' : 'text-muted-light'}`}>(optional)</span>
                </label>
                
                {imagePreview ?  (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border-2 border-brand"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-error text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-error/80 transition-all"
                    >
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <label className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                    isDark
                      ? 'border-brand hover:border-accent bg-bg-dark'
                      : 'border-brand-light hover:border-accent-light bg-gray-50'
                  }`}>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="text-4xl mb-2">📷</div>
                    <p className={isDark ? 'text-muted' : 'text-muted-light'}>
                      Click to upload an image
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-muted' : 'text-muted-light'}`}>
                      JPEG, PNG, GIF, WebP (Max 5MB)
                    </p>
                  </label>
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
                  value={formData.body}
                  onChange={(e) => handleInputChange('body', e.target.value)}
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
                  } focus:outline-none focus:ring-4 ${isDark ? 'focus:ring-accent/10' : 'focus:ring-accent-light/10'}`}
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
                        #{tag.trim()}
                      </span>
                    )
                  ))}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-4 text-lg font-bold rounded-lg transition-all mt-4 ${
                  isDark
                    ?  'bg-accent text-bg-dark hover:bg-primary hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30'
                    : 'bg-accent-light text-white hover:bg-primary-light hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-light/30'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? '🔄 Publishing...' : '🚀 Publish Post'}
              </button>

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