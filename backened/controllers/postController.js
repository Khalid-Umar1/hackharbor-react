const Post = require('../models/Post');
const catchAsync = require('../utils/catchAsync');

// @desc    Get all posts with search, filter, sort, pagination
// @route   GET /api/posts
// @access  Public
exports. getPosts = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    sort = '-createdAt',
    tags,
    author
  } = req.query;

  // Build query
  const query = {};

  // Search in title and body
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { body: { $regex: search, $options: 'i' } }
    ];
  }

  // Filter by tags
  if (tags) {
    const tagsArray = tags.split(',').map(tag => tag. trim());
    query. tags = { $in: tagsArray };
  }

  // Filter by author
  if (author) {
    query.author = author;
  }

  // Calculate pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  // Get total count for pagination info
  const total = await Post.countDocuments(query);

  // Execute query with sorting and pagination
  const posts = await Post.find(query)
    .populate('author', 'name email')
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  res.status(200). json({
    success: true,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
    hasNextPage: pageNum < Math.ceil(total / limitNum),
    hasPrevPage: pageNum > 1,
    data: posts
  });
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports. getPost = catchAsync(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'name email');

  if (!post) {
    return res.status(404). json({
      success: false,
      message: 'Post not found'
    });
  }

  res.status(200).json(post);
});

// @desc    Get current user's posts
// @route   GET /api/posts/my-posts
// @access  Private
exports.getMyPosts = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    sort = '-createdAt'
  } = req.query;

  const query = { author: req.user._id };

  // Search in title and body
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { body: { $regex: search, $options: 'i' } }
    ];
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const total = await Post.countDocuments(query);

  const posts = await Post.find(query)
    .populate('author', 'name email')
    .sort(sort)
    .skip(skip)
    . limit(limitNum);

  res.status(200).json({
    success: true,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
    data: posts
  });
});

// @desc    Create post
// @route   POST /api/posts
// @access  Private
exports.createPost = catchAsync(async (req, res) => {
  const { title, body, tags } = req.body;

  // Handle image upload if present
  let image = null;
  if (req.file) {
    image = `/uploads/${req.file. filename}`;
  }

  const post = await Post.create({
    title,
    body,
    tags: tags || [],
    image,
    author: req.user._id
  });

  await post.populate('author', 'name email');

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: post
  });
});

// @desc    Update post
// @route   PATCH /api/posts/:id
// @access  Private (owner only)
exports.updatePost = catchAsync(async (req, res) => {
  let post = await Post. findById(req. params.id);

  if (!post) {
    return res.status(404). json({
      success: false,
      message: 'Post not found'
    });
  }

  // Check ownership
  if (post.author.toString() !== req.user._id.toString() && req.user. role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this post'
    });
  }

  const { title, body, tags } = req. body;
  const updateData = {};

  if (title) updateData.title = title;
  if (body) updateData. body = body;
  if (tags) updateData.tags = tags;

  // Handle image upload if present
  if (req.file) {
    updateData.image = `/uploads/${req.file.filename}`;
  }

  post = await Post.findByIdAndUpdate(
    req.params. id,
    updateData,
    { new: true, runValidators: true }
  ). populate('author', 'name email');

  res.status(200).json({
    success: true,
    message: 'Post updated successfully',
    data: post
  });
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (owner or admin)
exports. deletePost = catchAsync(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (! post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  // Check ownership or admin
  if (post. author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res. status(403).json({
      success: false,
      message: 'Not authorized to delete this post'
    });
  }

  await post.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Post deleted successfully'
  });
});