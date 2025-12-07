exports.errorHandler = (err, req, res, next) => {
  // Only log in non-test environment
  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  let status = err.statusCode || 500;
  let message = err.message || 'Server Error';

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    status = 400;
    const messages = Object.values(err.errors). map(e => e.message);
    message = messages.join(', ');
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    status = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // Handle Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format';
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expired';
  }

  const response = {
    success: false,
    message
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response. stack = err.stack;
  }

  res.status(status).json(response);
};