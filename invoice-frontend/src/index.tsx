import React from "react";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import "./features/shared/styles/index.css";
import store from "./app/store";
import { DemoModeProvider } from "@/features/shared/components/DemoModeProvider.tsx";
import AppWrapper from "./app/AppWrapper.tsx";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ReduxProvider store={store}>
        <DemoModeProvider>
          <AppWrapper />
        </DemoModeProvider>
      </ReduxProvider>
    </React.StrictMode>,
  );
}
