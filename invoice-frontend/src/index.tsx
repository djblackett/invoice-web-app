import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import "./styles/index.css";
import store from "./app/store";
import App from "./app/App";
import { Auth0Provider } from "@auth0/auth0-react";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <HashRouter>
          <Auth0Provider
            domain="dev-n4e4qk7s3kbzusrs.us.auth0.com"
            clientId="loNmHPxISIwdG530C4nTgEP5lWFVusZW"
            // useRefreshTokens={true}
            authorizationParams={{
              redirect_uri: window.location.origin, // + "/invoice-web-app/invoices/",
            }}
          >
            <App />
          </Auth0Provider>
        </HashRouter>
      </Provider>
    </React.StrictMode>,
  );
}
