import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useUnifiedAuth } from "../useUnifiedAuth";
import { AuthContext } from "../useAuth";
import { NewAuthContext } from "../../contexts/NewAuthContext";
import type { ReactNode } from "react";

// Mock the environment variable
vi.mock("../useUnifiedAuth", async () => {
  const actual = await vi.importActual("../useUnifiedAuth");
  return {
    ...actual,
  };
});

describe("useUnifiedAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Auth0 mode", () => {
    beforeEach(() => {
      // Set to auth0 mode
      import.meta.env.VITE_AUTH_SYSTEM = "auth0";
    });

    it("should return auth0 context values when in auth0 mode", () => {
      const mockAuth0Value = {
        isAuthenticated: true,
        isLoading: false,
        user: {
          sub: "auth0|123",
          email: "test@example.com",
          name: "Test User",
        },
        loginWithRedirect: vi.fn(),
        logout: vi.fn(),
        toggleAdmin: vi.fn(),
        getAccessTokenSilently: vi.fn(async () => "auth0-token"),
      };

      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthContext.Provider value={mockAuth0Value}>
          {children}
        </AuthContext.Provider>
      );

      const { result } = renderHook(() => useUnifiedAuth(), { wrapper });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockAuth0Value.user);
      expect(result.current.loginWithRedirect).toBeDefined();
    });

    it("should provide getAccessToken function that calls getAccessTokenSilently in auth0 mode", async () => {
      const mockToken = "auth0-access-token";
      const mockAuth0Value = {
        isAuthenticated: true,
        isLoading: false,
        user: {
          sub: "auth0|123",
          email: "test@example.com",
        },
        loginWithRedirect: vi.fn(),
        logout: vi.fn(),
        toggleAdmin: vi.fn(),
        getAccessTokenSilently: vi.fn(async () => mockToken),
      };

      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthContext.Provider value={mockAuth0Value}>
          {children}
        </AuthContext.Provider>
      );

      const { result } = renderHook(() => useUnifiedAuth(), { wrapper });

      const token = await result.current.getAccessToken();
      expect(token).toBe(mockToken);
      expect(mockAuth0Value.getAccessTokenSilently).toHaveBeenCalledWith({});
    });

    it("should handle unauthenticated state in auth0 mode", () => {
      const mockAuth0Value = {
        isAuthenticated: false,
        isLoading: false,
        user: null,
        loginWithRedirect: vi.fn(),
        logout: vi.fn(),
        toggleAdmin: vi.fn(),
        getAccessTokenSilently: vi.fn(),
      };

      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthContext.Provider value={mockAuth0Value}>
          {children}
        </AuthContext.Provider>
      );

      const { result } = renderHook(() => useUnifiedAuth(), { wrapper });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it("should handle loading state in auth0 mode", () => {
      const mockAuth0Value = {
        isAuthenticated: false,
        isLoading: true,
        user: null,
        loginWithRedirect: vi.fn(),
        logout: vi.fn(),
        toggleAdmin: vi.fn(),
        getAccessTokenSilently: vi.fn(),
      };

      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthContext.Provider value={mockAuth0Value}>
          {children}
        </AuthContext.Provider>
      );

      const { result } = renderHook(() => useUnifiedAuth(), { wrapper });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe("New auth system mode", () => {
    beforeEach(() => {
      // Set to new auth mode
      import.meta.env.VITE_AUTH_SYSTEM = "new";
    });

    it("should return new auth context values when in new mode", () => {
      const mockNewAuthValue = {
        user: {
          id: "user123",
          email: "test@example.com",
          name: "Test User",
          role: "USER" as const,
        },
        isAuthenticated: true,
        isLoading: false,
        accessToken: "new-auth-token",
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        getAccessToken: vi.fn(async () => "new-auth-token"),
        loginWithOAuth: vi.fn(),
      };

      const mockAuth0Value = {
        isAuthenticated: false,
        isLoading: false,
        user: null,
        loginWithRedirect: vi.fn(),
        logout: vi.fn(),
        toggleAdmin: vi.fn(),
        getAccessTokenSilently: vi.fn(),
      };

      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthContext.Provider value={mockAuth0Value}>
          <NewAuthContext.Provider value={mockNewAuthValue}>
            {children}
          </NewAuthContext.Provider>
        </AuthContext.Provider>
      );

      const { result } = renderHook(() => useUnifiedAuth(), { wrapper });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockNewAuthValue.user);
      expect(result.current.login).toBeDefined();
      expect(result.current.register).toBeDefined();
      expect(result.current.loginWithOAuth).toBeDefined();
    });

    it("should provide login function in new auth mode", () => {
      const mockLogin = vi.fn();
      const mockNewAuthValue = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        accessToken: null,
        login: mockLogin,
        register: vi.fn(),
        logout: vi.fn(),
        getAccessToken: vi.fn(),
        loginWithOAuth: vi.fn(),
      };

      const mockAuth0Value = {
        isAuthenticated: false,
        isLoading: false,
        user: null,
        loginWithRedirect: vi.fn(),
        logout: vi.fn(),
        toggleAdmin: vi.fn(),
        getAccessTokenSilently: vi.fn(),
      };

      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthContext.Provider value={mockAuth0Value}>
          <NewAuthContext.Provider value={mockNewAuthValue}>
            {children}
          </NewAuthContext.Provider>
        </AuthContext.Provider>
      );

      const { result } = renderHook(() => useUnifiedAuth(), { wrapper });

      result.current.login?.("test@example.com", "password123");
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
    });

    it("should provide register function in new auth mode", () => {
      const mockRegister = vi.fn();
      const mockNewAuthValue = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        accessToken: null,
        login: vi.fn(),
        register: mockRegister,
        logout: vi.fn(),
        getAccessToken: vi.fn(),
        loginWithOAuth: vi.fn(),
      };

      const mockAuth0Value = {
        isAuthenticated: false,
        isLoading: false,
        user: null,
        loginWithRedirect: vi.fn(),
        logout: vi.fn(),
        toggleAdmin: vi.fn(),
        getAccessTokenSilently: vi.fn(),
      };

      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthContext.Provider value={mockAuth0Value}>
          <NewAuthContext.Provider value={mockNewAuthValue}>
            {children}
          </NewAuthContext.Provider>
        </AuthContext.Provider>
      );

      const { result } = renderHook(() => useUnifiedAuth(), { wrapper });

      result.current.register?.("test@example.com", "password123", "Test User");
      expect(mockRegister).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        "Test User",
      );
    });

    it("should provide loginWithOAuth function in new auth mode", () => {
      const mockLoginWithOAuth = vi.fn();
      const mockNewAuthValue = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        accessToken: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        getAccessToken: vi.fn(),
        loginWithOAuth: mockLoginWithOAuth,
      };

      const mockAuth0Value = {
        isAuthenticated: false,
        isLoading: false,
        user: null,
        loginWithRedirect: vi.fn(),
        logout: vi.fn(),
        toggleAdmin: vi.fn(),
        getAccessTokenSilently: vi.fn(),
      };

      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthContext.Provider value={mockAuth0Value}>
          <NewAuthContext.Provider value={mockNewAuthValue}>
            {children}
          </NewAuthContext.Provider>
        </AuthContext.Provider>
      );

      const { result } = renderHook(() => useUnifiedAuth(), { wrapper });

      result.current.loginWithOAuth?.("google");
      expect(mockLoginWithOAuth).toHaveBeenCalledWith("google");
    });

    it("should provide getAccessToken function in new auth mode", async () => {
      const mockToken = "new-auth-access-token";
      const mockGetAccessToken = vi.fn(async () => mockToken);
      const mockNewAuthValue = {
        user: {
          id: "user123",
          email: "test@example.com",
          role: "USER" as const,
        },
        isAuthenticated: true,
        isLoading: false,
        accessToken: mockToken,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        getAccessToken: mockGetAccessToken,
        loginWithOAuth: vi.fn(),
      };

      const mockAuth0Value = {
        isAuthenticated: false,
        isLoading: false,
        user: null,
        loginWithRedirect: vi.fn(),
        logout: vi.fn(),
        toggleAdmin: vi.fn(),
        getAccessTokenSilently: vi.fn(),
      };

      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthContext.Provider value={mockAuth0Value}>
          <NewAuthContext.Provider value={mockNewAuthValue}>
            {children}
          </NewAuthContext.Provider>
        </AuthContext.Provider>
      );

      const { result } = renderHook(() => useUnifiedAuth(), { wrapper });

      const token = await result.current.getAccessToken();
      expect(token).toBe(mockToken);
      expect(mockGetAccessToken).toHaveBeenCalled();
    });

    it("should throw error when NewAuthContext is not available in new mode", () => {
      const mockAuth0Value = {
        isAuthenticated: false,
        isLoading: false,
        user: null,
        loginWithRedirect: vi.fn(),
        logout: vi.fn(),
        toggleAdmin: vi.fn(),
        getAccessTokenSilently: vi.fn(),
      };

      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthContext.Provider value={mockAuth0Value}>
          {children}
        </AuthContext.Provider>
      );

      expect(() => {
        renderHook(() => useUnifiedAuth(), { wrapper });
      }).toThrow("NewAuthContext is not available");
    });

    it("should handle loading state in new auth mode", () => {
      const mockNewAuthValue = {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        accessToken: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        getAccessToken: vi.fn(),
        loginWithOAuth: vi.fn(),
      };

      const mockAuth0Value = {
        isAuthenticated: false,
        isLoading: false,
        user: null,
        loginWithRedirect: vi.fn(),
        logout: vi.fn(),
        toggleAdmin: vi.fn(),
        getAccessTokenSilently: vi.fn(),
      };

      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthContext.Provider value={mockAuth0Value}>
          <NewAuthContext.Provider value={mockNewAuthValue}>
            {children}
          </NewAuthContext.Provider>
        </AuthContext.Provider>
      );

      const { result } = renderHook(() => useUnifiedAuth(), { wrapper });

      expect(result.current.isLoading).toBe(true);
    });

    it("should handle authenticated user with admin role in new auth mode", () => {
      const mockNewAuthValue = {
        user: {
          id: "admin123",
          email: "admin@example.com",
          name: "Admin User",
          role: "ADMIN" as const,
        },
        isAuthenticated: true,
        isLoading: false,
        accessToken: "admin-token",
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        getAccessToken: vi.fn(),
        loginWithOAuth: vi.fn(),
      };

      const mockAuth0Value = {
        isAuthenticated: false,
        isLoading: false,
        user: null,
        loginWithRedirect: vi.fn(),
        logout: vi.fn(),
        toggleAdmin: vi.fn(),
        getAccessTokenSilently: vi.fn(),
      };

      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthContext.Provider value={mockAuth0Value}>
          <NewAuthContext.Provider value={mockNewAuthValue}>
            {children}
          </NewAuthContext.Provider>
        </AuthContext.Provider>
      );

      const { result } = renderHook(() => useUnifiedAuth(), { wrapper });

      expect(result.current.user).toEqual({
        id: "admin123",
        email: "admin@example.com",
        name: "Admin User",
        role: "ADMIN",
      });
    });
  });

  describe("Dual mode", () => {
    beforeEach(() => {
      // Set to dual mode (should prefer new auth)
      import.meta.env.VITE_AUTH_SYSTEM = "dual";
    });

    it("should use new auth context when in dual mode", () => {
      const mockNewAuthValue = {
        user: {
          id: "user123",
          email: "test@example.com",
          role: "USER" as const,
        },
        isAuthenticated: true,
        isLoading: false,
        accessToken: "new-auth-token",
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        getAccessToken: vi.fn(),
        loginWithOAuth: vi.fn(),
      };

      const mockAuth0Value = {
        isAuthenticated: false,
        isLoading: false,
        user: null,
        loginWithRedirect: vi.fn(),
        logout: vi.fn(),
        toggleAdmin: vi.fn(),
        getAccessTokenSilently: vi.fn(),
      };

      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthContext.Provider value={mockAuth0Value}>
          <NewAuthContext.Provider value={mockNewAuthValue}>
            {children}
          </NewAuthContext.Provider>
        </AuthContext.Provider>
      );

      const { result } = renderHook(() => useUnifiedAuth(), { wrapper });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.login).toBeDefined();
      expect(result.current.register).toBeDefined();
    });
  });
});
