import React, { ReactElement } from "react";
import {
  render as rtlRender,
  renderHook as rtlRenderHook,
  RenderOptions,
  RenderHookOptions,
} from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "@/features/shared/styles/Themes.ts";
import { MemoryRouter } from "react-router-dom";
import store from "@/app/store";
import { Provider as ReduxProvider } from "react-redux";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { InMemoryCache } from "@apollo/client";
import { NewInvoiceProvider } from "@/features/invoices/forms/NewInvoiceContextProvider";
import { DemoModeProvider } from "@/features/shared/components/DemoModeProvider";

interface ProviderOptions {
  route?: string;
  mocks?: MockedResponse[];
}

interface CustomRenderOptions extends RenderOptions, ProviderOptions {}
interface CustomRenderHookOptions<TProps>
  extends RenderHookOptions<TProps>,
    ProviderOptions {}

const AllProviders = ({
  children,
  mocks = [],
  route = "/",
}: ProviderOptions & { children: React.ReactNode }) => (
  <ReduxProvider store={store}>
    <DemoModeProvider>
      <MockedProvider mocks={mocks} cache={new InMemoryCache()}>
        <ThemeProvider theme={lightTheme}>
          <MemoryRouter initialEntries={[route]}>
            <NewInvoiceProvider>{children}</NewInvoiceProvider>
          </MemoryRouter>
        </ThemeProvider>
      </MockedProvider>
    </DemoModeProvider>
  </ReduxProvider>
);

const renderWithProviders = (
  ui: ReactElement,
  { mocks = [], route = "/", ...options }: CustomRenderOptions = {},
) =>
  rtlRender(ui, {
    wrapper: ({ children }) => (
      <AllProviders mocks={mocks} route={route}>
        {children}
      </AllProviders>
    ),
    ...options,
  });

const renderHookWithProviders = <TProps, TResult>(
  hook: (props: TProps) => TResult,
  { mocks = [], route = "/", ...options }: CustomRenderHookOptions<TProps> = {},
) =>
  rtlRenderHook(hook, {
    wrapper: ({ children }) => (
      <AllProviders mocks={mocks} route={route}>
        {children}
      </AllProviders>
    ),
    ...options,
  });

export * from "@testing-library/react";
export { renderWithProviders, renderHookWithProviders };
