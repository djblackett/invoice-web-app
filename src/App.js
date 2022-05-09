import React from "react";
import "./App.css";
import data from "./data.json";
import Header from "./components/Header";
import styled from "styled-components";
import TitleGrid from "./components/TitleGrid";
import InvoiceCard from "./components/InvoiceCard";
import InvoiceGrid from "./components/InvoiceGrid";

const Main = styled.div`
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background-color: #f2f2f2;
`;

function App() {
  return (
    <Main id="container">
      <Header />
      <TitleGrid />
      <InvoiceGrid>
        <InvoiceCard />
        <InvoiceCard />
        <InvoiceCard />
        <InvoiceCard />
      </InvoiceGrid>
    </Main>
  );
}

export default App;
