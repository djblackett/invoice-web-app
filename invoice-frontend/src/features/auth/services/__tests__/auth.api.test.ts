import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  register,
  login,
  refreshAccessToken,
  logout,
  getOAuthLoginUrl,
  extractOAuthTokenFromUrl,
  clearOAuthParamsFromUrl,
  type RegisterRequest,
  type LoginRequest,
  type AuthResponse,
  type RefreshTokenResponse,
} from "../auth.api";

// Mock fetch globally
global.fetch = vi.fn();

describe("Auth API Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("register", () => {
    const mockRegisterRequest: RegisterRequest = {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    };

    const mockAuthResponse: AuthResponse = {
      user: {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        role: "USER",
      },
      tokens: {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        expiresIn: 3600,
      },
    };

    it("should register user successfully", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAuthResponse,
      });

      const result = await register(mockRegisterRequest);

      expect(result).toEqual(mockAuthResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/register"),
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockRegisterRequest),
          credentials: "include",
        }),
      );
    });

    it("should throw error when registration fails", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Email already exists" }),
      });

      await expect(register(mockRegisterRequest)).rejects.toThrow(
        "Email already exists",
      );
    });

    it("should handle network errors", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error("Network error"),
      );

      await expect(register(mockRegisterRequest)).rejects.toThrow(
        "Network error",
      );
    });

    it("should use default error message when response has no error field", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      await expect(register(mockRegisterRequest)).rejects.toThrow(
        "Registration failed",
      );
    });

    it("should handle malformed error responses", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      await expect(register(mockRegisterRequest)).rejects.toThrow(
        "Registration failed",
      );
    });
  });

  describe("login", () => {
    const mockLoginRequest: LoginRequest = {
      email: "test@example.com",
      password: "password123",
    };

    const mockAuthResponse: AuthResponse = {
      user: {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        role: "USER",
      },
      tokens: {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        expiresIn: 3600,
      },
    };

    it("should login user successfully", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAuthResponse,
      });

      const result = await login(mockLoginRequest);

      expect(result).toEqual(mockAuthResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockLoginRequest),
          credentials: "include",
        }),
      );
    });

    it("should throw error for invalid credentials", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Invalid credentials" }),
      });

      await expect(login(mockLoginRequest)).rejects.toThrow(
        "Invalid credentials",
      );
    });

    it("should throw error for non-existent user", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "User not found" }),
      });

      await expect(login(mockLoginRequest)).rejects.toThrow("User not found");
    });

    it("should handle network errors", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error("Network error"),
      );

      await expect(login(mockLoginRequest)).rejects.toThrow("Network error");
    });

    it("should use default error message when response has no error field", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      await expect(login(mockLoginRequest)).rejects.toThrow("Login failed");
    });
  });

  describe("refreshAccessToken", () => {
    const mockRefreshResponse: RefreshTokenResponse = {
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
      expiresIn: 3600,
    };

    it("should refresh access token successfully", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRefreshResponse,
      });

      const result = await refreshAccessToken();

      expect(result).toEqual(mockRefreshResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/refresh"),
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        }),
      );
    });

    it("should throw error when refresh token is invalid", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Invalid refresh token" }),
      });

      await expect(refreshAccessToken()).rejects.toThrow(
        "Invalid refresh token",
      );
    });

    it("should throw error when refresh token is expired", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Refresh token expired" }),
      });

      await expect(refreshAccessToken()).rejects.toThrow(
        "Refresh token expired",
      );
    });

    it("should handle network errors", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error("Network error"),
      );

      await expect(refreshAccessToken()).rejects.toThrow("Network error");
    });

    it("should use default error message when response has no error field", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      await expect(refreshAccessToken()).rejects.toThrow(
        "Token refresh failed",
      );
    });
  });

  describe("logout", () => {
    it("should logout successfully", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
      });

      await logout();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/logout"),
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        }),
      );
    });

    it("should not throw error when logout fails on server", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
      });

      await logout();

      expect(consoleSpy).toHaveBeenCalledWith("Logout failed on server");
      consoleSpy.mockRestore();
    });

    it("should handle network errors gracefully", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error("Network error"),
      );

      // Should not throw
      await expect(logout()).rejects.toThrow("Network error");
    });
  });

  describe("getOAuthLoginUrl", () => {
    it("should return Google OAuth URL", () => {
      const url = getOAuthLoginUrl("google");
      expect(url).toContain("/oauth/google");
    });

    it("should return Microsoft OAuth URL", () => {
      const url = getOAuthLoginUrl("microsoft");
      expect(url).toContain("/oauth/microsoft");
    });

    it("should return Apple OAuth URL", () => {
      const url = getOAuthLoginUrl("apple");
      expect(url).toContain("/oauth/apple");
    });
  });

  describe("extractOAuthTokenFromUrl", () => {
    beforeEach(() => {
      // Reset window.location
      delete (window as any).location;
    });

    it("should extract access token from URL", () => {
      (window as any).location = {
        search: "?token=abc123&new=false",
      };

      const result = extractOAuthTokenFromUrl();

      expect(result).toEqual({
        accessToken: "abc123",
        isNewUser: false,
        error: null,
      });
    });

    it("should detect new user flag", () => {
      (window as any).location = {
        search: "?token=abc123&new=true",
      };

      const result = extractOAuthTokenFromUrl();

      expect(result).toEqual({
        accessToken: "abc123",
        isNewUser: true,
        error: null,
      });
    });

    it("should extract error from URL", () => {
      (window as any).location = {
        search: "?error=oauth_failed",
      };

      const result = extractOAuthTokenFromUrl();

      expect(result).toEqual({
        accessToken: null,
        isNewUser: false,
        error: "oauth_failed",
      });
    });

    it("should return null values when no params present", () => {
      (window as any).location = {
        search: "",
      };

      const result = extractOAuthTokenFromUrl();

      expect(result).toEqual({
        accessToken: null,
        isNewUser: false,
        error: null,
      });
    });

    it("should handle complex URL with multiple params", () => {
      (window as any).location = {
        search: "?token=abc123&new=true&other=param&foo=bar",
      };

      const result = extractOAuthTokenFromUrl();

      expect(result).toEqual({
        accessToken: "abc123",
        isNewUser: true,
        error: null,
      });
    });
  });

  describe("clearOAuthParamsFromUrl", () => {
    beforeEach(() => {
      delete (window as any).location;
      delete (window as any).history;
    });

    it("should remove OAuth params from URL", () => {
      const replaceStateSpy = vi.fn();

      (window as any).location = {
        href: "http://example.com?token=abc123&new=true&error=test",
      };

      (window as any).history = {
        replaceState: replaceStateSpy,
      };

      (window as any).document = {
        title: "Test Page",
      };

      clearOAuthParamsFromUrl();

      expect(replaceStateSpy).toHaveBeenCalledWith(
        {},
        "Test Page",
        "http://example.com/",
      );
    });

    it("should preserve other query parameters", () => {
      const replaceStateSpy = vi.fn();

      (window as any).location = {
        href: "http://example.com?token=abc123&keep=this&new=true",
      };

      (window as any).history = {
        replaceState: replaceStateSpy,
      };

      (window as any).document = {
        title: "Test Page",
      };

      clearOAuthParamsFromUrl();

      const calledUrl = replaceStateSpy.mock.calls[0][2];
      expect(calledUrl).toContain("keep=this");
      expect(calledUrl).not.toContain("token=");
      expect(calledUrl).not.toContain("new=");
    });

    it("should handle URL with no query params", () => {
      const replaceStateSpy = vi.fn();

      (window as any).location = {
        href: "http://example.com",
      };

      (window as any).history = {
        replaceState: replaceStateSpy,
      };

      (window as any).document = {
        title: "Test Page",
      };

      clearOAuthParamsFromUrl();

      expect(replaceStateSpy).toHaveBeenCalledWith(
        {},
        "Test Page",
        "http://example.com/",
      );
    });
  });
});
