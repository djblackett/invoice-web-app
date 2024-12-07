import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTheme } from "styled-components";
import { Col, Col1 } from "../../styles/EditFormItemListStyles";
import {
  Box,
  deleteIcon,
  ItemContainer,
  ItemName,
  MobileHelperContainer,
  MobileQuantityPrice,
  Price,
  Quantity,
  QuantityPriceContainer,
  SmallBoxContainer,
  SVG,
  Total
} from "../../styles/editFormItemStyles";
import useWindowWidth from "../../hooks/useWindowWidth";
import { Item } from "../../types/types";

type EditFormItemProps = {
    item: Item;
    items: Item[];
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

function EditFormItem({ item, items, setItems }: EditFormItemProps) {

  const methods = useFormContext();
  const { submitCount } = methods.formState;
  const [name] = useState(item.name);
  const [quantity, setQuantity] = useState(String(item.quantity));
  const [price, setPrice] = useState(String(item.price.toFixed(2)));
  const [total, setTotal] = useState(String(item.total));
  const [isTotalValid, setIsTotalValid] = useState(true);
  const theme = useTheme();

  const updateItem = () => {
    const newItem = { ...item, price: Number(price), total: Number(quantity) * Number(price), quantity: Number(quantity) };
    const items2 = [...items];
    const index = items.indexOf(item);
    items2.splice(index, 1, newItem);
    setItems(items2);
  };

  useEffect(() => {
    if (!Number.isNaN(Number(quantity) * Number(price))) {
      setTotal((Number(quantity) * Number(price)).toFixed(2));
      setIsTotalValid(true);
      updateItem();
    } else {
      setTotal("Invalid input");
      setIsTotalValid(false);
    }
  }, [price, quantity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const name1 = e.target.name;
    const newItem = { ...item, [name1]: e.target.value };
    const items2 = [...items];
    const index = items.indexOf(item);
    items2.splice(index, 1, newItem);
    setItems(items2);
  };

  const removeItem = () => {
    const items2 = items.filter((currentItem) => currentItem.id !== item.id);
    setItems(items2);
  };

  const width = useWindowWidth();

  const isMobile = width < 600;

  return (
    <ItemContainer>
      <Box style={{ width: "100%", marginBottom: "1.5rem" }}>
        <Col1 style={{ marginBottom: "1rem" }}>Item Name</Col1>
        <ItemName name="name" onChange={handleChange} value={name} style={{ border: (submitCount > 0 && (name === "" || undefined)) ? "1px solid #EC5757" : `1px solid ${theme.formFieldOutline}` }} />
      </Box>
      <SmallBoxContainer>
        <Box>
          <Col style={{ marginBottom: "0.625rem" }}>Qty.</Col>
          <Quantity
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuantity((v) => (e.target.validity.valid ? e.target.value : v))}
            value={quantity}
          />
        </Box>
        <Box>
          <Col style={{ marginBottom: "0.625rem" }}>Price</Col>
          <Price name="price" onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPrice((v) => (e.target.validity.valid ? e.target.value : v))}
          value={price}
          style={{ borderColor: isTotalValid || !(submitCount > 0 && price.length === 0) ? "" : "#EC5757" }}
          />
        </Box>
        <Box>
          <Col style={{ marginBottom: "0.625rem" }}>Total</Col>
          <Total onChange={handleChange} style={{ color: isTotalValid ? "" : "#EC5757" }}>
            {total}
          </Total>
        </Box>
      </SmallBoxContainer>
      <Box>
        <Col style={{ marginBottom: "0.625rem" }}>{"  "}</Col>
        <SVG
          name="removeButton"
          onClick={removeItem}
          style={{ marginTop: "1.25rem" }}
        >
          {deleteIcon}
        </SVG>
      </Box>
      {isMobile && (
        <MobileHelperContainer>
          <MobileQuantityPrice>
            {`${item.quantity} x £ ${Number(item.price).toFixed(2)}`}
          </MobileQuantityPrice>
        </MobileHelperContainer>
      )}
      {!isMobile && (
        <MobileHelperContainer>
          <QuantityPriceContainer>
            <Quantity
              name="quantity"
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuantity((v) => (e.target.validity.valid ? e.target.value : v))}
              value={quantity}
              style={{ borderColor: (submitCount > 0 && quantity.length === 0) ? "#EC5757" : "" }}
            />
            <Price name="price"
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPrice((v) => (e.target.validity.valid ? e.target.value : v))}
              style={{ borderColor: isTotalValid && !(submitCount > 0 && price.length === 0) ? "" : "#EC5757" }}
              value={price}
            />
          </QuantityPriceContainer>
        </MobileHelperContainer>
      )}
    </ItemContainer>
  );

}

export default EditFormItem;
