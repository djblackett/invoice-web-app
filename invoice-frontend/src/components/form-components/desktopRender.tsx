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
