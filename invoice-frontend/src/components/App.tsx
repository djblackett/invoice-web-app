"use client"
import React, { useEffect, useLayoutEffect, useState } from "react";
import "../styles/App.css";
import styled from "styled-components";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import Header from "./menus-toolbars/Header";
import AllInvoices from "./AllInvoices";
import styles from "../styles/main.module.css"

export const Main = styled.div`
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background-color: var(--colors-background);
  transition: all 0.4s ease-in-out;
  z-index: 1;

  @media (min-width: 1200px) {
    display: grid;
    grid-template: repeat(3, auto) / 1fr;
    justify-items: center;
  }

  // applies the appropriate theme to each status type
  .draft {
    background: var(--colors-draft-background);
    color: var(--colors-draft-text);

    .circle {
      background: var(--colors-draft-text);
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

// todo - returning window scroll to proper position is currently non-functional
// can use the useRef hook to dynamically get the position of a node to scroll to later
function App() {
  // const [theme, setTheme] = useState("light");
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  // useLayoutEffect(() => {
  //   if (localStorage.getItem("theme") !== null) {
  //     const storedTheme = localStorage.getItem("theme") as string;
  //     setTheme(storedTheme);
  //   }
  // }, []);

  useEffect(() => {
    window.scrollTo(scrollPosition.x, scrollPosition.y);
  }, []);

  return (
    <div
        className={styles.main}
        id="container">
      <Header />
      <AllInvoices />
    </div>
  );
}

export default App;
