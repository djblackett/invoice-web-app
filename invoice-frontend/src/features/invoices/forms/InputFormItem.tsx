import { useFieldArray, useFormContext } from "react-hook-form";
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  deleteIcon,
  ItemContainer,
  MobileHelperContainer,
  SmallBoxContainer,
  SVG,
  Total,
  TotalBox,
} from "@/styles/editFormItemStyles.tsx";
import NewItemButton from "@/features/shared/components/buttons/NewItemButton.tsx";
import useWindowWidth from "../../shared/hooks/useWindowWidth.tsx";
import { Col, Col1 } from "@/styles/EditFormItemListStyles.ts";

import { Invoice } from "@/features/invoices/types/invoiceTypes.ts";
import ItemQuantity from "./Quantity.tsx";
import ItemPrice from "./Price.tsx";
import ItemName from "./ItemName.tsx";

type InputFormItemProps = {
  invoice?: Invoice;
  isDraft: boolean;
  isEditOpen: boolean;
};

export default function InputFormItem({
  invoice,
  isEditOpen,
}: InputFormItemProps) {
  const { formState, watch, clearErrors, setError, reset } = useFormContext();

  const { fields, remove, append } = useFieldArray({
    name: "items",
    rules: { required: true, minLength: 1 },
  });

  const { isSubmitting } = formState;

  const watchItems = watch("items", []);
  const width = useWindowWidth();
  const isInitialRender = useRef(true);

  // Only show error if one of the saved/submit button is pressed
  useEffect(() => {
    if (!fields.length && !isInitialRender.current) {
      setError("myFieldArray", {
        type: "required",
        message: "At least one item is required",
      });
    } else {
      clearErrors("myFieldArray");
    }
    if (isInitialRender.current) {
      isInitialRender.current = false;
    }
  }, [fields, isSubmitting]);

  // populate the form with the items from the invoice
  useEffect(() => {
    if (invoice && isEditOpen) {
      reset({
        items: invoice.items.map((i) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          total: i.total,
        })),
      });
    } else if (!isEditOpen) {
      reset({
        items: [{ name: "", price: 0, quantity: 0, total: 0 }],
      });
    }
  }, [invoice, isEditOpen, reset]);

  const mobileRender = (index: number) => (
    <ItemContainer>
      <Box style={{ width: "100%", marginBottom: "1.5rem" }}>
        <Col1 style={{ marginBottom: "1rem" }}>Item Name</Col1>
        <ItemName index={index} invoice={invoice} />
      </Box>
      <SmallBoxContainer>
        <Box>
          <Col style={{ marginBottom: "0.625rem" }}>Qty.</Col>
          <ItemQuantity index={index} invoice={invoice} />
        </Box>
        <Box>
          <Col style={{ marginBottom: "0.625rem" }}>Price</Col>
          <ItemPrice index={index} invoice={invoice} />
        </Box>
        <TotalBox style={{ width: "fit-content" }}>
          <Col style={{ marginBottom: "0.625rem" }}>Total</Col>
          <Total>
            {(
              Number(watchItems?.[index]?.quantity) *
              Number(watchItems?.[index]?.price)
            ).toFixed(2)}
          </Total>
        </TotalBox>
      </SmallBoxContainer>
      <Box>
        <Col style={{ marginBottom: "0.625rem" }}>{"  "}</Col>
        <SVG name="removeButton" onClick={() => remove(index)}>
          {deleteIcon}
        </SVG>
      </Box>
    </ItemContainer>
  );

  const tabletAndDesktopRender = (index: number) => (
    <ItemContainer>
      <MobileHelperContainer>
        <ItemName index={index} invoice={invoice} />
        <ItemQuantity index={index} invoice={invoice} />
        <ItemPrice index={index} invoice={invoice} />
        <Total>
          {(
            Number(watchItems?.[index]?.quantity) *
            Number(watchItems?.[index]?.price)
          ).toFixed(2)}
        </Total>
        <SVG name="removeButton" onClick={() => remove(index)}>
          {deleteIcon}
        </SVG>
      </MobileHelperContainer>
    </ItemContainer>
  );

  return (
    <>
      <ul style={{ listStyle: "none", marginLeft: "0", paddingLeft: 0 }}>
        {fields.map((item, index) => (
          <li key={item.id} data-testid="invoice-item">
            <div>
              {width < 600 && mobileRender(index)}
              {width >= 600 && tabletAndDesktopRender(index)}
            </div>
          </li>
        ))}
      </ul>
      <NewItemButton append={append} items={invoice ? invoice.items : []} />
    </>
  );
}

InputFormItem.propTypes = {
  isDraft: PropTypes.bool.isRequired,
  isEditOpen: PropTypes.bool,
};
