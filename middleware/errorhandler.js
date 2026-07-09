class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // Operational errors are predictable errors (e.g., user input errors, 404s)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// ==========================================
// 4.2 asyncHandler Wrapper Middleware
// ==========================================
// Eliminates the need for try-catch blocks in async route controllers
const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// ==========================================
// 4.3 Central Error Handler Middleware
// ==========================================
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Send structured JSON error responses instead of HTML crashing templates
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { AppError, asyncHandler, globalErrorHandler };