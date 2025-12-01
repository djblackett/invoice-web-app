import { VITE_BACKEND_URL } from "@/config/config";

const API_BASE_URL = VITE_BACKEND_URL?.replace("/graphql", "") || "http://localhost:8000";

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserInfo {
  id: string;
  email: string;
  name?: string;
  role: "USER" | "ADMIN";
}

export interface AuthResponse {
  user: UserInfo;
  tokens: AuthTokens;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Register a new user with email/password
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include", // Include cookies for refresh token
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Registration failed" }));
    throw new Error(error.error || "Registration failed");
  }

  return response.json();
}

/**
 * Login with email/password
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include", // Include cookies for refresh token
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Login failed" }));
    throw new Error(error.error || "Login failed");
  }

  return response.json();
}

/**
 * Refresh access token using httpOnly refresh token cookie
 */
export async function refreshAccessToken(): Promise<RefreshTokenResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include", // Send refresh token cookie
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Token refresh failed" }));
    throw new Error(error.error || "Token refresh failed");
  }

  return response.json();
}

/**
 * Logout user (clears refresh token cookie)
 */
export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    console.error("Logout failed on server");
  }
}

/**
 * Get OAuth provider login URL
 */
export function getOAuthLoginUrl(provider: "google" | "microsoft" | "apple"): string {
  return `${API_BASE_URL}/oauth/${provider}`;
}

/**
 * Handle OAuth callback (extract token from URL)
 */
export function extractOAuthTokenFromUrl(): {
  accessToken: string | null;
  isNewUser: boolean;
  error: string | null;
} {
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get("token");
  const isNewUser = params.get("new") === "true";
  const error = params.get("error");

  return { accessToken, isNewUser, error };
}

/**
 * Clear OAuth parameters from URL without reload
 */
export function clearOAuthParamsFromUrl(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete("token");
  url.searchParams.delete("new");
  url.searchParams.delete("error");
  window.history.replaceState({}, document.title, url.toString());
}
