const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  getMyPosts,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getPosts);
router.get('/:id', getPost);

// Protected routes
router.get('/user/my-posts', auth, getMyPosts);
router.post('/', auth, upload.single('image'), createPost);
router.patch('/:id', auth, upload. single('image'), updatePost);
router. delete('/:id', auth, deletePost);

module.exports = router;