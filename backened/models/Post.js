const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  body: {
    type: String,
    required: [true, 'Body is required'],
    minlength: [10, 'Body must be at least 10 characters']
  },
  tags: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    default: null
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for search
postSchema.index({ title: 'text', body: 'text' });

module.exports = mongoose.model('Post', postSchema);