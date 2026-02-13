const rateLimit = require('express-rate-limit');

// Allow overrides via env and skip limiter in non-production so local dev won't be rate limited
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000; // 15 minutes
const AUTH_MAX = process.env.AUTH_RATE_LIMIT_MAX ? parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) : 10;

// General purpose limiter for auth-related endpoints
const authLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: AUTH_MAX,
  // Skip rate limiting during local development to avoid accidental lockouts
  skip: (req, res) => process.env.NODE_ENV !== 'production',
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});

module.exports = { authLimiter };