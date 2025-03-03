import { AuthContext } from "@/features/auth/hooks/useAuth.ts";
import {
  useAuth0,
  Auth0Provider as OriginalAuth0Provider,
  CacheLocation,
} from "@auth0/auth0-react";

interface Auth0WrapperProps {
  children: React.ReactNode;
}

const Auth0Wrapper = ({ children }: Auth0WrapperProps) => {
  const {
    isAuthenticated,
    user,
    loginWithRedirect,
    logout,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();

  const toggleAdmin = () => {}; // intentionally not implemented

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        user: user || null,
        loginWithRedirect: loginWithRedirect,
        logout,
        getAccessTokenSilently,
        toggleAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

interface AuthorizationParams {
  redirect_uri: string;
  scope: string;
  audience: string;
}

interface Auth0ProviderWrapperProps {
  children: React.ReactNode;
  domain: string;
  clientId: string;
  useRefreshTokens?: boolean;
  cacheLocation?: CacheLocation;
  authorizationParams: AuthorizationParams;
}

// Note: You must wrap Auth0Wrapper with OriginalAuth0Provider
export const Auth0ProviderWrapper = ({
  children,
  domain,
  clientId,
  cacheLocation,
  useRefreshTokens,
  authorizationParams,
}: Auth0ProviderWrapperProps) => (
  <OriginalAuth0Provider
    domain={domain}
    clientId={clientId}
    cacheLocation={cacheLocation || "localstorage"}
    useRefreshTokens={useRefreshTokens || false}
    authorizationParams={{
      redirect_uri: authorizationParams.redirect_uri,
      scope: authorizationParams.scope,
      audience: authorizationParams.audience,
    }}
  >
    <Auth0Wrapper>{children}</Auth0Wrapper>
  </OriginalAuth0Provider>
);
