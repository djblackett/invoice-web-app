/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */

import React, { useState, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import NewInvoiceForm from "../components/form-components/NewInvoiceForm";
import "../styles/react-datepicker.css";
import { useWindowWidth } from "../hooks/useWindowWidth";
import {
  DarkenScreen, EditTitle, FormContainerDarkenModal,
} from "../styles/editStyles";


function NewInvoice({
  isNewOpen,
  setIsNewOpen,
  padding,
  setPadding,
}) {

  const width = useWindowWidth();

  // initial state and default values for form
  const [isDraft, setIsDraft] = useState(true);
  const [editPageWidth, setEditPageWidth] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(1);

  useLayoutEffect(() => {
    if (width > 1200 && isNewOpen) {
      setEditPageWidth(616);
      setPadding("2.5rem 2.5rem 2rem calc(2.5rem + 17px)");
    } else if (width < 1200 && width > 325 && isNewOpen) {
      setEditPageWidth(616);
      setPadding("2.5rem 2.5rem 2.5rem 2.5rem");
    } else if (width < 325 && isNewOpen) {
      setEditPageWidth(325);
      setPadding("2rem 1.5rem 2.5rem 1.5rem");
    } else if (!isNewOpen) {
      setEditPageWidth(0);
      setPadding("0px");
    }
  }, [width, padding, isNewOpen]);

  useLayoutEffect(() => {
    const newItems = items.map((item) => {
      return { ...item, id: uuidv4() };
    });
    setItems(newItems);
  }, []);


  return (

    // DarkenScreen appears when newInvoice tab is open
    <DarkenScreen style={{ visibility: isNewOpen ? "visible" : "hidden" }}>
      <FormContainerDarkenModal
        style={{
          width: isNewOpen ? `${editPageWidth}px` : "0px",
          padding: padding,
        }}
      >
        <EditTitle>
          New Invoice
        </EditTitle>

        <NewInvoiceForm
          startDate={startDate} setStartDate={setStartDate} isNewOpen={isNewOpen} setIsNewOpen={setIsNewOpen} setItems={setItems} editPageWidth={editPageWidth} items={items} isDraft={isDraft} setIsDraft={setIsDraft}  selectedPaymentOption={selectedPaymentOption} setSelectedPaymentOption={setSelectedPaymentOption}/>

      </FormContainerDarkenModal>
    </DarkenScreen>
  );
}

NewInvoice.propTypes = {
  isNewOpen: PropTypes.bool.isRequired,
  setIsNewOpen: PropTypes.func.isRequired,
  setPadding: PropTypes.func.isRequired,
  padding: PropTypes.string,
};

export default NewInvoice;
