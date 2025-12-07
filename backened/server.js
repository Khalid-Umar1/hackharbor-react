const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimiter = require('./middleware/rateLimiter');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const adminRoutes = require('./routes/admin');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const connectDB = require('./config/db');

const app = express();
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(mongoSanitize());

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express. urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env. NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use(rateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// 404 handler
app.use((req, res) => {
  res. status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Only start server if this file is run directly (not imported by tests)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module. exports = app;