import styled from "styled-components";

export const GridContainer = styled.div`
  display: grid;
  height: 100%;
  grid-template-rows: auto;
  grid-template-columns: auto auto;
  margin-top: 104px;
  margin-bottom: 25px;
  z-index: 1;
  padding-left: 18px;
  padding-right: 18px;
  width: 100%;

  @media (min-width: 325px) {
    padding-left: 24px;
    padding-right: 24px;
    width: 100%;
  }

  @media (min-width: 600px) {
    width: 100%;
  }

  @media (min-width: 768px) {
    padding-left: 48px;
    padding-right: 48px;
  }

  @media (min-width: 1200px) {
    min-width: 730px;
    max-width: 50%;
    padding: 0;
    justify-self: center;
    margin-top: 72px;
    height: 59px;
    margin-bottom: 65px;
  }
`;

export const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (min-width: 768px) {
    margin-left: 0;
  }

  @media (min-width: 1200px) {
    margin-left: 0;
  }
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  color: ${({ theme }) => theme.text};
`;

export const InvoicesLeft = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.greyText};

  .wideScreenText {
    display: none;
  }

  @media (min-width: 768px) {
    margin-top: 4px;

    .wideScreenText {
      display: inline;
    }
  }
`;

export const ControlBox = styled.div`
  display: flex;
  justify-self: center;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;

  .largeScreenText {
    display: none;
    flex-direction: row;
  }

  @media (min-width: 300px) {
    justify-self: end;
  }
  @media (min-width: 600px) {
    margin-right: 0;
    width: 308px;

    .largeScreenText {
      display: inline;
      white-space: nowrap;
    }
  }

  @media (min-width: 1200px) {
    margin-right: 0;
    justify-content: flex-end;
  }
`;

export const NewInvoiceButton = styled.div`
  border-radius: 24px;
  background-color: #7c5dfa;
  height: 44px;
  width: 90px;
  display: flex;
  align-items: center;
  margin-left: 18px;
  cursor: pointer;
  padding-left: 0.5rem;

  &:hover {
    background-color: #9277ff;
  }

  @media (min-width: 600px) {
    height: 48px;
    width: 150px;
    padding-right: 1rem;
    margin-left: 40px;
  }

  @media (min-width: 1200px) {
  }
`;

export const arrowDownSVG = (
  <svg
    width="11"
    height="7"
    cursor="pointer"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1l4.228 4.228L9.456 1"
      stroke="#7C5DFA"
      strokeWidth="2"
      fill="none"
      fillRule="evenodd"
    />
  </svg>
);

export const WhiteCircle = styled.div`
  background-color: white;
  border-radius: 50%;
  height: 32px;
  width: 32px;
  margin: 8px;
  margin-left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NewText = styled.p`
  color: white;
  font-weight: bold;
  letter-spacing: -0.25px;
  white-space: nowrap;
`;

export const Filter = styled.p`
  font-weight: bold;
  margin: 0;
  cursor: pointer;
  white-space: nowrap;
  color: ${({ theme }) => theme.text};

  .wideScreenText {
    display: none;
  }

  @media (min-width: 768px) {
    .wideScreenText {
      display: inline;
    }
  }
`;

export const FilterButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: fit-content;
  cursor: pointer;
  flex-direction: column;

  @media (min-width: 325px) {
    flex-direction: row;
  }
`;
