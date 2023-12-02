import React, { useState, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import NewInvoiceForm from "../components/form-components/NewInvoiceForm";
import "../styles/react-datepicker.css";
import useWindowWidth from "../hooks/useWindowWidth";
import {
  DarkenScreen, EditTitle, FormContainerDarkenModal,
} from "../styles/editStyles";
import {Item} from "../types/types";

export type NewInvoiceProps = {
  isNewOpen: boolean,
  padding: string,
  setIsNewOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setPadding: React.Dispatch<React.SetStateAction<string>>
}

function NewInvoice({
  isNewOpen,
  setIsNewOpen,
  padding,
  setPadding,
}: NewInvoiceProps) {

  const width = useWindowWidth();

  // initial state and default values for form
  const [isDraft, setIsDraft] = useState(true);
  const [editPageWidth, setEditPageWidth] = useState<number>(width);
  const [startDate, setStartDate] = useState(new Date());
  const [items, setItems] = useState<Item[]>([]);
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
    const newItems = items.map((item) => ({ ...item, id: uuidv4() }));
    setItems(newItems);
  }, []);


  return (

    // DarkenScreen appears when newInvoice tab is open
    <DarkenScreen style={{ visibility: isNewOpen ? "visible" : "hidden" }}>
      <FormContainerDarkenModal
        style={{
          width: isNewOpen ? `${editPageWidth}px` : "0px",
          padding,
        }}
        data-testid="newInvoicePage"
      >
        <EditTitle>
          New Invoice
        </EditTitle>

        <NewInvoiceForm
          startDate={startDate}
          setStartDate={setStartDate}
          isNewOpen={isNewOpen}
          setIsNewOpen={setIsNewOpen}
          editPageWidth={editPageWidth}
          isDraft={isDraft} setIsDraft={setIsDraft}
          selectedPaymentOption={selectedPaymentOption}
          setSelectedPaymentOption={setSelectedPaymentOption}/>

      </FormContainerDarkenModal>
    </DarkenScreen>
  );
}

NewInvoice.propTypes = {
  isNewOpen: PropTypes.bool.isRequired,
  setIsNewOpen: PropTypes.func.isRequired,
  setPadding: PropTypes.func.isRequired,
  padding: PropTypes.string.isRequired
};

export default NewInvoice;
