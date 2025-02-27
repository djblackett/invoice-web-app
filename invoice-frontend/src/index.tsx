import React from "react";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { HashRouter } from "react-router-dom";
import "./styles/index.css";
import store from "./app/store";
import App from "./app/App";
import { DemoAuthProvider } from "./auth/DemoAuthProvider";
import { Auth0ProviderWrapper } from "./auth/Auth0ProviderWrapper";
import {
  VITE_AUDIENCE,
  VITE_CLIENT_ID,
  VITE_DOMAIN,
  VITE_SCOPE,
  VITE_REDIRECT_URI,
  isDemoMode,
} from "./config/config";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ReduxProvider store={store}>
        {isDemoMode ? (
          <DemoAuthProvider>
            <HashRouter>
              <App />
            </HashRouter>
          </DemoAuthProvider>
        ) : (
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
        )}
      </ReduxProvider>
    </React.StrictMode>,
  );
}
