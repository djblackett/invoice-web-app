import { useFieldArray, useFormContext } from "react-hook-form";
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  deleteIcon,
  ItemContainer,
  ItemName,
  MobileHelperContainer,
  Price,
  Quantity,
  SmallBoxContainer,
  SVG,
  Total,
  TotalBox,
} from "../../styles/editFormItemStyles";
import NewItemButton from "../buttons/NewItemButton";
import useWindowWidth from "../../hooks/useWindowWidth";
import { Col, Col1 } from "../../styles/EditFormItemListStyles";
import { Invoice } from "../../types/types";

type InputFormItemProps = {
  invoice?: Invoice;
  isDraft: boolean;
  isEditOpen: boolean;
};

// todo - can I make this simpler?
export default function InputFormItem({
  isDraft,
  invoice,
  isEditOpen,
}: InputFormItemProps) {
  const { formState, register, watch, clearErrors, setError, reset } =
    useFormContext();

  const { fields, remove, append } = useFieldArray({
    name: "items",
    rules: { required: true, minLength: 1 },
  });

  const { errors, isSubmitting } = formState;

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
      reset({ items: [] });
    }
  }, [invoice, isEditOpen, reset]);

  const mobileRender = (index: number) => (
    <ItemContainer>
      <Box style={{ width: "100%", marginBottom: "1.5rem" }}>
        <Col1 style={{ marginBottom: "1rem" }}>Item Name</Col1>
        <ItemName
          {...register(`items[${index}].name`, { required: !isDraft })}
          placeholder="Item name"
          defaultValue={invoice ? invoice?.items?.[index]?.name : ""}
          type="text"
          style={{
            border:
              Array.isArray(errors.items) && errors?.items?.[index]?.name
                ? "1px solid #EC5757"
                : "",
          }}
        />
      </Box>
      <SmallBoxContainer>
        <Box>
          <Col style={{ marginBottom: "0.625rem" }}>Qty.</Col>
          <Quantity
            {...register(`items[${index}].quantity`, {
              required: !isDraft,
              max: 100,
            })}
            placeholder="0"
            type="text"
            style={{
              border:
                Array.isArray(errors.items) && errors?.items?.[index]?.quantity
                  ? "1px solid #EC5757"
                  : "",
            }}
            defaultValue={invoice ? invoice?.items?.[index]?.quantity : ""}
          />
        </Box>
        <Box>
          <Col style={{ marginBottom: "0.625rem" }}>Price</Col>
          <Price
            {...register(`items[${index}].price`, {
              required: !isDraft,
              max: 100000,
            })}
            placeholder="0.00"
            type="text"
            defaultValue={invoice ? invoice?.items?.[index]?.price : ""}
            style={{
              border:
                Array.isArray(errors.items) && errors?.items?.[index]?.price
                  ? "1px solid #EC5757"
                  : "",
            }}
          />
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
        <ItemName
          {...register(`items[${index}].name`, { required: !isDraft })}
          placeholder="Item name"
          defaultValue={invoice ? invoice?.items?.[index]?.name : ""}
          type="text"
          style={{
            border:
              Array.isArray(errors.items) && errors?.items?.[index]?.name
                ? "1px solid #EC5757"
                : "",
          }}
        />
        <Quantity
          {...register(`items[${index}].quantity`, {
            required: !isDraft,
            max: 100,
          })}
          placeholder="0"
          type="text"
          style={{
            border:
              Array.isArray(errors.items) && errors?.items?.[index]?.quantity
                ? "1px solid #EC5757"
                : "",
          }}
          defaultValue={invoice ? invoice?.items?.[index]?.quantity : 0}
        />
        <Price
          {...register(`items[${index}].price`, {
            required: !isDraft,
            max: 100000,
          })}
          placeholder="0.00"
          type="text"
          defaultValue={invoice ? invoice?.items?.[index]?.price : 0}
          style={{
            border:
              Array.isArray(errors.items) && errors?.items?.[index]?.price
                ? "1px solid #EC5757"
                : "",
          }}
        />

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
