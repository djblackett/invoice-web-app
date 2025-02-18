import React, { Suspense, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { useRoutes } from "react-router-dom";
import Header from "../components/menus-toolbars/Header";
import GlobalStyles from "../styles/GlobalStyles";
import { lightTheme, darkTheme } from "../styles/Themes";
import Layout from "../components/Layout";
import { ApolloProvider } from "@apollo/client";
import useWindowWidth from "@/hooks/useWindowWidth";
import useGraphQLClient from "@/hooks/useApolloClient";
import { Main, StyledToastContainer } from "@/styles/AppStyles";
import { LazyMotion } from "motion/react";

const WelcomePage = React.lazy(() => import("@/pages/WelcomePage"));
const ProtectedRoute = React.lazy(() => import("@/components/ProtectedRoute"));
const AllInvoices = React.lazy(() => import("@/pages/AllInvoices"));
const ViewInvoice = React.lazy(() => import("@/pages/ViewInvoice"));
const Login = React.lazy(() => import("@/pages/Login"));

const loadFeatures = () =>
  import("../animation/motionConfig").then((res) => res.default);

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
