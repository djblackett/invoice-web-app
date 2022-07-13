import TitleGrid from "./TitleGrid";
import InvoiceGrid from "./InvoiceGrid";
// import data from "../data.json";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import InvoiceCard from "./InvoiceCard";
import EmptyList from "./EmptyList";
import { Link } from "react-router-dom";
import { selectInvoices } from "../features/invoices/invoicesSlice";
import { selectFilter } from "../features/invoices/filterSlice";

function AllInvoices() {
  // const [filter, setFilter] = useState("All");
  const filter = useSelector(selectFilter);

  const data = useSelector(selectInvoices);
  // eslint-disable-next-line no-unused-vars
  // const [unfilteredList, setUnfilteredList] = useState(data);
  const [invoiceList, setInvoiceList] = useState(data);

  // const handleChangeFilter = (status) => {
  //   // setFilter(status);
  // };

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
    <>
      <TitleGrid invoiceList={invoiceList} />

      {invoiceList.length > 0 && (
        <InvoiceGrid>
          {invoiceList.map((invoice) => {
            return (
              <Link
                key={invoice.id}
                to={`/${invoice.id}`}
                style={{ textDecoration: "none", width: "fit-content" }}
              >
                <InvoiceCard invoice={invoice} key={invoice.id} />
              </Link>
            );
          })}

          {invoiceList.length === 0 && <EmptyList />}
        </InvoiceGrid>
      )}

      {invoiceList.length === 0 && <EmptyList />}
    </>
  );
}

export default AllInvoices;
