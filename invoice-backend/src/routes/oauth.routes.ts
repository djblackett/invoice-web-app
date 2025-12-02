import { Router } from "express";
import type { Request, Response, NextFunction, RequestHandler } from "express";
import * as oauthController from "@/controllers/oauth.controller";
import { oauthCallbackLimiter } from "@/middleware/rateLimit.middleware";

const router = Router();

// Wrapper for sync handlers that call passport.authenticate (takes next param)
const wrapSync =
  (
    handler: (req: Request, res: Response, next: NextFunction) => void,
  ): RequestHandler =>
  (req, res, next) => {
    handler(req, res, next);
  };

// Wrapper for sync handlers without next param
const wrapSyncSimple =
  (handler: (req: Request, res: Response) => void | Response): RequestHandler =>
  (req, res) => {
    handler(req, res);
  };

// Wrapper for async handlers
const wrapAsync =
  (handler: (req: Request, res: Response) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    void handler(req, res).catch(next);
  };

// ==================== Google OAuth ====================

/**
 * @route   GET /oauth/google
 * @desc    Initiate Google OAuth flow
 * @access  Public
 */
router.get("/google", wrapSync(oauthController.googleAuth));

/**
 * @route   GET /oauth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get(
  "/google/callback",
  oauthCallbackLimiter,
  wrapSync(oauthController.googleCallback),
);

// ==================== Microsoft OAuth ====================

/**
 * @route   GET /oauth/microsoft
 * @desc    Initiate Microsoft OAuth flow
 * @access  Public
 */
router.get("/microsoft", wrapSync(oauthController.microsoftAuth));

/**
 * @route   GET /oauth/microsoft/callback
 * @desc    Microsoft OAuth callback
 * @access  Public
 */
router.get(
  "/microsoft/callback",
  oauthCallbackLimiter,
  wrapSync(oauthController.microsoftCallback),
);

// ==================== Apple Sign In ====================

/**
 * @route   POST /oauth/apple
 * @desc    Initiate Apple Sign In flow (uses POST per Apple requirements)
 * @access  Public
 */
router.post("/apple", wrapSync(oauthController.appleAuth));

/**
 * @route   POST /oauth/apple/callback
 * @desc    Apple Sign In callback (uses POST per Apple requirements)
 * @access  Public
 */
router.post(
  "/apple/callback",
  oauthCallbackLimiter,
  wrapSync(oauthController.appleCallback),
);

// ==================== Account Management ====================

/**
 * @route   POST /oauth/link/:provider
 * @desc    Link additional OAuth provider to authenticated user
 * @access  Private (requires authentication)
 */
router.post("/link/:provider", wrapSyncSimple(oauthController.linkProvider));

/**
 * @route   GET /oauth/accounts
 * @desc    Get all linked OAuth accounts for authenticated user
 * @access  Private (requires authentication)
 */
router.get("/accounts", wrapAsync(oauthController.getLinkedAccounts));

export default router;
