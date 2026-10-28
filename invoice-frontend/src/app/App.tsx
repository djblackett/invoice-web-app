import React, { Fragment, Suspense, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { useRoutes } from "react-router-dom";
import Header from "../features/shared/components/Header.tsx";
import GlobalStyles from "../features/shared/styles/GlobalStyles.ts";
import { lightTheme, darkTheme } from "../features/shared/styles/Themes.ts";
import Layout from "../features/shared/components/Layout.tsx";
import { ApolloProvider } from "@apollo/client";
import useGraphQLClient from "@/features/shared/hooks/useApolloClient.ts";
import {
  Main,
  StyledToastContainer,
} from "@/features/shared/styles/AppStyles.tsx";
import { LazyMotion } from "motion/react";
import { DemoSessionBoundary } from "../features/auth/components/DemoSessionBoundary";
import { useTemporarySession } from "../features/auth/demoSession/TemporarySessionProvider";

import InvoiceDashboardPlaceholder from "@/features/invoices/components/InvoiceDashboardPlaceholder";

const WelcomePage = React.lazy(() => import("@/pages/WelcomePage"));
const ProtectedRoute = React.lazy(
  () => import("@/features/shared/components/ProtectedRoute.tsx"),
);
const AllInvoices = React.lazy(
  () => import("@/features/invoices/pages/AllInvoices.tsx"),
);
const ViewInvoice = React.lazy(
  () => import("@/features/invoices/pages/ViewInvoice.tsx"),
);
const MemoizedLogin = React.lazy(
  () => import("@/features/auth/pages/Login.tsx"),
);

const loadFeatures = () =>
  import("../features/shared/animations/motionConfig.ts").then(
    (res) => res.default,
  );

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const client = useGraphQLClient();
  const temporarySession = useTemporarySession();

  useEffect(() => {
    if (localStorage.getItem("theme") !== null) {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === "light" || storedTheme === "dark")
        setTheme(storedTheme);
    }
  }, []);

  const themeToggler = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const routes = [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<InvoiceDashboardPlaceholder />}>
              <WelcomePage />
            </Suspense>
          ),
        },
        {
          path: "login",
          element: (
            <Suspense fallback={<InvoiceDashboardPlaceholder />}>
              <MemoizedLogin />
            </Suspense>
          ),
        },
        {
          path: "invoices",
          element: (
            <Suspense fallback={<InvoiceDashboardPlaceholder />}>
              <ProtectedRoute>
                <AllInvoices />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "invoices/:id",
          element: (
            <Suspense fallback={<InvoiceDashboardPlaceholder />}>
              <ProtectedRoute>
                <ViewInvoice />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "/*",
          element: (
            <Suspense fallback={<InvoiceDashboardPlaceholder />}>
              <div>404 Not Found</div>
            </Suspense>
          ),
        },
      ],
    },
  ];

  const element = useRoutes(routes);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <GlobalStyles />
        <LazyMotion features={loadFeatures}>
          <DemoSessionBoundary>
            {({ ready, error, retry, recovery }) => (
              <>
                <Main id="container" data-testid="container">
                  <Header
                    themeToggler={themeToggler}
                    theme={theme}
                    demoReady={ready}
                  />
                  {ready ? (
                    // A reset or new workspace remounts every page, dropping
                    // open forms and routes that name the old invoice IDs.
                    <Fragment key={temporarySession?.workspace}>
                      {element}
                    </Fragment>
                  ) : (
                    (recovery ?? (
                      <InvoiceDashboardPlaceholder
                        initializing
                        error={error}
                        onRetry={retry}
                      />
                    ))
                  )}
                </Main>
                <StyledToastContainer
                  position="top-right"
                  colorMode={theme}
                  autoClose={3000}
                  limit={1}
                  pauseOnFocusLoss={false}
                />
              </>
            )}
          </DemoSessionBoundary>
        </LazyMotion>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
