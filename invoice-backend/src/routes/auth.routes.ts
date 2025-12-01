import { Router } from "express";
import type { Request, Response } from "express";
import * as authController from "@/controllers/auth.controller";

const router = Router();

type AsyncHandler = (req: Request, res: Response) => Promise<unknown>;

const wrap = (handler: AsyncHandler) => (req: Request, res: Response) => {
  void handler(req, res);
};

/**
 * @route   POST /auth/register
 * @desc    Register a new user with email and password
 * @access  Public
 */
router.post("/register", wrap(authController.register));

/**
 * @route   POST /auth/login
 * @desc    Login with email and password
 * @access  Public
 */
router.post("/login", wrap(authController.login));

/**
 * @route   POST /auth/logout
 * @desc    Logout and revoke refresh token
 * @access  Private (requires refresh token cookie)
 */
router.post("/logout", wrap(authController.logout));

/**
 * @route   POST /auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Private (requires refresh token cookie)
 */
router.post("/refresh", wrap(authController.refresh));

/**
 * @route   GET /.well-known/jwks.json
 * @desc    Get JSON Web Key Set (public keys for token verification)
 * @access  Public
 */
router.get("/.well-known/jwks.json", authController.getJWKS);

export default router;
