import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-size: 16px;
  }
  `;

export default GlobalStyles;
