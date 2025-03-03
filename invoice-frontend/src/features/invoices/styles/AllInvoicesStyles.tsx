import styled from "styled-components";

export const AllInvoicesContainer = styled.main`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 6.5rem;
  z-index: 5;
  overflow-y: auto;

  @media (min-width: 1200px) {
    padding-right: 48px;
    padding-left: 48px;
  }
`;
