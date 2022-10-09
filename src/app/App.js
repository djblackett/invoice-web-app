import React, { useState } from "react";
import "../styles/App.css";
import Header from "../components/menus-toolbars/Header";
import styled from "styled-components";
import { GlobalStyles } from "../styles/GlobalStyles";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "../styles/Themes";
import { doc, getDoc } from "firebase/firestore";
import { firestoreDb } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useRoutes } from "react-router-dom";
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
  //scrollbar-gutter: stable both-edges;

  @media (min-width: 1200px) {
    display: grid;
    grid-template: repeat(3, auto) / 1fr;
    justify-items: center;
  }


  // applies the appropriate theme to each status type
  .draft {
    background: ${({theme}) => theme.draftBackgroundColor};
    color: ${({theme}) => theme.draftColor};

    .circle {
      background: ${({theme}) => theme.draftColor};
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

function App() {
  const [theme, setTheme] = useState("light");

  const themeToggler = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };


  async function testDBFunction() {
    const docRef = doc(firestoreDb, "cities", "SF");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }

    const querySnapshot = await getDocs(collection(firestoreDb, "invoices"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
  }

  // todo must fix credentials for db connection
  // useEffect(() => {
  //   testDBFunction();
  // }, []);

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
