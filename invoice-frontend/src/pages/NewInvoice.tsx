import React, { useState, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import NewInvoiceForm from "../components/form-components/NewInvoiceForm";
import "../styles/react-datepicker.css";
import {
  DarkenScreen, EditTitle, FormContainerDarkenModal,
} from "../styles/editStyles";
import { Item } from "../types/types";
import { useResponsive } from "../hooks/useResponsive";

export type NewInvoiceProps = {
  isNewOpen: boolean;
  setIsNewOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function NewInvoice({
  isNewOpen,
  setIsNewOpen,
}: NewInvoiceProps) {
  // initial state and default values for form
  const [isDraft, setIsDraft] = useState(true);

  const [startDate, setStartDate] = useState(new Date());
  const [items, setItems] = useState<Item[]>([]);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(1);
  const { editPageWidth, padding } = useResponsive();

  useLayoutEffect(() => {
    const newItems = items.map((item) => ({ ...item, id: uuidv4() }));
    setItems(newItems);
  }, []);

  // DarkenScreen appears when newInvoice tab is open
  return (
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
          isDraft={isDraft}
          setIsDraft={setIsDraft}
          selectedPaymentOption={selectedPaymentOption}
          setSelectedPaymentOption={setSelectedPaymentOption}
        />

      </FormContainerDarkenModal>
    </DarkenScreen>
  );
}

NewInvoice.propTypes = {
  isNewOpen: PropTypes.bool.isRequired,
  setIsNewOpen: PropTypes.func.isRequired,
  setPadding: PropTypes.func.isRequired,
  padding: PropTypes.string.isRequired,
};

export default NewInvoice;
