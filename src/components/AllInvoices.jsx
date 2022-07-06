import TitleGrid from "./TitleGrid";
import InvoiceGrid from "./InvoiceGrid";
import data from "../data.json";
import React, { useState, useEffect } from "react";
import InvoiceCard from "./InvoiceCard";
import EmptyList from "./EmptyList";
import {Link} from 'react-router-dom'

function AllInvoices() {
  const [filter, setFilter] = useState("All");
  // eslint-disable-next-line no-unused-vars
  const [unfilteredList, setUnfilteredList] = useState(data);
  const [invoiceList, setInvoiceList] = useState(data);

  const handleChangeFilter = (status) => {
    setFilter(status);
  };

  useEffect(() => {
    setInvoiceList(
      unfilteredList.filter((invoice) => {
        if (filter === "All") {
          return true;
        } else if (filter === "Paid") {
          return invoice.status === "paid";
        } else if (filter === "Pending") {
          return invoice.status === "pending";
        } else if (filter === "Draft") {
          return invoice.status === "draft";
        }
      })
    );
  }, [filter, unfilteredList]);

  return (
    <>
      <TitleGrid
        handleChangeFilter={handleChangeFilter}
        invoiceList={invoiceList}
      />
      
        {invoiceList.length > 0 && 
          <InvoiceGrid>
            {invoiceList.map((invoice) => {
              return (
              <Link
              key={invoice.id}
              to={`/${invoice.id}`}
              // style={{
              //   textDecoration: "none",
              //   display: "flex",
              //   justifyContent: "center",
              //   alignItems: "center",
              //   height: "375px",
              // }}
            >
              <InvoiceCard invoice={invoice} key={invoice.id} />
              </Link>
              )
            })}

        {invoiceList.length === 0 && <EmptyList />}
      </InvoiceGrid>
}
    </>
  );
}

export default AllInvoices;
