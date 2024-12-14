import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    //font-family: "League Spartan", Tahoma, Helvetica, Arial, Roboto, sans-serif;
    font-size: 16px;
  }
  `;

export default GlobalStyles;
