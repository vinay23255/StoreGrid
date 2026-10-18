const config = require('../config');

/**
 * HTTP Request Logger Middleware
 * Safe logging: records method, path, status, and duration without printing raw request bodies or customer data.
 */
function requestLogger(req, res, next) {
  if (config.nodeEnv === 'test') {
    return next();
  }

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const color = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : '\x1b[32m';
    const reset = '\x1b[0m';

    console.log(
      `[StoreGrid HTTP] ${color}${req.method} ${req.originalUrl} ${status}${reset} - ${duration}ms`
    );
  });

  next();
}

module.exports = requestLogger;
