import rateLimit from "express-rate-limit";

/**
 * Rate limiter for login endpoint
 * Limits to 5 requests per 15 minutes per IP
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: "Too many login attempts, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  skipSuccessfulRequests: false, // Count successful requests
});

/**
 * Rate limiter for registration endpoint
 * Limits to 3 requests per hour per IP
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per window
  message: "Too many registration attempts, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for token refresh endpoint
 * Limits to 10 requests per minute per IP
 */
export const refreshLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per window
  message: "Too many token refresh requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for OAuth callback endpoints
 * Limits to 20 requests per minute per IP
 */
export const oauthCallbackLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per window
  message: "Too many OAuth callback requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * General rate limiter for auth endpoints
 * Limits to 100 requests per 15 minutes per IP
 */
export const generalAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
