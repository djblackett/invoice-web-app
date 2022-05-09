import styled from "styled-components";

const GridContainer = styled.div`
  display: grid;
  height: 100%;
  width: 100%;
  grid-template-rows: auto;
  grid-template-columns: 1fr 1fr;
  margin-top: 32px;
  margin-bottom: 25px;
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
  margin-left: 24px;

  @media (min-width: 768px) {
    margin-left: 48px;
  }
`;

const Title = styled.h1`
  margin: 0;
`;

const InvoicesLeft = styled.p`
  margin: 0;
  margin-top: 4px;
  color: #888eb0;
`;

const ControlBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 24px;
  justify-content: space-between;
`;

const NewInvoiceButton = styled.div`
  border-radius: 24px;
  background-color: #7c5dfa;
  height: 44px;
  width: 90px;
  display: flex;
  align-items: center;
`;

const arrowDownSVG = (
  <svg width="11" height="7" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 1l4.228 4.228L9.456 1"
      stroke="#7C5DFA"
      stroke-width="2"
      fill="none"
      fill-rule="evenodd"
    />
  </svg>
);

const WhiteCircle = styled.div`
  background-color: white;
  border-radius: 50%;
  height: 32px;
  width: 32px;
  margin: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NewText = styled.p`
  color: white;
  font-weight: bold;
  letter-spacing: -0.25px;
`;

const Filter = styled.p`
  font-weight: bold;
  margin: 0;
  margin-bottom: 5px;
`;

const plusSignSVG = (
  <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.313 10.023v-3.71h3.71v-2.58h-3.71V.023h-2.58v3.71H.023v2.58h3.71v3.71z"
      fill="#7C5DFA"
      fill-rule="nonzero"
    />
  </svg>
);

function TitleGrid() {
  return (
    <GridContainer>
      <TitleBox>
        <Title>Invoices</Title>
        <InvoicesLeft>7 invoices</InvoicesLeft>
      </TitleBox>
      <ControlBox>
        <Filter>Filter</Filter>
        {arrowDownSVG}
        <NewInvoiceButton>
          <WhiteCircle>{plusSignSVG}</WhiteCircle>

          <NewText>New</NewText>
        </NewInvoiceButton>
      </ControlBox>
    </GridContainer>
  );
}

export default TitleGrid;
