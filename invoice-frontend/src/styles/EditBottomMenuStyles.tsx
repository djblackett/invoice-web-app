import styled from "styled-components";

export const MenuContainer = styled.div`
  z-index: 100;
  width: 100%;
  max-width: 100vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 4rem;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

export const NewInvoiceButton = styled.input`
  padding: 0 24px;
  border-radius: 24px;
  background-color: #7c5dfa;
  border: none;
  height: 44px;
  display: inline;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;
  color: #ffffff;

  &:hover {
    background-color: #9277ff;
  }

  @media (min-width: 1200px) {
    height: 48px;
    width: 138px;
    padding-right: 1.5rem;
    padding-left: 1.5rem;
  }
`;
