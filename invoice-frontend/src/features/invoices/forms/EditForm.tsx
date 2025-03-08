import { BillText, EditTitle } from "@/styles/editPageStyles";
import ClientFormInfo from "./ClientFormInfo";
import CompanyFormInfo from "./CompanyFormInfo";
import Description from "./Description";
import EditFormItemList from "./EditFormItemList";
import FormErrorList from "./FormErrorList";
import { Invoice } from "../types/invoiceTypes";
import { useNewInvoiceContext } from "./NewInvoiceContextProvider";
import React from "react";
import { Form } from "./InvoiceForm.tsx";

interface EditFormProps {
  invoice: Invoice;
}

const DateAndPayment = React.lazy(() => import("./DateAndPayment.tsx"));

const EditBottomMenu = React.lazy(() => import("./EditBottomMenu.tsx"));

function EditForm({ invoice }: EditFormProps) {
  const { isNewInvoiceOpen } = useNewInvoiceContext();
  return (
    <>
      <EditTitle>
        Edit <span style={{ color: "#7E88C3" }}>#</span>
        {invoice && invoice.id.substring(0, 6)}
      </EditTitle>
      <Form style={{ display: "flex", flexDirection: "column" }}>
        <BillText>Bill From</BillText>
        <CompanyFormInfo invoice={invoice} />
        <BillText>Bill To</BillText>
        <ClientFormInfo invoice={invoice} />
        <DateAndPayment invoice={invoice} />
        <Description invoice={invoice} />
        <EditFormItemList invoice={invoice} isEditOpen={isNewInvoiceOpen} />
        <FormErrorList isEditOpen={isNewInvoiceOpen} />
        <EditBottomMenu
          saveText="Save Changes"
          closeText="Cancel"
          justifyCancel=""
        />
      </Form>
    </>
  );
}

export default EditForm;
