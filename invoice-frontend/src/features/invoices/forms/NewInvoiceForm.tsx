import { FormProvider } from "react-hook-form";
import { BillText } from "../../styles/editPageStyles";
import CompanyFormInfo from "./CompanyFormInfo";
import EditFormItemList from "./EditFormItemList";
import FormErrorList from "./FormErrorList";
import ClientFormInfo from "./ClientFormInfo";
import Description from "./Description";
import { useNewInvoiceForm } from "../../features/invoices/hooks/useNewInvoiceForm.tsx";
import { useNewInvoiceContext } from "./NewInvoiceContextProvider";
import React, { Suspense } from "react";

const NewInvoiceBottomMenu = React.lazy(
  () => import("../menus-toolbars/NewInvoiceBottomMenu"),
);

const DateAndPayment = React.lazy(() => import("./DateAndPayment"));

export default function NewInvoiceForm() {
  const { methods } = useNewInvoiceForm();

  const { isNewInvoiceOpen } = useNewInvoiceContext();

  return (
    <FormProvider {...methods}>
      <form style={{ zIndex: 1 }}>
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
      </form>
    </FormProvider>
  );
}
