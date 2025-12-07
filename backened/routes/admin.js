const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const catchAsync = require('../utils/catchAsync');

// All routes require auth + admin
router.use(auth, admin);

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
router.get('/users', catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    . select('-password')
    .sort('-createdAt')
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({
    success: true,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    data: users
  });
}));

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Admin
router.get('/users/:id', catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    return res.status(404). json({
      success: false,
      message: 'User not found'
    });
  }

  const postCount = await Post. countDocuments({ author: user._id });

  res.status(200).json({
    success: true,
    user,
    postCount
  });
}));

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Admin
router. patch('/users/:id/role', catchAsync(async (req, res) => {
  const { role } = req. body;

  if (!['user', 'admin']. includes(role)) {
    return res. status(400).json({
      success: false,
      message: 'Invalid role.  Must be "user" or "admin"'
    });
  }

  const user = await User.findByIdAndUpdate(
    req.params. id,
    { role },
    { new: true }
  ).select('-password');

  if (!user) {
    return res. status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    user
  });
}));

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
router.delete('/users/:id', catchAsync(async (req, res) => {
  const user = await User.findById(req.params. id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Delete user's posts
  await Post.deleteMany({ author: user._id });
  
  // Delete user
  await user.deleteOne();

  res.status(200). json({
    success: true,
    message: 'User and their posts deleted successfully'
  });
}));

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
router.get('/stats', catchAsync(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalPosts = await Post.countDocuments();
  const totalAdmins = await User.countDocuments({ role: 'admin' });

  // Users registered in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newUsers = await User. countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

  // Posts created in last 30 days
  const newPosts = await Post.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

  // Recent users
  const recentUsers = await User.find()
    .select('-password')
    .sort('-createdAt')
    .limit(5);

  // Recent posts
  const recentPosts = await Post.find()
    .populate('author', 'name email')
    .sort('-createdAt')
    .limit(5);

  res. status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalPosts,
      totalAdmins,
      newUsers,
      newPosts,
      recentUsers,
      recentPosts
    }
  });
}));

module. exports = router;