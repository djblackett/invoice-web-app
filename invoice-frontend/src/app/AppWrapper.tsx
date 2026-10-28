import { Auth0ProviderWrapper } from "@/features/auth/components/Auth0ProviderWrapper";
import { DemoAuthProvider } from "@/features/auth/components/DemoAuthProvider";
import { useDemoModeContext } from "@/features/shared/components/DemoModeProvider";
import { TemporarySessionProvider } from "@/features/auth/demoSession/TemporarySessionProvider";
import { HashRouter, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import App from "./App";

import {
  VITE_DOMAIN,
  VITE_CLIENT_ID,
  VITE_REDIRECT_URI,
  VITE_SCOPE,
  VITE_AUDIENCE,
  hasAuth0Config,
  temporaryDemoSessionsEnabled,
} from "@/config/config";

// A new or reset workspace has new invoice IDs: go to the dashboard.
const RoutedTemporarySessionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const navigate = useNavigate();
  return (
    <TemporarySessionProvider
      onWorkspaceChange={() => {
        void navigate("/invoices", { replace: true });
      }}
    >
      {children}
    </TemporarySessionProvider>
  );
};

const AppWrapper = () => {
  const { isDemoMode } = useDemoModeContext();

  return isDemoMode ? (
    <DemoAuthProvider>
      <HashRouter>
        {temporaryDemoSessionsEnabled() ? (
          <RoutedTemporarySessionProvider>
            <App />
          </RoutedTemporarySessionProvider>
        ) : (
          <App />
        )}
      </HashRouter>
    </DemoAuthProvider>
  ) : hasAuth0Config ? (
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
      <HashRouter>
        <App />
      </HashRouter>
    </Auth0ProviderWrapper>
  ) : (
    <HashRouter>
      <App />
    </HashRouter>
  );
};

export default AppWrapper;
