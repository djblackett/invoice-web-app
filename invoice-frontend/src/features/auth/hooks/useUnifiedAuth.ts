import { useContext } from "react";
import { useAuth } from "./useAuth";
import { NewAuthContext } from "../contexts/NewAuthContext";

const AUTH_SYSTEM = import.meta.env.VITE_AUTH_SYSTEM || "auth0";

interface UnifiedAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  login?: (email: string, password: string) => Promise<void>;
  register?: (email: string, password: string, name: string) => Promise<void>;
  loginWithRedirect?: () => void;
  loginWithOAuth?: (provider: "google" | "microsoft" | "apple") => void;
  logout: (...args: any[]) => void;
  getAccessToken: () => Promise<string>;
}

/**
 * Unified Auth Hook
 *
 * Provides a consistent interface regardless of which auth system is active
 * Automatically selects the correct auth context based on VITE_AUTH_SYSTEM
 */
export const useUnifiedAuth = (): UnifiedAuthReturn => {
  const auth0Context = useAuth();
  const newAuthContext = useContext(NewAuthContext);

  // Use new auth system
  if (AUTH_SYSTEM === "new" || AUTH_SYSTEM === "dual") {
    if (!newAuthContext) {
      throw new Error("NewAuthContext is not available. Make sure UnifiedAuthProvider is used.");
    }

    return {
      isAuthenticated: newAuthContext.isAuthenticated,
      isLoading: newAuthContext.isLoading,
      user: newAuthContext.user,
      login: newAuthContext.login,
      register: newAuthContext.register,
      loginWithOAuth: newAuthContext.loginWithOAuth,
      logout: newAuthContext.logout,
      getAccessToken: newAuthContext.getAccessToken,
    };
  }

  // Use Auth0 (default)
  return {
    isAuthenticated: auth0Context.isAuthenticated,
    isLoading: auth0Context.isLoading,
    user: auth0Context.user,
    loginWithRedirect: auth0Context.loginWithRedirect,
    logout: auth0Context.logout,
    getAccessToken: async () => {
      return auth0Context.getAccessTokenSilently({});
    },
  };
};
