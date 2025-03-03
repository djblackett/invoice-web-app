import React, { useState, useEffect, Suspense } from "react";
import { useSelector } from "react-redux";
import { selectFilter } from "../store/filterSlice.ts";
import useWindowWidth from "../../shared/hooks/useWindowWidth.tsx";
import { Invoice } from "../../../types/types.ts";
import {
  GridContainer,
  TitleBox,
  Title,
  InvoicesLeft,
  ControlBox,
  FilterButton,
  Filter,
  arrowDownSVG,
} from "../styles/AllInvoicesToolbarStyles.tsx";
import NewInvoiceButton from "@/features/shared/components/buttons/NewInvoiceButton.tsx";
import { useNewInvoiceContext } from "../forms/NewInvoiceContextProvider.tsx";

const FilterDropDown = React.lazy(() => import("./FilterDropDown.tsx"));

type AllInvoicesToolbarProps = {
  invoiceList: Invoice[];
};

function AllInvoicesToolbar({ invoiceList }: AllInvoicesToolbarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterText, setFilterText] = useState("total");
  const width = useWindowWidth();

  const { setIsNewInvoiceOpen, isNewInvoiceOpen } = useNewInvoiceContext();

  const openNewInvoice = () => {
    setIsNewInvoiceOpen(!isNewInvoiceOpen);
  };

  const openFilter = () => {
    if (!isFilterOpen) setIsFilterOpen(true);
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
          onClick={openFilter}
          data-testid="filterButton"
          aria-label="Filter invoices by status"
          style={{ pointerEvents: isFilterOpen ? "none" : "auto" }}
        >
          <Filter>
            Filter <span className="wideScreenText">by status</span>
          </Filter>
          <Suspense fallback={<div>Loading...</div>}>
            <FilterDropDown
              icon={arrowDownSVG}
              isOpen={isFilterOpen}
              setIsFilterOpen={setIsFilterOpen}
              options={["Draft", "Pending", "Paid"]}
            />
          </Suspense>
        </FilterButton>
        <NewInvoiceButton handleClick={openNewInvoice} />
      </ControlBox>
    </GridContainer>
  );
}

export default AllInvoicesToolbar;

export const MemoizedAllInvoicesToolbar = React.memo(AllInvoicesToolbar);
