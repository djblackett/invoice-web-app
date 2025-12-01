import { Router } from "express";
import * as authController from "@/controllers/auth.controller";

const router = Router();

/**
 * @route   POST /auth/register
 * @desc    Register a new user with email and password
 * @access  Public
 */
router.post("/register", authController.register);

/**
 * @route   POST /auth/login
 * @desc    Login with email and password
 * @access  Public
 */
router.post("/login", authController.login);

/**
 * @route   POST /auth/logout
 * @desc    Logout and revoke refresh token
 * @access  Private (requires refresh token cookie)
 */
router.post("/logout", authController.logout);

/**
 * @route   POST /auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Private (requires refresh token cookie)
 */
router.post("/refresh", authController.refresh);

/**
 * @route   GET /.well-known/jwks.json
 * @desc    Get JSON Web Key Set (public keys for token verification)
 * @access  Public
 */
router.get("/.well-known/jwks.json", authController.getJWKS);

export default router;
