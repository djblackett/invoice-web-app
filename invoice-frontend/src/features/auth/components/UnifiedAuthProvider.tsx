import React from "react";
import { Auth0ProviderWrapper } from "./Auth0ProviderWrapper";
import { NewAuthProvider } from "../contexts/NewAuthContext";
import { useDemoModeContext } from "@/features/shared/components/DemoModeProvider";
import { DemoAuthProvider } from "./DemoAuthProvider";
import {
  VITE_DOMAIN,
  VITE_CLIENT_ID,
  VITE_REDIRECT_URI,
  VITE_SCOPE,
  VITE_AUDIENCE,
} from "@/config/config";

// Environment variable to control which auth system to use
// Can be: "auth0", "new", or "dual" (tries new first, falls back to auth0)
const AUTH_SYSTEM = import.meta.env.VITE_AUTH_SYSTEM || "auth0";

interface UnifiedAuthProviderProps {
  children: React.ReactNode;
}

/**
 * Unified Authentication Provider
 *
 * Controls which authentication system is active based on VITE_AUTH_SYSTEM:
 * - "auth0": Uses only Auth0 (default, backward compatible)
 * - "new": Uses only new OAuth system
 * - "dual": Supports both (for migration period)
 *
 * Also respects demo mode when enabled
 */
export const UnifiedAuthProvider: React.FC<UnifiedAuthProviderProps> = ({ children }) => {
  const { isDemoMode } = useDemoModeContext();

  // Demo mode takes precedence
  if (isDemoMode) {
    return <DemoAuthProvider>{children}</DemoAuthProvider>;
  }

  // Use new authentication system
  if (AUTH_SYSTEM === "new" || AUTH_SYSTEM === "dual") {
    return <NewAuthProvider>{children}</NewAuthProvider>;
  }

  // Default to Auth0 (backward compatible)
  return (
    <Auth0ProviderWrapper
      domain={VITE_DOMAIN ?? ""}
      clientId={VITE_CLIENT_ID ?? ""}
      cacheLocation="localstorage"
      useRefreshTokens
      authorizationParams={{
        redirect_uri: VITE_REDIRECT_URI,
        scope: VITE_SCOPE ?? "",
        audience: VITE_AUDIENCE ?? "",
      }}
    >
      {children}
    </Auth0ProviderWrapper>
  );
};
