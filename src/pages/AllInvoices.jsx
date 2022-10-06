import AllInvoicesToolbar from "../components/menus-toolbars/AllInvoicesToolbar";
import InvoiceGrid from "../components/invoice-components/InvoiceGrid";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import InvoiceCard from "../components/invoice-components/InvoiceCard";
import EmptyList from "../components/EmptyList";
import { Link } from "react-router-dom";
import {
  selectInvoices,
  addIdToExistingInvoices,
  clearInvoices,
} from "../features/invoices/invoicesSlice";
import { selectFilter } from "../features/invoices/filterSlice";
import styled from "styled-components";
import NewInvoice from "./NewInvoice";

const AllInvoicesContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 6.5rem;
  z-index: 5;
`;

function AllInvoices() {

  const filter = useSelector(selectFilter);
  const dispatch = useDispatch();
  const data = useSelector(selectInvoices);
  const [invoiceList, setInvoiceList] = useState(data);

  const [isNewOpen, setIsNewOpen] = useState(false);
  const [padding, setPadding] = useState("");

  useEffect(() => {
    dispatch(addIdToExistingInvoices());
  }, []);

  useEffect(() => {
    setInvoiceList(
      data.filter((invoice) => {
        if (!filter.draft && !filter.pending && !filter.paid) {
          return true;
        } else if (filter.draft && filter.pending && filter.paid) {
          return true;
        } else if (filter.draft && filter.paid) {
          return invoice.status === "paid" || invoice.status === "draft";
        } else if (filter.draft && filter.pending) {
          return invoice.status === "pending" || invoice.status === "draft";
        } else if (filter.pending && filter.paid) {
          return invoice.status === "paid" || invoice.status === "pending";
        } else if (filter.paid) {
          return invoice.status === "paid";
        } else if (filter.pending) {
          return invoice.status === "pending";
        } else if (filter.draft) {
          return invoice.status === "draft";
        }
      })
    );
  }, [filter, data]);

  return (
    <AllInvoicesContainer>
      <AllInvoicesToolbar invoiceList={invoiceList} setIsNewOpen={setIsNewOpen} />
      <NewInvoice
        isNewOpen={isNewOpen}
        setIsNewOpen={setIsNewOpen}
        padding={padding}
        setPadding={setPadding}
      />
      {invoiceList.length > 0 && (
        <InvoiceGrid>
          {invoiceList.map((invoice) => {
            return (
              <Link
                key={invoice.id + "-link"}
                to={`/${invoice.id}`}
                style={{
                  textDecoration: "none",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <InvoiceCard invoice={invoice} key={invoice.id} />
              </Link>
            );
          })}

          {invoiceList.length === 0 && <EmptyList />}
        </InvoiceGrid>
      )}

      {invoiceList.length === 0 && <EmptyList />}
      <button onClick={() => dispatch(clearInvoices())}>Clear Invoices</button>
    </AllInvoicesContainer>
  );
}

export default AllInvoices;
