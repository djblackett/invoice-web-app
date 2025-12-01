import { Router } from "express";
import * as oauthController from "@/controllers/oauth.controller";
import { oauthCallbackLimiter } from "@/middleware/rateLimit.middleware";

const router = Router();

// ==================== Google OAuth ====================

/**
 * @route   GET /oauth/google
 * @desc    Initiate Google OAuth flow
 * @access  Public
 */
router.get("/google", oauthController.googleAuth);

/**
 * @route   GET /oauth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get(
  "/google/callback",
  oauthCallbackLimiter,
  oauthController.googleCallback
);

// ==================== Microsoft OAuth ====================

/**
 * @route   GET /oauth/microsoft
 * @desc    Initiate Microsoft OAuth flow
 * @access  Public
 */
router.get("/microsoft", oauthController.microsoftAuth);

/**
 * @route   GET /oauth/microsoft/callback
 * @desc    Microsoft OAuth callback
 * @access  Public
 */
router.get(
  "/microsoft/callback",
  oauthCallbackLimiter,
  oauthController.microsoftCallback
);

// ==================== Apple Sign In ====================

/**
 * @route   POST /oauth/apple
 * @desc    Initiate Apple Sign In flow (uses POST per Apple requirements)
 * @access  Public
 */
router.post("/apple", oauthController.appleAuth);

/**
 * @route   POST /oauth/apple/callback
 * @desc    Apple Sign In callback (uses POST per Apple requirements)
 * @access  Public
 */
router.post(
  "/apple/callback",
  oauthCallbackLimiter,
  oauthController.appleCallback
);

// ==================== Account Management ====================

/**
 * @route   POST /oauth/link/:provider
 * @desc    Link additional OAuth provider to authenticated user
 * @access  Private (requires authentication)
 */
router.post("/link/:provider", oauthController.linkProvider);

/**
 * @route   GET /oauth/accounts
 * @desc    Get all linked OAuth accounts for authenticated user
 * @access  Private (requires authentication)
 */
router.get("/accounts", oauthController.getLinkedAccounts);

export default router;
