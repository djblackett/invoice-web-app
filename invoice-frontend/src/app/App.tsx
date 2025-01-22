import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { useRoutes } from "react-router-dom";
import Header from "../components/menus-toolbars/Header";
import GlobalStyles from "../styles/GlobalStyles";
import { lightTheme, darkTheme } from "../styles/Themes";
import ViewInvoice from "../pages/ViewInvoice";
import Layout from "../components/Layout";
import AllInvoices from "../pages/AllInvoices";
import { ApolloProvider } from "@apollo/client";
import useWindowWidth from "@/hooks/useWindowWidth";
import Login from "@/pages/Login";
import ProtectedRoute from "@/ProtectedRoute";
import WelcomePage from "@/pages/WelcomePage";
import useGraphQLClient from "@/hooks/useApolloClient";
import { Main, StyledToastContainer } from "@/styles/AppStyles";

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
          element: <WelcomePage />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "invoices",
          element: (
            <ProtectedRoute>
              <AllInvoices />
            </ProtectedRoute>
          ),
        },
        {
          path: "invoices/:id",
          element: (
            <ProtectedRoute>
              <ViewInvoice />
            </ProtectedRoute>
          ),
        },
        {
          path: "/*",
          element: <div>404 Not Found</div>,
        },
      ],
    },
  ];

  const element = useRoutes(routes);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <GlobalStyles />
        <Main id="container" data-testid="container">
          <Header themeToggler={themeToggler} theme={theme} />
          <StyledToastContainer marginTop={width > 1200 ? 0 : "72px"} />
          {element}
        </Main>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
