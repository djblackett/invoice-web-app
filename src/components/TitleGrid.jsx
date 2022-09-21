import styled from "styled-components";
import FilterDropDown from "./FilterDropDown";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { selectFilter } from "../features/invoices/filterSlice";
import { useSelector } from "react-redux";

const GridContainer = styled.div`
  display: grid;
  height: 100%;
  width: 100%;
  grid-template-rows: auto;
  grid-template-columns: 1fr 1fr;
  margin-top: 104px;
  margin-bottom: 25px;

  @media (min-width: 768px) {
    width: 672px;
  }

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
    margin-left: 0;
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
  /* cursor: pointer; */

  .largeScreenText {
    display: none;
  }

  @media (min-width: 768px) {
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

const NewInvoiceButton = styled.div`
  border-radius: 24px;
  background-color: #7c5dfa;
  height: 44px;
  width: 90px;
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  margin-left: 40px;
  cursor: pointer;
  padding-left: 0.5rem;

  &:hover {
    background-color: #9277ff;
  }

  @media (min-width: 768px) {
    height: 48px;
    width: 150px;
    padding-right: 1rem;
  }

  @media (min-width: 1200px) {
  }
`;

const arrowDownSVG = (
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

const WhiteCircle = styled.div`
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

const NewText = styled.p`
  color: white;
  font-weight: bold;
  letter-spacing: -0.25px;
  white-space: nowrap;
`;

const Filter = styled.p`
  font-weight: bold;
  margin: 0;
  margin-bottom: 5px;
  cursor: pointer;
  white-space: nowrap;

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

function TitleGrid({ invoiceList, setIsNewOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("total");

  const openNewInvoice = () => {
    setIsNewOpen(true);
  };

  const toggling = (e) => {
    setIsOpen(!isOpen);
    e.stopPropagation();
    console.log("toggle function called. isOpen: " + isOpen);
  };
  const togglingButton = (e) => {
    if (e.charCode === 13 || e.keyCode === 13) {
      setIsOpen(!isOpen);
    }
  };

  const filter = useSelector(selectFilter);

  useEffect(() => {
    if (filter.pending && !filter.draft && !filter.paid) {
      setFilterText("pending");
    } else if (!filter.pending && filter.draft && !filter.paid) {
      setFilterText("draft");
    } else if (!filter.pending && !filter.draft && filter.paid) {
      setFilterText("paid");
    } else {
      setFilterText("total");
    }
  }, [filter]);

  return (
    <GridContainer>
      <TitleBox>
        <Title>Invoices</Title>
        <InvoicesLeft>
          <span className="wideScreenText">There are </span>
          {invoiceList.length}{" "}
          <span className="wideScreenText"> {filterText} </span>
          invoices
        </InvoicesLeft>
      </TitleBox>
      <ControlBox>
        <Filter onClick={toggling} onKeyPress={togglingButton}>
          Filter <span className="wideScreenText">by status</span>
        </Filter>
        <FilterDropDown
          icon={arrowDownSVG}
          isOpen={isOpen}
          handleClick={toggling}
          onKeyPress={togglingButton}
          options={["Draft", "Pending", "Paid"]}
        />
        <NewInvoiceButton onClick={openNewInvoice}>
          <WhiteCircle>{plusSignSVG}</WhiteCircle>

          <NewText>
            New <span className="largeScreenText">Invoice</span>
          </NewText>
        </NewInvoiceButton>
      </ControlBox>
    </GridContainer>
  );
}

TitleGrid.propTypes = {
  handleChangeFilter: PropTypes.func,
  invoiceList: PropTypes.array.isRequired,
  setIsNewOpen: PropTypes.func,
};

export default TitleGrid;
