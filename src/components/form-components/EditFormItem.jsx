import PropTypes from "prop-types";
import {Col, Col1} from "./EditFormItemList";
import {useWindowWidth} from "../../hooks/useWindowWidth";
import {useEffect, useState} from "react";
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
import {useTheme} from "styled-components";

function EditFormItem({ item, items, setItems }) {


  const [quantity, setQuantity] = useState(String(item.quantity));
  const [price, setPrice] = useState(String(item.price.toFixed(2)));
  const [total, setTotal] = useState(String(item.total));
  const [isTotalValid, setIsTotalValid] = useState(true);
  const theme = useTheme();

  const updateItem = () => {
    const newItem = { ...item, price: Number(price), total: (Number(quantity) * Number(price)).toFixed(2), quantity: quantity };
    const items2 = [...items];
    const index = items.indexOf(item);
    // console.log(items2);
    items2.splice(index, 1, newItem);
    setItems(items2);
  }

  useEffect(() => {
    if (!isNaN(Number(quantity) * Number(price))) {
      setTotal((Number(quantity) * Number(price)).toFixed(2));
      setIsTotalValid(true);
      updateItem();
    } else {
      setTotal("Invalid input");
      setIsTotalValid(false);

    }
  }, [price, quantity])

  const handleChange = (e) => {
    e.preventDefault();
    const name1 = e.target.name;
    const newItem = { ...item, [name1]: e.target.value };
    // newItem.total = (newItem.quantity * newItem.price).toFixed(2);
    // setItem1(newItem);

    console.log(items);

    //     // console.log(item.name);
    // const items2 = items.filter(currentItem => currentItem.id != item.id);
    const items2 = [...items];
    const index = items.indexOf(item);
    console.log(items2);
    items2.splice(index, 1, newItem);
    setItems(items2);
    console.log("new items Array: " + items2);
  };

  const handleQuantityChange = (e) => {
    e.preventDefault();
    // const quantity = e.target.value;

    if (String(quantity).match(/^\d+$/) || quantity === "") {
      console.log("match");
      setQuantity(e.target.value);
      console.log(quantity);
      // const newItem = {...item, quantity};
      // newItem.total = (newItem.quantity * newItem.price).toFixed(2);
      //
      // const items2 = [...items];
      // const index = items.indexOf(item);
      // items2.splice(index, 1, newItem);
      // setItems(items2);
    } else {
      console.log("don't match")
    }
  }

  // todo make handleChange functions for quantity and price with proper regexes

  const removeItem = () => {
    const items2 = items.filter((currentItem) => currentItem.id !== item.id);
    setItems(items2);
  };

  const width = useWindowWidth();

  const mobileRender = (
    <ItemContainer>
      <Box style={{ width: "100%", marginBottom: "1.5rem" }}>
        <Col1 style={{ marginBottom: "1rem" }}>Item Name</Col1>
        <ItemName name={"name"} onChange={handleChange} value={item.name} />
      </Box>
      <SmallBoxContainer>
        <Box>
          <Col style={{ marginBottom: "0.625rem" }}>Qty.</Col>
          <Quantity
              onChange={(e) =>
                  setQuantity((v) => (e.target.validity.valid ? e.target.value : v))}
            value={quantity}
          />
        </Box>
        <Box>
          <Col style={{ marginBottom: "0.625rem" }}>Price</Col>
          <Price name={"price"} onChange={(e) =>
            setPrice((v) => (e.target.validity.valid ? e.target.value : v))} value={price}
                 style={{borderColor: isTotalValid ? "" : "red"}}
          />
        </Box>
        <Box>
          <Col style={{ marginBottom: "0.625rem" }}>Total</Col>
          <Total name={"total"} onChange={handleChange} value={item.total}  style={{color: isTotalValid ? "" : "red"}}>
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
    </ItemContainer>
  );

  const tabletAndDesktopRender = (
    <ItemContainer>
      <MobileHelperContainer>
        <ItemName name={"name"} onChange={handleChange} value={item.name} />
        <QuantityPriceContainer>
          <Quantity
            name={"quantity"}
            type="text"
            onChange={(e) =>
                setQuantity((v) => (e.target.validity.valid ? e.target.value : v))}
            value={quantity}
          />
          <Price name={"price"}
                 type="text"
                 onChange={(e) =>
                     setPrice((v) => (e.target.validity.valid ? e.target.value : v))}

                 style={{borderColor: isTotalValid ? "" : "red"}}
                 value={price}
          />
        </QuantityPriceContainer>
        <MobileQuantityPrice>
          {item.quantity + " x £ " + Number(item.price).toFixed(2)}
        </MobileQuantityPrice>
      </MobileHelperContainer>
      <Total name={"total"} onChange={handleChange} value={total} style={{color: isTotalValid ? "" : "red"}}>
        {total}
      </Total>
      <SVG
          name="removeButton" onClick={removeItem}>
        {deleteIcon}
      </SVG>
    </ItemContainer>
  );

  if (width < 600) {
    return mobileRender;
  } else {
    return tabletAndDesktopRender;
  }
}

export default EditFormItem;

EditFormItem.propTypes = {
  item: PropTypes.object.isRequired,
  id: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  setItems: PropTypes.func.isRequired,
};
