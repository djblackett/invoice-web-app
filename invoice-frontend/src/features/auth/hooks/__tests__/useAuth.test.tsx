import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAuth, AuthContext } from "../useAuth";
import type { ReactNode } from "react";

describe("useAuth", () => {
  it("should return default context values when no provider is present", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toBeNull();
    expect(typeof result.current.loginWithRedirect).toBe("function");
    expect(typeof result.current.logout).toBe("function");
    expect(typeof result.current.toggleAdmin).toBe("function");
    expect(typeof result.current.getAccessTokenSilently).toBe("function");
  });

  it("should return provided context values when wrapped in AuthContext.Provider", () => {
    const mockContextValue = {
      isAuthenticated: true,
      isLoading: false,
      user: {
        sub: "user123",
        email: "test@example.com",
        name: "Test User",
      },
      loginWithRedirect: () => {},
      logout: () => {},
      toggleAdmin: () => {},
      getAccessTokenSilently: async () => "mock-token",
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockContextValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockContextValue.user);
    expect(result.current.loginWithRedirect).toBe(mockContextValue.loginWithRedirect);
  });

  it("should handle authenticated user state", () => {
    const mockContextValue = {
      isAuthenticated: true,
      isLoading: false,
      user: {
        sub: "user123",
        email: "test@example.com",
        name: "Test User",
        picture: "https://example.com/pic.jpg",
      },
      loginWithRedirect: () => {},
      logout: () => {},
      toggleAdmin: () => {},
      getAccessTokenSilently: async () => "access-token",
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockContextValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({
      sub: "user123",
      email: "test@example.com",
      name: "Test User",
      picture: "https://example.com/pic.jpg",
    });
  });

  it("should handle loading state", () => {
    const mockContextValue = {
      isAuthenticated: false,
      isLoading: true,
      user: null,
      loginWithRedirect: () => {},
      logout: () => {},
      toggleAdmin: () => {},
      getAccessTokenSilently: async () => "",
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockContextValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("should provide getAccessTokenSilently function", async () => {
    const mockToken = "mock-access-token";
    const mockGetToken = async () => mockToken;

    const mockContextValue = {
      isAuthenticated: true,
      isLoading: false,
      user: {
        sub: "user123",
        email: "test@example.com",
      },
      loginWithRedirect: () => {},
      logout: () => {},
      toggleAdmin: () => {},
      getAccessTokenSilently: mockGetToken,
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockContextValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    const token = await result.current.getAccessTokenSilently({});
    expect(token).toBe(mockToken);
  });

  it("should handle unauthenticated state", () => {
    const mockContextValue = {
      isAuthenticated: false,
      isLoading: false,
      user: null,
      loginWithRedirect: () => {},
      logout: () => {},
      toggleAdmin: () => {},
      getAccessTokenSilently: async () => "",
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockContextValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("should provide loginWithRedirect function", () => {
    let redirectCalled = false;
    const mockContextValue = {
      isAuthenticated: false,
      isLoading: false,
      user: null,
      loginWithRedirect: () => {
        redirectCalled = true;
      },
      logout: () => {},
      toggleAdmin: () => {},
      getAccessTokenSilently: async () => "",
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockContextValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    result.current.loginWithRedirect();
    expect(redirectCalled).toBe(true);
  });

  it("should provide logout function", () => {
    let logoutCalled = false;
    const mockContextValue = {
      isAuthenticated: true,
      isLoading: false,
      user: {
        sub: "user123",
        email: "test@example.com",
      },
      loginWithRedirect: () => {},
      logout: () => {
        logoutCalled = true;
      },
      toggleAdmin: () => {},
      getAccessTokenSilently: async () => "",
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockContextValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    result.current.logout({});
    expect(logoutCalled).toBe(true);
  });

  it("should provide toggleAdmin function", () => {
    let toggleCalled = false;
    const mockContextValue = {
      isAuthenticated: true,
      isLoading: false,
      user: {
        sub: "user123",
        email: "test@example.com",
      },
      loginWithRedirect: () => {},
      logout: () => {},
      toggleAdmin: () => {
        toggleCalled = true;
      },
      getAccessTokenSilently: async () => "",
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={mockContextValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    result.current.toggleAdmin();
    expect(toggleCalled).toBe(true);
  });
});
