import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {HashRouter} from "react-router-dom";
import store from "./app/store";
import App from "./app/App";
import "./styles/index.css";


const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <HashRouter>
          <App/>
        </HashRouter>
      </Provider>
    </React.StrictMode>
  );
}