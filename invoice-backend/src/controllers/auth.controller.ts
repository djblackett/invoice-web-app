import type { Request, Response } from "express";
import container from "@/config/inversify.config";
import TYPES from "@/constants/identifiers";
import type { IUserRepo } from "@/repositories/userRepo";
import type { IAuthRepo } from "@/repositories/authRepo";
import { AuthService } from "@/services/auth.service";
import { TokenService } from "@/services/token.service";
import type { Logger } from "@/config/logger.config";
import { hashPassword, comparePassword, validatePasswordStrength } from "@/utils/crypto.util";
import {
  registerSchema,
  loginSchema,
  validateRequest,
} from "@/validators/auth.validator";
import type { RegisterInput, LoginInput } from "@/validators/auth.validator";
import { OAuthProvider } from "@prisma/client";

const getLogger = (): Logger => container.get<Logger>(TYPES.Logger);

/**
 * Register a new user with email and password
 */
export async function register(req: Request, res: Response) {
  try {
    // Validate request body
    const validation = validateRequest<RegisterInput>(registerSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validation.errors,
      });
    }

    const { email, password, name } = validation.data;

    // Additional password strength validation
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        error: "Password does not meet requirements",
        details: passwordValidation.errors,
      });
    }

    const userRepo = container.get<IUserRepo>(TYPES.IUserRepo);
    const authRepo = container.get<IAuthRepo>(TYPES.AuthRepo);
    const authService = container.get(AuthService);

    // Check if user already exists
    const existingUser = await userRepo.getUserById(email);
    if (existingUser) {
      return res.status(409).json({
        error: "User already exists",
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await userRepo.createUser({
      username: email,
      name,
      passwordHash,
    });

    if (!user.role) {
      return res.status(500).json({
        error: "User creation failed - missing role",
      });
    }

    // Create OAuth account entry for LOCAL provider
    await authRepo.createOAuthAccount({
      userId: user.id,
      provider: OAuthProvider.LOCAL,
      providerAccountId: email,
    });

    // Generate tokens
    const metadata: { userAgent?: string; ipAddress?: string } = {};
    if (req.headers["user-agent"] !== undefined) {
      metadata.userAgent = req.headers["user-agent"];
    }
    if (req.ip !== undefined) {
      metadata.ipAddress = req.ip;
    }

    const tokenPayload: {
      id: string;
      email: string;
      name?: string;
      role: "USER" | "ADMIN";
    } = {
      id: user.id,
      email,
      role: user.role,
    };
    if (name !== undefined) {
      tokenPayload.name = name;
    }

    const tokens = await authService.generateTokenPair(tokenPayload, metadata);

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    getLogger().info(`User registered: ${email}`);

    // Return access token and user info
    return res.status(201).json({
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
      user: {
        id: user.id,
        email,
        name,
        role: user.role,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    getLogger().error(`Registration error: ${message}`);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

/**
 * Login with email and password
 */
export async function login(req: Request, res: Response) {
  try {
    // Validate request body
    const validation = validateRequest<LoginInput>(loginSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validation.errors,
      });
    }

    const { email, password } = validation.data;

    const userRepo = container.get<IUserRepo>(TYPES.IUserRepo);
    const authService = container.get(AuthService);

    // Find user with password hash for verification
    const user = await userRepo.getUserForAuthentication(email);
    if (!user || !user.username || !user.role) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // OAuth-only users don't have a password set
    if (!user.passwordHash) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      getLogger().warn(`Failed login attempt for: ${email}`);
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Generate tokens
    const metadata: { userAgent?: string; ipAddress?: string } = {};
    if (req.headers["user-agent"] !== undefined) {
      metadata.userAgent = req.headers["user-agent"];
    }
    if (req.ip !== undefined) {
      metadata.ipAddress = req.ip;
    }

    const tokenPayload: {
      id: string;
      email: string;
      name?: string;
      role: "USER" | "ADMIN";
    } = {
      id: user.id,
      email: user.username,
      role: user.role,
    };
    if (user.name !== undefined) {
      tokenPayload.name = user.name;
    }

    const tokens = await authService.generateTokenPair(tokenPayload, metadata);

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    getLogger().info(`User logged in: ${email}`);

    // Return access token and user info
    return res.status(200).json({
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
      user: {
        id: user.id,
        email: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    getLogger().error(`Login error: ${message}`);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

/**
 * Logout - revoke refresh token
 */
export async function logout(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken as string | undefined;

    if (!refreshToken) {
      return res.status(400).json({
        error: "No refresh token provided",
      });
    }

    const authService = container.get(AuthService);

    // Revoke the refresh token
    await authService.revokeRefreshToken(refreshToken);

    // Clear the cookie
    res.clearCookie("refreshToken");

    getLogger().info("User logged out");

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    getLogger().error(`Logout error: ${message}`);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refresh(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken as string | undefined;

    if (!refreshToken) {
      return res.status(401).json({
        error: "No refresh token provided",
      });
    }

    const authService = container.get(AuthService);

    // Refresh tokens
    const metadata: { userAgent?: string; ipAddress?: string } = {};
    if (req.headers["user-agent"] !== undefined) {
      metadata.userAgent = req.headers["user-agent"];
    }
    if (req.ip !== undefined) {
      metadata.ipAddress = req.ip;
    }

    const tokens = await authService.refreshAccessToken(refreshToken, metadata);

    // Set new refresh token as httpOnly cookie
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    getLogger().info("Access token refreshed");

    // Return new access token
    return res.status(200).json({
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    getLogger().error(`Token refresh error: ${message}`);

    // Clear invalid refresh token
    res.clearCookie("refreshToken");

    return res.status(401).json({
      error: "Invalid or expired refresh token",
    });
  }
}

/**
 * Get JWKS (JSON Web Key Set) for public key distribution
 */
export function getJWKS(_req: Request, res: Response) {
  try {
    const tokenService = container.get(TokenService);
    const jwks = tokenService.getPublicJWKS();

    return res.status(200).json(jwks);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    getLogger().error(`JWKS error: ${message}`);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
