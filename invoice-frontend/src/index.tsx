import React from "react";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { HashRouter } from "react-router-dom";
import "./styles/index.css";
import store from "./app/store";
import App from "./app/App";
import { DemoAuthProvider } from "./auth/DemoAuthProvider";
import { Auth0ProviderWrapper } from "./auth/Auth0ProviderWrapper";

const container = document.getElementById("root");
const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";

export const VITE_REDIRECT_URI =
  import.meta.env.VITE_REDIRECT_URI ||
  window.location.origin + "/invoice-web-app/";

if (isDemoMode) {
  console.log("Demo mode enabled");
} else {
  checkEnv();
}

console.log("VITE_REDIRECT_URI:", VITE_REDIRECT_URI);
console.log("isDemoMode:", isDemoMode);

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
            domain={import.meta.env.VITE_DOMAIN ?? ""}
            clientId={import.meta.env.VITE_CLIENT_ID ?? ""}
            cacheLocation="localstorage" // Optional: Ensures tokens persist across refreshes
            useRefreshTokens // Optional: Improves token handling
            authorizationParams={{
              redirect_uri: VITE_REDIRECT_URI, //+ "#/invoices",
              scope: import.meta.env.VITE_SCOPE ?? "", // Include offline_access
              audience: import.meta.env.VITE_AUDIENCE ?? "",
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

function checkEnv() {
  if (!import.meta.env.VITE_BACKEND_URL) {
    throw new Error("VITE_BACKEND_URL is required");
  }
  if (!import.meta.env.VITE_AUDIENCE) {
    throw new Error("VITE_AUDIENCE is required");
  }
  if (!import.meta.env.VITE_SCOPE) {
    throw new Error("VITE_SCOPE is required");
  }
  if (!import.meta.env.VITE_DOMAIN) {
    throw new Error("VITE_DOMAIN is required");
  }
  if (!import.meta.env.VITE_CLIENT_ID) {
    throw new Error("VITE_CLIENT_ID is required");
  }
  if (!import.meta.env.VITE_REDIRECT_URI && VITE_REDIRECT_URI === "") {
    throw new Error("VITE_REDIRECT_URI is required");
  }
}
