import { FormProvider } from "react-hook-form";
import { BillText } from "../../../styles/editPageStyles.ts";
import CompanyFormInfo from "./CompanyFormInfo.tsx";
import EditFormItemList from "./EditFormItemList.tsx";
import FormErrorList from "./FormErrorList.tsx";
import ClientFormInfo from "./ClientFormInfo.tsx";
import Description from "./Description.tsx";
import { useNewInvoiceForm } from "../hooks/useNewInvoiceForm.tsx";
import { useNewInvoiceContext } from "./NewInvoiceContextProvider.tsx";
import React, { Suspense } from "react";
import styled from "styled-components";

const NewInvoiceBottomMenu = React.lazy(
  () => import("./NewInvoiceBottomMenu.tsx"),
);

const DateAndPayment = React.lazy(() => import("./DateAndPayment.tsx"));

const Form = styled.form`
  position: relative;
  z-index: 1;
  padding-bottom: 6rem;

  @media (min-width: 325px) {
    padding-bottom: 0;
  }
`;
export default function NewInvoiceForm() {
  const { methods } = useNewInvoiceForm();

  const { isNewInvoiceOpen } = useNewInvoiceContext();

  return (
    <FormProvider {...methods}>
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
    </FormProvider>
  );
}
