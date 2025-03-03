import React, { Suspense, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { useRoutes } from "react-router-dom";
import Header from "../features/shared/components/Header.tsx";
import GlobalStyles from "../features/shared/styles/GlobalStyles.ts";
import { lightTheme, darkTheme } from "../features/shared/styles/Themes.ts";
import Layout from "../features/shared/components/Layout.tsx";
import { ApolloProvider } from "@apollo/client";
import useWindowWidth from "@/features/shared/hooks/useWindowWidth.tsx";
import useGraphQLClient from "@/features/shared/hooks/useApolloClient.ts";
import {
  Main,
  StyledToastContainer,
} from "@/features/shared/styles/AppStyles.tsx";
import { LazyMotion } from "motion/react";

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
const Login = React.lazy(() => import("@/features/auth/pages/Login.tsx"));

const loadFeatures = () =>
  import("../features/shared/animations/motionConfig.ts").then(
    (res) => res.default,
  );

function App() {
  const [theme, setTheme] = useState("light");
  const client = useGraphQLClient();

  useEffect(() => {
    if (localStorage.getItem("theme") !== null) {
      const storedTheme = localStorage.getItem("theme");
      setTheme(storedTheme as string);
    }
  }, []);

  const themeToggler = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const width = useWindowWidth();

  const routes = [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <WelcomePage />
            </Suspense>
          ),
        },
        {
          path: "login",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Login />
            </Suspense>
          ),
        },
        {
          path: "invoices",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <ProtectedRoute>
                <AllInvoices />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "invoices/:id",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <ProtectedRoute>
                <ViewInvoice />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "/*",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
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
          <Main id="container" data-testid="container">
            <Header themeToggler={themeToggler} theme={theme} />
            <StyledToastContainer marginTop={width > 1200 ? 0 : "72px"} />
            {element}
          </Main>
        </LazyMotion>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
