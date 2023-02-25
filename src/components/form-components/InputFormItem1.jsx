// uncontrolled alternative for current controlled form for


import { useFieldArray, useFormContext } from "react-hook-form";
import NewItemButton from "../buttons/NewItemButton";
import { v4 as uuidv4 } from "uuid";
import {
  deleteIcon,
  ItemContainer,
  ItemName,
  MobileHelperContainer, MobileQuantityPrice, Price,
  Quantity,
  QuantityPriceContainer, SVG, Total
} from "../../styles/editFormItemStyles";
import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
export const InputFormItem1 = ({ isDraft, control, invoice, isEditOpen }) => {

  const { formState, register, getValues, watch, trigger, clearErrors } = useFormContext();

  const { fields, remove, append } = useFieldArray({
    name: "items", rules: { required: !isDraft, minLength: 1 }
  });

  const { errors, submitCount } = formState;
  const watchItems = watch("items", []);
  const watcher = watch();
  // console.log(watchItems);
  // console.log("watcher",watcher);


  useEffect(() => {
    if (invoice && isEditOpen) {
      for (let i of invoice.items) {
        append({ id: i.id || uuidv4(),name: i.name, quantity: i.quantity, price: i.price, total: i.total });
      }
    }
  }, [invoice, isEditOpen]);

  console.log("errors", errors);
  console.log(errors?.fieldArray?.root);

  return (
    <>

      <ul style={{ listStyle: "none", marginLeft: "0", paddingLeft: 0 }}>
        {fields.map((item, index) => {
          return (
            <li key={item.id}>
              <div>
                <ItemContainer>
                  <MobileHelperContainer>
                    <ItemName
                      {...register(`items[${index}].name`, { required: !isDraft })}
                      placeholder="Item name"
                      defaultValue={invoice? invoice?.items?.[index]?.name : "" }
                      type="text"
                      style={{ border: errors?.items?.[index]?.name ? "1px solid #EC5757" : "" }}

                    />
                    <QuantityPriceContainer>

                      <Quantity {...register(`items[${index}].quantity`, { required: !isDraft, max: 100 } )} placeholder="0" type="text"
                        style={{ border: errors?.items?.[index]?.quantity ? "1px solid #EC5757" : "" }}
                        defaultValue={invoice? invoice?.items?.[index]?.quantity : "" }/>


                      <Price {...register(`items[${index}].price`, { required: !isDraft, max: 100000 } )} placeholder="0.00" type="text"
                        defaultValue={invoice? invoice?.items?.[index]?.price : "" }
                        style={{ border: errors?.items?.[index]?.price ? "1px solid #EC5757" : "" }} />

                    </QuantityPriceContainer>

                    {/*What is the point of this?*/}
                    <MobileQuantityPrice>
                      {/*{item?.[index]?.quantity + " x £ " + Number(item?.[index]?.price).toFixed(2)}*/}
                    </MobileQuantityPrice>
                  </MobileHelperContainer>
                  <Total name={"total"}>
                    { (Number(watchItems?.[index]?.quantity) * Number(watchItems?.[index]?.price)).toFixed(2)}
                  </Total>
                  <SVG
                    name="removeButton" onClick={() => remove(index)}>
                    {deleteIcon}
                  </SVG>
                </ItemContainer>
              </div>
            </li>
          );
        })}
      </ul>

      <NewItemButton append={append}/>
    </>
  );
};


// const tabletAndDesktopRender = (
//   <ItemContainer>
//     <MobileHelperContainer>
//       <Controller
//         name={`item[${index}].name`}
//         control={control}
//         defaultValue={item.name}
//         render={(props) => {
//           return <ItemName {...props} placeholder="firstName" />;
//         }}
//       />
//       <QuantityPriceContainer>
//         <Controller
//           name={`item[${index}].quantity`}
//           control={control}
//           defaultValue={item.quantity}
//           render={(props) => {
//             return <Quantity {...props} placeholder="0" />;
//           }}
//         />
//         <Controller
//           name={`item[${index}].price`}
//           control={control}
//           defaultValue={item.price}
//           render={(props) => {
//             return <Quantity {...props} placeholder="0.00" />;
//           }}
//         />
//       </QuantityPriceContainer>
//       <MobileQuantityPrice>
//         {item.quantity + " x £ " + Number(item.price).toFixed(2)}
//       </MobileQuantityPrice>
//     </MobileHelperContainer>
//     <Total name={"total"} onChange={handleChange} value={total} style={{ color: isTotalValid ? "" : "#EC5757" }}>
//       {total}
//     </Total>
//     <SVG
//       name="removeButton" onClick={removeItem}>
//       {deleteIcon}
//     </SVG>
//         submit count: {submitCount}
//   </ItemContainer>
// );

// export const NestedField = ({ control, index }) => {
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: `address[${index}].places`
//   });
//   return (
//     <>
//       <ul>
//         {fields.map((i, indexI) => (
//           <li key={i.id}>
//             <Controller
//               name={`address[${index}].places[${indexI}.first`}
//               control={control}
//               defaultValue={i.first}
//               render={(props) => {
//                 return (
//                   <input
//                     className="input-custom"
//                     placeholder="First-places"
//                     {...props}
//                   />
//                 );
//               }}
//             />
//
//             <Controller
//               name={`address[${index}].places[${indexI}].second`}
//               control={control}
//               defaultValue={i.second}
//               render={(props) => {
//                 return (
//                   <input
//                     placeholder="second-place"
//                     {...props}
//                     className="input-custom"
//                   />
//                 );
//               }}
//             />
//             <NewItemButton
//               type="button"
//               variant="outlined"
//               onClick={() => remove(indexI)}
//             >
//                             - place
//             </NewItemButton>
//           </li>
//         ))}
//       </ul>
//       <Button
//         color="secondary"
//         variant="contained"
//         type="button"
//         onClick={() => append({})}
//       >
//                 + Place
//       </Button>
//     </>
//   );
// };
//
