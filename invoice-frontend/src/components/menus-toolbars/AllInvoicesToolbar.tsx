import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FilterDropDown from "./FilterDropDown";
import { selectFilter } from "../../features/invoices/filterSlice";
import useWindowWidth from "../../hooks/useWindowWidth";
import { Invoice } from "../../types/types";

const GridContainer = styled.div`
  display: grid;
  height: 100%;
  grid-template-rows: auto;
  grid-template-columns: 1fr 1fr;
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

const TitleBox = styled.div`
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

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  color: var(--colors-text);
`;

const InvoicesLeft = styled.p`
  margin: 0;

  color: var(--colors-grey-text);

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

const ControlBox = styled.div`
  display: flex;
  justify-self: end;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  .largeScreenText {
    display: none;
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

const NewInvoiceButton = styled.div`
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

const FilterButton = styled.div`
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

const plusSignSVG = (
  <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.313 10.023v-3.71h3.71v-2.58h-3.71V.023h-2.58v3.71H.023v2.58h3.71v3.71z"
      fill="#7C5DFA"
      fillRule="nonzero"
    />
  </svg>
);

type AllInvoicesToolbarProps = {
  invoiceList: Invoice[];
  setIsNewOpen: (b: boolean) => void;
};

function AllInvoicesToolbar({
  invoiceList,
  setIsNewOpen,
}: AllInvoicesToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("total");
  const width = useWindowWidth();

  const openNewInvoice = () => {
    setIsNewOpen(true);
  };

  const toggling = () => {
    setIsOpen(!isOpen);
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

  const invoiceNumber = width < 768 ? "No " : "no ";

  return (
    <GridContainer>
      <TitleBox>
        <Title data-testid="invoicesTitle">Invoices</Title>
        <InvoicesLeft>
          <span className="wideScreenText">There are </span>
          {invoiceList.length || invoiceNumber}{" "}
          <span className="wideScreenText"> {filterText} </span>
          invoices
        </InvoicesLeft>
      </TitleBox>
      <ControlBox>
        <FilterButton onClick={toggling} data-testid="filterButton">
          <Filter>
            Filter <span className="wideScreenText">by status</span>
          </Filter>
          <FilterDropDown
            icon={arrowDownSVG}
            isOpen={isOpen}
            options={["Draft", "Pending", "Paid"]}
          />
        </FilterButton>
        <NewInvoiceButton
          onClick={openNewInvoice}
          data-testid="newInvoiceButton"
        >
          <WhiteCircle>{plusSignSVG}</WhiteCircle>
          <NewText>
            New <span className="largeScreenText">Invoice</span>
          </NewText>
        </NewInvoiceButton>
      </ControlBox>
    </GridContainer>
  );
}

// AllInvoicesToolbar.propTypes = {
//   handleChangeFilter: PropTypes.func,
//   invoiceList: PropTypes.array.isRequired,
//   setIsNewOpen: PropTypes.func,
// };

export default AllInvoicesToolbar;

export const MemoizedAllInvoicesToolbar = React.memo(AllInvoicesToolbar);
