import TitleGrid from "../components/TitleGrid";
import InvoiceGrid from "../components/InvoiceGrid";
// import data from "../data.json";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import InvoiceCard from "../components/InvoiceCard";
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
`;

function AllInvoices() {
  // const [filter, setFilter] = useState("All");
  const filter = useSelector(selectFilter);
  const dispatch = useDispatch();
  const data = useSelector(selectInvoices);
  // eslint-disable-next-line no-unused-vars
  // const [unfilteredList, setUnfilteredList] = useState(data);
  const [invoiceList, setInvoiceList] = useState(data);

  const [isNewOpen, setIsNewOpen] = useState(false);
  const [padding, setPadding] = useState("");

  // const handleChangeFilter = (status) => {
  //   // setFilter(status);
  // };
  useEffect(() => {
    dispatch(addIdToExistingInvoices());
    // console.log("adding ids");
    // data.forEach((invoice) => console.log(invoice.items));
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
      <TitleGrid invoiceList={invoiceList} setIsNewOpen={setIsNewOpen} />
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
