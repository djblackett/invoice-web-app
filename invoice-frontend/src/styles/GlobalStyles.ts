import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  body {
    background: var(--colors-body);
    color: var(--colors-text);
    //font-family: "League Spartan", Tahoma, Helvetica, Arial, Roboto, sans-serif;
    font-size: 16px;
  }
  `;

export default GlobalStyles;
