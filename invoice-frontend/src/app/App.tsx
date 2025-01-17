import { useLayoutEffect, useState } from "react";
import "../styles/App.css";
import styled, { ThemeProvider } from "styled-components";
import { Navigate, Route, Routes, useRoutes } from "react-router-dom";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import Header from "../components/menus-toolbars/Header";
import GlobalStyles from "../styles/GlobalStyles";
import { lightTheme, darkTheme } from "../styles/Themes";
import ViewInvoice from "../pages/ViewInvoice";
import Layout from "../components/Layout";
import AllInvoices from "../pages/AllInvoices";
import {
  createHttpLink,
  split,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer } from "react-toastify";
import useWindowWidth from "src/hooks/useWindowWidth";
import Login from "src/pages/Login";
import NotFound from "src/pages/NotFound";
import ProtectedRoute from "src/ProtectedRoute";
import WelcomePage from "src/pages/WelcomePage";

const Main = styled.main`
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.body};
  transition: all 0.4s ease-in-out;
  z-index: 1;

  @media (min-width: 1200px) {
    display: grid;
    grid-template: repeat(3, auto) / 1fr;
    justify-items: center;
  }

  // applies the appropriate theme to each status type
  .draft {
    background: ${({ theme }) => theme.draftBackgroundColor};
    color: ${({ theme }) => theme.draftColor};

    .circle {
      background: ${({ theme }) => theme.draftColor};
    }
  }

  .pending {
    background-color: rgba(255, 143, 0, 0.06);
    color: rgb(255, 143, 0);
    .circle {
      background: rgb(255, 143, 0);
    }
  }

  .paid {
    background-color: rgba(51, 214, 159, 0.06);
    color: #33d69f;
    .circle {
      background: #33d69f;
    }
  }
`;

loadDevMessages();
loadErrorMessages();

function App() {
  const [theme, setTheme] = useState("light");
  const { getAccessTokenSilently } = useAuth0();

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

  if (!VITE_BACKEND_URL) {
    throw new Error("Backend URL was not set during frontend build process");
  }

  const authLink = setContext(async (_, { headers }) => {
    const options = {
      authorizationParams: {
        audience: "https://invoice-web-app/",
        scope: "openid profile email offline_access",
      }, // todo - make an env var for this
    };
    const token = await getAccessTokenSilently(options);
    return {
      headers: {
        ...headers,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    };
  });

  const httpLink = createHttpLink({ uri: VITE_BACKEND_URL });
  const wsLink = new GraphQLWsLink(
    createClient({ url: "ws://" + VITE_BACKEND_URL }),
  );

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    authLink.concat(httpLink),
  );

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink,
    connectToDevTools: true,
  });

  useLayoutEffect(() => {
    if (localStorage.getItem("theme") !== null) {
      const storedTheme = localStorage.getItem("theme");
      setTheme(storedTheme as string);
    }
  }, []);

  const themeToggler = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
    localStorage.setItem("theme", theme === "light" ? "dark" : "light");
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
          path: "invoices/:id", // "/invoices/:id"
          element: (
            <ProtectedRoute>
              <ViewInvoice />
            </ProtectedRoute>
          ),
        },
        // Optionally, add a catch-all route for 404
        {
          path: "/*",
          element: <div>404 Not Found</div>,
        },
      ],
    },
  ];

  //  const routes = [
  //    {
  //      path: "/",
  //      // index: true,
  //      element: <Layout />,
  //      children: [
  //        {
  //          path: "invoices/",
  //          element: <AllInvoices />,
  //          children: [
  //            {
  //              path: ":id",
  //              element: <ViewInvoice />,
  //            },
  //          ],
  //        },
  //      ],
  //    },
  //  ];

  const element = useRoutes(routes);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <GlobalStyles />
        <Main id="container">
          <Header themeToggler={themeToggler} theme={theme} />
          <ToastContainer
            style={{
              marginTop: width > 1200 ? 0 : "72px",
              backgroundColor: "transparent", // theme.background,
            }}
          />
          {/* <Layout /> */}
          {element}
          {/* <AllInvoices /> */}
        </Main>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
