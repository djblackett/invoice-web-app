
import { useLayoutEffect, useState } from "react";
import "../styles/App.css";
import styled, { ThemeProvider } from "styled-components";
import { useRoutes } from "react-router-dom";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import Header from "../components/menus-toolbars/Header";
import GlobalStyles from "../styles/GlobalStyles";
import { lightTheme, darkTheme } from "../styles/Themes";
import ViewInvoice from "../pages/ViewInvoice";
import Layout from "../components/Layout";
import AllInvoices from "../pages/AllInvoices";


const Main = styled.div`
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
    color: #33D69F;
    .circle {
      background: #33D69F;
    }
  }
`;

loadDevMessages();
loadErrorMessages();

function App() {
  const [theme, setTheme] = useState("light");


  useLayoutEffect(() => {
    if (localStorage.getItem("theme") !== null) {
      const storedTheme = localStorage.getItem("theme");
      setTheme(storedTheme as string);
    }
  }, []);


  const themeToggler = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    theme === "light" ? setTheme("dark") : setTheme("light");
    localStorage.setItem("theme", theme === "light" ? "dark" : "light");
  };


  const routes = [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <AllInvoices />,
        },
        {
          path: ":id",
          element: <ViewInvoice />,
        },
      ],
    },
  ];

  const element = useRoutes(routes);

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <GlobalStyles />
      <Main id="container">
        <Header themeToggler={themeToggler} theme={theme} />
        {element}
      </Main>
    </ThemeProvider>
  );
}



export default App;
