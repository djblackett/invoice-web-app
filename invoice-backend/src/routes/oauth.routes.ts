import { Router } from "express";
import type { Request, Response } from "express";
import * as oauthController from "@/controllers/oauth.controller";
import { oauthCallbackLimiter } from "@/middleware/rateLimit.middleware";

const router = Router();

type AsyncHandler = (req: Request, res: Response) => Promise<unknown>;

const wrap = (handler: AsyncHandler) => (req: Request, res: Response) => {
  void handler(req, res);
};

// ==================== Google OAuth ====================

/**
 * @route   GET /oauth/google
 * @desc    Initiate Google OAuth flow
 * @access  Public
 */
router.get("/google", wrap(oauthController.googleAuth));

/**
 * @route   GET /oauth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get(
  "/google/callback",
  oauthCallbackLimiter,
  wrap(oauthController.googleCallback),
);

// ==================== Microsoft OAuth ====================

/**
 * @route   GET /oauth/microsoft
 * @desc    Initiate Microsoft OAuth flow
 * @access  Public
 */
router.get("/microsoft", wrap(oauthController.microsoftAuth));

/**
 * @route   GET /oauth/microsoft/callback
 * @desc    Microsoft OAuth callback
 * @access  Public
 */
router.get(
  "/microsoft/callback",
  oauthCallbackLimiter,
  wrap(oauthController.microsoftCallback),
);

// ==================== Apple Sign In ====================

/**
 * @route   POST /oauth/apple
 * @desc    Initiate Apple Sign In flow (uses POST per Apple requirements)
 * @access  Public
 */
router.post("/apple", wrap(oauthController.appleAuth));

/**
 * @route   POST /oauth/apple/callback
 * @desc    Apple Sign In callback (uses POST per Apple requirements)
 * @access  Public
 */
router.post(
  "/apple/callback",
  oauthCallbackLimiter,
  wrap(oauthController.appleCallback),
);

// ==================== Account Management ====================

/**
 * @route   POST /oauth/link/:provider
 * @desc    Link additional OAuth provider to authenticated user
 * @access  Private (requires authentication)
 */
router.post("/link/:provider", wrap(oauthController.linkProvider));

/**
 * @route   GET /oauth/accounts
 * @desc    Get all linked OAuth accounts for authenticated user
 * @access  Private (requires authentication)
 */
router.get("/accounts", wrap(oauthController.getLinkedAccounts));

export default router;
