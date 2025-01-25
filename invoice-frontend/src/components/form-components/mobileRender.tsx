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
