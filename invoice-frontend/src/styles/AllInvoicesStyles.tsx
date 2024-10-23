import styled from "styled-components";

export const AllInvoicesContainer = styled.div`
  width: 100%;
  height: 100%;
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
