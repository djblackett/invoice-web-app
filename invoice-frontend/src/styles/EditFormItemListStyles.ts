import styled from "styled-components";

export const ListContainer = styled.div`
  display: grid;
  width: 100%;
  border-radius: 8px;
  grid-template-rows: auto;
  background-color: ${({ theme }) => theme.formBackground};
`;

export const ItemsHeader = styled.div`
  display: none;

  @media (min-width: 600px) {
    display: grid;
    grid-template: 1fr / 220px 62px 116px 61px 49px;
    color: ${({ theme }) => theme.newItemText};
    margin-top: 1rem;
    padding-left: 0;
    border-radius: 8px 8px 0 0;
    justify-items: flex-start;
  }
`;

export const Col = styled.p`
  color: ${({ theme }) => theme.newItemText};
  width: fit-content;
  margin: 0;
  padding: 0;
  font-family: "Spartan", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  line-height: 18px;
  /* identical to box height, or 164% */
  letter-spacing: -0.229167px;
  justify-self: center;
`;

export const Col1 = styled(Col)`
  justify-self: start;
`;

export const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  border-radius: 8px 8px 0 0;
  background-color: ${({ theme }) => theme.formBackground};
  padding: 0;
  transition: all 250ms ease-in-out;

  @media (min-width: 768px) {
    padding: 0;
    border-radius: initial;
    margin-top: initial;
  }
`;

export const ItemTitle = styled.h1`
  font-weight: 700;
  font-size: 18px;
  line-height: 32px;
  /* identical to box height, or 178% */
  letter-spacing: -0.375px;
  color: ${({ theme }) => theme.greyText};
  padding: 0;
  margin-top: 1rem;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    margin-top: 2rem;
  }
`;
