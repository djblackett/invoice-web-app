import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "@/features/shared/styles/Themes.ts";
import { HashRouter } from "react-router-dom";
import store from "@/app/store";
import { Provider as ReduxProvider } from "react-redux";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { NewInvoiceProvider } from "@/features/invoices/forms/NewInvoiceContextProvider";
import { DemoModeProvider } from "@/features/shared/components/DemoModeProvider";

interface CustomRenderOptions extends RenderOptions {
  route?: string;
  mocks?: MockedResponse[];
  addTypename?: boolean;
}

const AllProviders = ({
  children,
  mocks = [],
  addTypename = false,
}: {
  children: React.ReactNode;
  mocks?: MockedResponse[];
  addTypename?: boolean;
}) => {
  return (
    <ReduxProvider store={store}>
      <DemoModeProvider>
        <MockedProvider mocks={mocks} addTypename={addTypename}>
          <ThemeProvider theme={lightTheme}>
            <HashRouter>
              <NewInvoiceProvider>{children}</NewInvoiceProvider>
            </HashRouter>
          </ThemeProvider>
        </MockedProvider>
      </DemoModeProvider>
    </ReduxProvider>
  );
};

const customRender = (
  ui: ReactElement,
  { mocks = [], addTypename = false, ...options }: CustomRenderOptions = {},
) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders mocks={mocks} addTypename={addTypename}>
        {children}
      </AllProviders>
    ),
    ...options,
  });
};

export * from "@testing-library/react";
export { customRender as render };
