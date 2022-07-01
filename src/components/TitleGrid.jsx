import styled from "styled-components";
import DropDown from "./DropDown";
import PropTypes from "prop-types";

const GridContainer = styled.div`
  display: grid;
  height: 100%;
  width: 100%;
  grid-template-rows: auto;
  grid-template-columns: 1fr 1fr;
  margin-top: 32px;
  margin-bottom: 25px;

  @media (min-width: 1200px) {
    /* display: inline-grid; */
    width: 730px;
    justify-self: center;
    margin-top: 72px;
    height: 59px;
    margin-bottom: 65px;
    /* margin-right: 355px; */
  }
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

  @media (min-width: 1200px) {
    margin-left: 0;
  }
`;

const Title = styled.h1`
  margin: 0;
`;

const InvoicesLeft = styled.p`
  margin: 0;
  margin-top: 4px;
  color: ${({ theme }) => theme.greyText};

  .wideScreenText {
    display: none;
  }

  @media (min-width: 768px) {
    .wideScreenText {
      display: inline;
    }
  }
`;

const ControlBox = styled.div`
  display: flex;
  justify-self: end;
  flex-direction: row;
  align-items: center;
  margin-right: 24px;
  justify-content: space-between;

  @media (min-width: 768px) {
    margin-right: 48px;
    width: 308px;
  }

  @media (min-width: 1200px) {
    margin-right: 0;
    justify-content: flex-end;
  }
`;

const NewInvoiceButton = styled.div`
  border-radius: 24px;
  background-color: #7c5dfa;
  height: 44px;
  width: 90px;
  display: flex;
  align-items: center;
  margin-left: 40px;
`;

const arrowDownSVG = (
  <svg width="11" height="7" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 1l4.228 4.228L9.456 1"
      stroke="#7C5DFA"
      strokeWidth="2"
      fill="none"
      fillRule="evenodd"
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

  .wideScreenText {
    display: none;
  }

  @media (min-width: 768px) {
    .wideScreenText {
      display: inline;
    }
  }
`;

const plusSignSVG = (
  <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.313 10.023v-3.71h3.71v-2.58h-3.71V.023h-2.58v3.71H.023v2.58h3.71v3.71z"
      fill="#7C5DFA"
      fillRule="nonzero"
    />
  </svg>
);

// change filter text dynamically

function TitleGrid({ handleChangeFilter, invoiceList }) {
  return (
    <GridContainer>
      <TitleBox>
        <Title>Invoices</Title>
        <InvoicesLeft>
          <span className="wideScreenText">There are </span>
          {invoiceList.length} <span className="wideScreenText"> total </span>
          invoices
        </InvoicesLeft>
      </TitleBox>
      <ControlBox>
        <Filter>
          Filter <span className="wideScreenText">by status</span>
        </Filter>
        <DropDown
          icon={arrowDownSVG}
          handleChangeFilter={handleChangeFilter}
        ></DropDown>
        <NewInvoiceButton>
          <WhiteCircle>{plusSignSVG}</WhiteCircle>

          <NewText>New</NewText>
        </NewInvoiceButton>
      </ControlBox>
    </GridContainer>
  );
}

TitleGrid.propTypes = {
  handleChangeFilter: PropTypes.func.isRequired,
  invoiceList: PropTypes.array.isRequired,
};

export default TitleGrid;
