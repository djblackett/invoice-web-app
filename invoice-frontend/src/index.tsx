import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import "./styles/index.css";
import store from "./app/store";
import App from "./app/App";
import { Auth0Provider } from "@auth0/auth0-react";

const container = document.getElementById("root");

export const VITE_REDIRECT_URI =
  import.meta.env.VITE_REDIRECT_URI ||
  window.location.origin + "/invoice-web-app/";

console.log("VITE_REDIRECT_URI:", VITE_REDIRECT_URI);

if (container) {
  const root = createRoot(container);

  {
    /* todo - use env vars here */
  }
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <Auth0Provider
          domain="dev-n4e4qk7s3kbzusrs.us.auth0.com"
          clientId="loNmHPxISIwdG530C4nTgEP5lWFVusZW"
          cacheLocation="localstorage" // Optional: Ensures tokens persist across refreshes
          useRefreshTokens // Optional: Improves token handling
          authorizationParams={{
            redirect_uri: VITE_REDIRECT_URI + "#/invoices",
            scope: "openid profile email offline_access", // Include offline_access
            audience: "https://invoice-web-app/",
          }}
        >
          <HashRouter>
            <App />
          </HashRouter>
        </Auth0Provider>
      </Provider>
    </React.StrictMode>,
  );
}
