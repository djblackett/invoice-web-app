/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import styled from "styled-components";
import { GlobalStyles } from "./components/GlobalStyles";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./components/Themes";

import Modal from "./components/Modal";
import EditForm from "./components/EditForm";
import { useWindowWidth } from "./hooks/useWindowWidth";
import { doc, getDoc } from "firebase/firestore";
import { firestoreDb } from "./utils/firebase";
import { collection, getDocs } from "firebase/firestore";
// import EditButton from "./components/buttons/EditButton";
import { useRoutes } from "react-router-dom";
import ViewInvoice from "./components/ViewInvoice";
import Layout from "./components/Layout";
import AllInvoices from "./components/AllInvoices";

const Main = styled.div`
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.body};
  transition: all 0.4s ease;

  @media (min-width: 1200px) {
    display: grid;
    /* grid-template: repeat(3, auto) / 103px 1fr; */
    grid-template: repeat(3, auto) / 1fr;
    justify-items: center;
  }
`;

function App() {
  const [theme, setTheme] = useState("light");
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(true);
  const [padding, setPadding] = useState(0);

  const themeToggler = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  // const themeTogglerEnter = (e) => {
  //   if (e.charCode === 13 || e.keyCode === 13) {
  //     theme === 'light' ? setTheme('dark') : setTheme('light');
  //   }
  // };

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

  // must fix credentials for db connection
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

        {/* <button onClick={() => setIsOpen(true)}>Click to Open Modal</button> */}

        {/* <Modal handleClose={() => setIsEditOpen(false)} isOpen={isOpen}>
          This is Modal Content!
        </Modal> */}
      </Main>
    </ThemeProvider>
  );
}

export default App;
