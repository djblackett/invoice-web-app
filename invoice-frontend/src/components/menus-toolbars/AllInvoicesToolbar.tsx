import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FilterDropDown from "./FilterDropDown";
import { selectFilter } from "../../features/invoices/filterSlice";
import useWindowWidth from "../../hooks/useWindowWidth";
import { Invoice } from "../../types/types";
import {
  GridContainer,
  TitleBox,
  Title,
  InvoicesLeft,
  ControlBox,
  FilterButton,
  Filter,
  arrowDownSVG,
} from "../../styles/AllInvoicesToolbarStyles";
import NewInvoiceButton from "../buttons/NewInvoiceButton";
import { useNewInvoiceContext } from "../form-components/NewInvoiceContextProvider";

type AllInvoicesToolbarProps = {
  invoiceList: Invoice[];
};

function AllInvoicesToolbar({ invoiceList }: AllInvoicesToolbarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterText, setFilterText] = useState("total");
  const width = useWindowWidth();

  const { setIsNewInvoiceOpen } = useNewInvoiceContext();

  const openNewInvoice = () => {
    setIsNewInvoiceOpen(true);
  };

  const toggling = () => {
    setIsFilterOpen(!isFilterOpen);
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
        <FilterButton
          onClick={toggling}
          data-testid="filterButton"
          aria-label="Filter invoices by status"
        >
          <Filter>
            Filter <span className="wideScreenText">by status</span>
          </Filter>
          <FilterDropDown
            icon={arrowDownSVG}
            isOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            options={["Draft", "Pending", "Paid"]}
          />
        </FilterButton>
        <NewInvoiceButton
          handleClick={openNewInvoice}
          data-testid="newInvoiceButton"
        />
      </ControlBox>
    </GridContainer>
  );
}

export default AllInvoicesToolbar;

export const MemoizedAllInvoicesToolbar = React.memo(AllInvoicesToolbar);
