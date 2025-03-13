import { BillText, EditTitle } from "@/styles/editPageStyles.ts";
import ClientFormInfo from "../ClientFormInfo.tsx";
import CompanyFormInfo from "../CompanyFormInfo.tsx";
import Description from "../Description.tsx";
import EditFormItemList from "../items/EditFormItemList.tsx";
import FormErrorList from "../FormErrorList.tsx";
import { Invoice } from "../../types/invoiceTypes.ts";
import { useNewInvoiceContext } from "../NewInvoiceContextProvider.tsx";
import React from "react";
import { Form } from "@/features/invoices/forms/newInvoice/InvoiceForm.tsx";

interface EditFormProps {
  invoice: Invoice;
}

const DateAndPayment = React.lazy(() => import("../date/DateAndPayment.tsx"));

const EditBottomMenu = React.lazy(() => import("./EditBottomMenu.tsx"));

function EditForm({ invoice }: EditFormProps) {
  const { isNewInvoiceOpen } = useNewInvoiceContext();

  return (
    <>
      <EditTitle data-testid="edit-title">
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
