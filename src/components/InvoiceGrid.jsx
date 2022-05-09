import styled from "styled-components";

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 150px;
  align-items: center;

  @media (min-width: 768px) {
    padding: 0 48px 0 48px;
  }
`;

function InvoiceGrid({ children }) {
  return <FlexContainer>{children}</FlexContainer>;
}

export default InvoiceGrid;
