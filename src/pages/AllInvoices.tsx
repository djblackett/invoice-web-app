import React, {useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { MemoizedAllInvoicesToolbar } from "../components/menus-toolbars/AllInvoicesToolbar";
import InvoiceGrid from "../components/invoice-components/InvoiceGrid";
import InvoiceCard from "../components/invoice-components/InvoiceCard";
import EmptyList from "../components/EmptyList";
import {
    selectInvoices,
    addIdToExistingInvoices,
} from "../features/invoices/invoicesSlice";
import { selectFilter } from "../features/invoices/filterSlice";
import NewInvoice from "./NewInvoice";
import useWindowWidth  from "../hooks/useWindowWidth";
import {AllInvoicesProps} from "../types/types";

const AllInvoicesContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 6.5rem;
  z-index: 5;
  overflow-y: auto;
  
  @media (min-width: 1200px) {
    padding-right: 48px;
    padding-left: 48px;
  }
`;

function AllInvoices({ setScrollPosition}: AllInvoicesProps) {

    const filter = useSelector(selectFilter);
    const dispatch = useDispatch();
    const data = useSelector(selectInvoices);
    const [invoiceList, setInvoiceList] = useState(data);
    const width = useWindowWidth();

    const [isNewOpen, setIsNewOpen] = useState(false);
    const [padding, setPadding] = useState("");


    const linkStyleMobile = {
        width: "100%",
        textDecoration: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    const linkStyleDesktop = {
        width: "50%",
        minWidth: "730px",
        textDecoration: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    const scrollToTop = () => {
        setScrollPosition({ x: window.scrollX, y: window.scrollY });
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        dispatch(addIdToExistingInvoices());
    }, [dispatch]);


    // Because the filter menu has 3 checkboxes, there are many cases to consider
    // All of them checked is the same as none of them checked - Nobody really wants an empty list
    useEffect(() => {
        setInvoiceList(
            data.filter((invoice) => {
                if (!filter.draft && !filter.pending && !filter.paid) {
                    return true;
                } if (filter.draft && filter.pending && filter.paid) {
                    return true;
                } if (filter.draft && filter.paid) {
                    return invoice.status === "paid" || invoice.status === "draft";
                } if (filter.draft && filter.pending) {
                    return invoice.status === "pending" || invoice.status === "draft";
                } if (filter.pending && filter.paid) {
                    return invoice.status === "paid" || invoice.status === "pending";
                } if (filter.paid) {
                    return invoice.status === "paid";
                } if (filter.pending) {
                    return invoice.status === "pending";
                } if (filter.draft) {
                    return invoice.status === "draft";
                }
            })
        );
    }, [filter, data]);

    return (
        <AllInvoicesContainer>
            <MemoizedAllInvoicesToolbar invoiceList={invoiceList} setIsNewOpen={setIsNewOpen} />
            <NewInvoice
                isNewOpen={isNewOpen}
                setIsNewOpen={setIsNewOpen}
                padding={padding}
                setPadding={setPadding}
            />
            {invoiceList.length > 0 && (
                <InvoiceGrid>
                    {invoiceList.map((invoice) => (
                        <Link
                            key={`${invoice.id  }-link`}
                            to={`/${invoice.id}`}
                            style={width < 1200 ? linkStyleMobile : linkStyleDesktop}
                            onClick={scrollToTop}
                        >
                            <InvoiceCard invoice={invoice} key={invoice.id} />
                        </Link>
                    ))}

                    {invoiceList.length === 0 && <EmptyList />}
                </InvoiceGrid>
            )}

            {invoiceList.length === 0 && <EmptyList />}

            {/* Clear button is for debugging the empty invoices page */}
            {/* <button onClick={() => dispatch(clearInvoices())}>Clear Invoices</button> */}
        </AllInvoicesContainer>
    );
}

export default AllInvoices;
