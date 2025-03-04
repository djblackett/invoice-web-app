import React, { useState, useEffect } from "react";
import { SVG } from "@/features/shared/components/buttons/NewItemButton.tsx";
import {
  Main,
  DropDownHeader,
  DropDownList,
  ListItem,
  ItemButton,
} from "../../../styles/FormDropDownStyles.tsx";
import { useNewInvoiceContext } from "./NewInvoiceContextProvider.tsx";

import { Invoice } from "@/features/invoices/types/invoiceTypes.ts";

const options = ["Net 1 Day", "Net 7 Days", "Net 14 Days", "Net 30 Days"];

const arrowDown = (
  <svg width="11" height="7" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 1l4.228 4.228L9.456 1"
      stroke="#7C5DFA"
      strokeWidth="2"
      fill="none"
      fillRule="evenodd"
    />
  </svg>
);

interface PaymentTermsProps {
  invoice?: Invoice;
}

function PaymentTermsDropdown({ invoice }: PaymentTermsProps) {
  const {
    setSelectedPaymentOption,
    selectedPaymentOption,
    isPaymentOpen,
    handleChangeSelectedOption,
    handlePaymentClick,
  } = useNewInvoiceContext();

  const [selected, setSelected] = useState("Net 1 Day");

  const onOptionClicked = (option: string) => (e: React.SyntheticEvent) => {
    e.preventDefault();
    handlePaymentClick();

    const num = Number(option.split(" ")[1]);
    handleChangeSelectedOption(num);
  };

  useEffect(() => {
    if (invoice) {
      setSelectedPaymentOption(invoice.paymentTerms);
    }
  }, [invoice]);

  useEffect(() => {
    if (selectedPaymentOption === 1) {
      setSelected("Net 1 Day");
    } else if (String(selectedPaymentOption).match(/\d+/)) {
      setSelected(`Net ${selectedPaymentOption} Days`);
    }
  }, [selectedPaymentOption, invoice]);

  return (
    <Main>
      <DropDownHeader onClick={handlePaymentClick} tabIndex={-1}>
        <h2>{selected}</h2>
        <SVG>{arrowDown}</SVG>
      </DropDownHeader>
      <DropDownList
        style={{ height: isPaymentOpen ? "192px" : 0 }}
        data-testid="dropDownList"
      >
        {options.map((option) => (
          <ListItem
            key={`${option}-li`}
            onClick={onOptionClicked(option)}
            data-testid={`${option}-testID`}
          >
            <ItemButton key={`${option}-button`} type="button">
              {options.find((term) => term.includes(String(option)))}
            </ItemButton>
          </ListItem>
        ))}
      </DropDownList>
    </Main>
  );
}

export default PaymentTermsDropdown;
