// Centralized Express error handler
module.exports = function errorHandler(err, _req, res, _next) {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  res.status(status).json({
    success: false,
    message,
  });
};


