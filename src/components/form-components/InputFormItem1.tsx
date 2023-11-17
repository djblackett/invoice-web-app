// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  deleteIcon,
  ItemContainer,
  ItemName,
  MobileHelperContainer, Price,
  Quantity,
  SmallBoxContainer, SVG, Total, TotalBox
} from "../../styles/editFormItemStyles";
import NewItemButton from "../buttons/NewItemButton";
import useWindowWidth from "../../hooks/useWindowWidth";
import {Col, Col1} from "../../styles/EditFormItemListStyles";
import {Invoice} from "../../types/types";

type InputFormItemProps = {
  invoice: Invoice;
  isDraft: boolean;
  isEditOpen: boolean;
}
export default function InputFormItem1({ isDraft, invoice, isEditOpen }: InputFormItemProps) {

  const { formState, register, watch, clearErrors, setError } = useFormContext();

  const { fields, remove, append } = useFieldArray({
    name: "items", rules: { required: true, minLength: 1 }
  });

  const { errors, isSubmitting} = formState;
  const watchItems = watch("items", []);
  const watcher = watch();
  const width = useWindowWidth();
  const isInitialRender = useRef(true);
  // eslint-disable-next-line no-console
  console.log(errors);



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



  useEffect(() => {
    if (invoice && isEditOpen) {
      invoice.items.forEach(i => {
        append({id: i.id || uuidv4(), name: i.name, quantity: i.quantity, price: i.price, total: i.total});
      });
    }
    // console.log("items added to form");
  }
  , [invoice, isEditOpen]);


  // validation check for at least one item
  useEffect(() => {
    if (!watcher.items || watcher.items.length === 0) {
      setError("items", { type: "custom", message: "An item must be added" });
    }
  }, [watcher.items]);


  const mobileRender = (index: number) => (
    <ItemContainer>
      <Box style={{ width: "100%", marginBottom: "1.5rem" }}>
        <Col1 style={{ marginBottom: "1rem" }}>Item Name</Col1>
        <ItemName
          {...register(`items[${index}].name`, { required: !isDraft })}
          placeholder="Item name"
          defaultValue={invoice? invoice?.items?.[index]?.name : "" }
          type="text"
          style={{ border: errors?.items?.[index]?.name ? "1px solid #EC5757" : "" }}
        />
      </Box>
      <SmallBoxContainer>
        <Box>
          <Col style={{ marginBottom: "0.625rem" }}>Qty.</Col>
          <Quantity {...register(`items[${index}].quantity`, { required: !isDraft, max: 100 } )} placeholder="0" type="text"
            style={{ border: errors?.items?.[index]?.quantity ? "1px solid #EC5757" : "" }}
            defaultValue={invoice? invoice?.items?.[index]?.quantity : "" }/>
        </Box>
        <Box>
          <Col style={{ marginBottom: "0.625rem" }}>Price</Col>
          <Price {...register(`items[${index}].price`, { required: !isDraft, max: 100000 } )} placeholder="0.00" type="text"
            defaultValue={invoice? invoice?.items?.[index]?.price : "" }
            style={{ border: errors?.items?.[index]?.price ? "1px solid #EC5757" : "" }} />

        </Box>
        <TotalBox style={{ width: "fit-content" }}>
          <Col style={{ marginBottom: "0.625rem" }}>Total</Col>
          <Total>
            { (Number(watchItems?.[index]?.quantity) * Number(watchItems?.[index]?.price)).toFixed(2)}
          </Total>
        </TotalBox>
      </SmallBoxContainer>
      <Box>
        <Col style={{ marginBottom: "0.625rem" }}>{"  "}</Col>
        <SVG
          name="removeButton" onClick={() => remove(index)}>
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
          defaultValue={invoice? invoice?.items?.[index]?.name : "" }
          type="text"
          style={{ border: errors?.items?.[index]?.name ? "1px solid #EC5757" : "" }}
        />
        <Quantity {...register(`items[${index}].quantity`, { required: !isDraft, max: 100 } )} placeholder="0" type="text"
          style={{ border: errors?.items?.[index]?.quantity ? "1px solid #EC5757" : "" }}
          defaultValue={invoice? invoice?.items?.[index]?.quantity : "" }/>


        <Price {...register(`items[${index}].price`, { required: !isDraft, max: 100000 } )} placeholder="0.00" type="text"
          defaultValue={invoice? invoice?.items?.[index]?.price : "" }
          style={{ border: errors?.items?.[index]?.price ? "1px solid #EC5757" : "" }} />

        <Total>
          { (Number(watchItems?.[index]?.quantity) * Number(watchItems?.[index]?.price)).toFixed(2)}
        </Total>
        <SVG
          name="removeButton" onClick={() => remove(index)}>
          {deleteIcon}
        </SVG>
      </MobileHelperContainer>
    </ItemContainer>
  );

  return (
    <>
      <ul style={{ listStyle: "none", marginLeft: "0", paddingLeft: 0 }}>
        {fields.map((item, index) => (
          <li key={item.id}>
            <div>
              {width < 600 && mobileRender(index)}
              {width >= 600 && tabletAndDesktopRender(index)}
            </div>
          </li>
        ))}
      </ul>
      <NewItemButton append={append} items={invoice.items}/>
    </>
  );
}

InputFormItem1.defaultProps = {
  isEditOpen: false,
  invoice: null
};

InputFormItem1.propTypes = {
  isDraft: PropTypes.bool.isRequired,
  isEditOpen: PropTypes.bool,
  invoice: PropTypes.instanceOf(Invoice)
};

