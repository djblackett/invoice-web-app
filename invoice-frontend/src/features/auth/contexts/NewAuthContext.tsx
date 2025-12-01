import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import * as authApi from "../services/auth.api";

interface User {
  id: string;
  email: string;
  name?: string;
  role: "USER" | "ADMIN";
}

interface NewAuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string>;
  loginWithOAuth: (provider: "google" | "microsoft" | "apple") => void;
}

export const NewAuthContext = createContext<NewAuthContextValue | undefined>(undefined);

interface NewAuthProviderProps {
  children: React.ReactNode;
}

export const NewAuthProvider: React.FC<NewAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | null>(null);

  // Use ref to track refresh in progress to prevent duplicate refresh calls
  const refreshPromiseRef = useRef<Promise<string> | null>(null);

  /**
   * Parse JWT to extract expiration time (without validation)
   * Used only for scheduling refresh, not for security
   */
  const parseJWT = (token: string): { exp: number } | null => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to parse JWT:", error);
      return null;
    }
  };

  /**
   * Store tokens in memory and schedule refresh
   */
  const storeTokens = useCallback((tokens: authApi.AuthTokens, userData: User) => {
    setAccessToken(tokens.accessToken);
    setUser(userData);

    // Calculate expiration time
    const parsed = parseJWT(tokens.accessToken);
    if (parsed?.exp) {
      const expiresAt = parsed.exp * 1000; // Convert to milliseconds
      setTokenExpiresAt(expiresAt);
    }
  }, []);

  /**
   * Refresh access token using refresh token cookie
   */
  const refreshToken = useCallback(async (): Promise<string> => {
    // If refresh is already in progress, return the same promise
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    // Start new refresh
    const refreshPromise = (async () => {
      try {
        const response = await authApi.refreshAccessToken();

        // Store new access token
        setAccessToken(response.accessToken);

        // Update expiration time
        const parsed = parseJWT(response.accessToken);
        if (parsed?.exp) {
          setTokenExpiresAt(parsed.exp * 1000);
        }

        return response.accessToken;
      } catch (error) {
        console.error("Token refresh failed:", error);
        // Clear auth state on refresh failure
        setAccessToken(null);
        setUser(null);
        setTokenExpiresAt(null);
        throw error;
      } finally {
        // Clear the promise reference
        refreshPromiseRef.current = null;
      }
    })();

    // Store the promise
    refreshPromiseRef.current = refreshPromise;
    return refreshPromise;
  }, []);

  /**
   * Get valid access token, refreshing if necessary
   */
  const getAccessToken = useCallback(async (): Promise<string> => {
    // If no token, try to refresh (may have httpOnly cookie)
    if (!accessToken) {
      return refreshToken();
    }

    // If token expires in less than 1 minute, proactively refresh
    if (tokenExpiresAt && Date.now() > tokenExpiresAt - 60000) {
      return refreshToken();
    }

    return accessToken;
  }, [accessToken, tokenExpiresAt, refreshToken]);

  /**
   * Login with email/password
   */
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      storeTokens(response.tokens, response.user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [storeTokens]);

  /**
   * Register new user
   */
  const register = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.register({ email, password, name });
      storeTokens(response.tokens, response.user);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [storeTokens]);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setAccessToken(null);
      setUser(null);
      setTokenExpiresAt(null);
      setIsLoading(false);
    }
  }, []);

  /**
   * Redirect to OAuth provider
   */
  const loginWithOAuth = useCallback((provider: "google" | "microsoft" | "apple") => {
    const url = authApi.getOAuthLoginUrl(provider);
    window.location.href = url;
  }, []);

  /**
   * On mount, check for OAuth callback or try to refresh token
   */
  useEffect(() => {
    const initAuth = async () => {
      // Check if this is an OAuth callback
      const { accessToken: oauthToken, error } = authApi.extractOAuthTokenFromUrl();

      if (error) {
        console.error("OAuth error:", error);
        authApi.clearOAuthParamsFromUrl();
        setIsLoading(false);
        return;
      }

      if (oauthToken) {
        // OAuth callback - token in URL
        setAccessToken(oauthToken);

        // Parse token to get user info (basic info, not secure validation)
        const parsed = parseJWT(oauthToken);
        if (parsed) {
          setUser({
            id: (parsed as any).id,
            email: (parsed as any).email,
            name: (parsed as any).name,
            role: (parsed as any).role || "USER",
          });
          setTokenExpiresAt((parsed as any).exp * 1000);
        }

        // Clear OAuth params from URL
        authApi.clearOAuthParamsFromUrl();
        setIsLoading(false);
        return;
      }

      // Not an OAuth callback - try to refresh token from cookie
      try {
        const token = await refreshToken();
        const parsed = parseJWT(token);
        if (parsed) {
          setUser({
            id: (parsed as any).id,
            email: (parsed as any).email,
            name: (parsed as any).name,
            role: (parsed as any).role || "USER",
          });
        }
      } catch (error) {
        // No valid session - that's ok, user is not authenticated
        console.log("No existing session");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [refreshToken]);

  /**
   * Set up automatic token refresh before expiration
   */
  useEffect(() => {
    if (!tokenExpiresAt || !accessToken) {
      return;
    }

    // Refresh 2 minutes before expiration
    const timeUntilRefresh = tokenExpiresAt - Date.now() - 120000;

    if (timeUntilRefresh <= 0) {
      // Token is already expired or about to expire, refresh now
      refreshToken();
      return;
    }

    const timeoutId = setTimeout(() => {
      refreshToken();
    }, timeUntilRefresh);

    return () => clearTimeout(timeoutId);
  }, [tokenExpiresAt, accessToken, refreshToken]);

  const value: NewAuthContextValue = {
    user,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    accessToken,
    login,
    register,
    logout,
    getAccessToken,
    loginWithOAuth,
  };

  return <NewAuthContext.Provider value={value}>{children}</NewAuthContext.Provider>;
};

export const useNewAuth = () => {
  const context = useContext(NewAuthContext);
  if (context === undefined) {
    throw new Error("useNewAuth must be used within a NewAuthProvider");
  }
  return context;
};
