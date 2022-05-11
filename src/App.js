import React, { useState, useEffect } from "react";
import "./App.css";
import data from "./data.json";
import Header from "./components/Header";
import styled from "styled-components";
import TitleGrid from "./components/TitleGrid";
import InvoiceCard from "./components/InvoiceCard";
import InvoiceGrid from "./components/InvoiceGrid";
import { GlobalStyles } from "./components/GlobalStyles";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./components/Themes";

const Main = styled.div`
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background-color: #f2f2f2;

  @media (min-width: 1200px) {
    display: grid;
    grid-template: repeat(3, auto) / 103px 1fr;
  }
`;

function App() {
  const [filter, setFilter] = useState("all");
  const [unfilteredList, setUnfilteredList] = useState(data);
  const [invoiceList, setInvoiceList] = useState(data);

   const [theme, setTheme] = useState("light");
  const themeToggler = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };
  const themeTogglerEnter = (e) => {
    if (e.charCode === 13 || e.keyCode === 13) {
      theme === "light" ? setTheme("dark") : setTheme("light");
    }
  };

  useEffect(() => {

    setInvoiceList(unfilteredList.filter(invoice => {
          if (filter === "all") {
            return true;
          } else if (filter === "paid") {
            return invoice.status === "paid";
          } else if (filter === "pending") {
            return invoice.status === "pending";
          } else if (filter === "draft") {
            return invoice.status === "draft";
          }
        })
    );
  }, [filter, unfilteredList]);


  console.log(invoiceList);
  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <GlobalStyles />

    <Main id="container">
      <Header themeToggler={themeToggler} />
      <TitleGrid />
      <InvoiceGrid>
        {
        invoiceList.map(invoice => {
          return <InvoiceCard invoice={invoice} key={invoice.id}/>
        })
        }
      </InvoiceGrid>
    </Main>
    </ThemeProvider>
  );
}

export default App;
