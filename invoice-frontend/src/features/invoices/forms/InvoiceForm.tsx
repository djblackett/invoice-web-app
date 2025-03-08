import { useNewInvoiceContext } from "./NewInvoiceContextProvider.tsx";
import { BillText, EditTitle } from "@/styles/editPageStyles";
import { Suspense } from "react";
import ClientFormInfo from "./ClientFormInfo.tsx";
import CompanyFormInfo from "./CompanyFormInfo.tsx";
import Description from "./Description.tsx";
import EditFormItemList from "./EditFormItemList.tsx";
import FormErrorList from "./FormErrorList.tsx";
import styled from "styled-components";
import React from "react";

export const Form = styled.form`
  position: relative;
  z-index: 1;
  padding-bottom: 6rem;

  @media (min-width: 325px) {
    padding-bottom: 0;
  }
`;

const NewInvoiceBottomMenu = React.lazy(
  () => import("./NewInvoiceBottomMenu.tsx"),
);

const DateAndPayment = React.lazy(() => import("./DateAndPayment.tsx"));

const InvoiceForm = () => {
  const { isNewInvoiceOpen } = useNewInvoiceContext();

  return (
    <>
      <EditTitle>New Invoice</EditTitle>
      <Form style={{ zIndex: 1, position: "relative" }}>
        <BillText>Bill From</BillText>
        <CompanyFormInfo />
        <BillText>Bill To</BillText>
        <ClientFormInfo />
        <DateAndPayment />
        <Description />
        <EditFormItemList />
        <FormErrorList isEditOpen={isNewInvoiceOpen} />
        <Suspense fallback={<div>Loading...</div>}>
          <NewInvoiceBottomMenu
            closeText="Discard"
            justifyCancel="flex-start"
          />
        </Suspense>
      </Form>
    </>
  );
};

export default InvoiceForm;
