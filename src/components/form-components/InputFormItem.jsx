// uncontrolled alternative for current controlled form for


import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useState } from "react";
import NewItemButton from "../buttons/NewItemButton";

import {
    deleteIcon,
    ItemContainer,
    ItemName,
    MobileHelperContainer, MobileQuantityPrice,
    Quantity,
    QuantityPriceContainer, SVG, Total
} from "../../styles/editFormItemStyles";

// eslint-disable-next-line react/prop-types
export function InputFormItem({ errorStyle, register }) {


    const [total, setTotal] = useState("");
    const handleChange = () => {

    };


    const { control, formState } = useFormContext();

    const { fields, remove, append } = useFieldArray({
        name: "items" ,
        rules: { required: true }
    });

    const { errors } = formState;



    // const handleAppend = (e) => {
    //   e.preventDefault();
    //   append({});
    // };
    console.log(errors);
    return (
        <>

            <ul style={{ listStyle: "none", marginLeft: "0", paddingLeft: 0 }}>
                {fields.map((item, index) => (
                    <li key={item.id}>
                        <div>
                            <ItemContainer>
                                <MobileHelperContainer>
                                    <Controller
                                        name={`items[${index}].name`}
                                        control={control}
                                        index={index}

                                        // defaultValue={item.name}
                                        style={{ border: errors.items?.[index].name ? "1px solid red" : "" }}
                                        render={(props) => <ItemName {...props } placeholder="Item name"
                                        />}
                                    />
                                    <QuantityPriceContainer>
                                        <Controller
                                            name={`items[${index}].quantity`}
                                            control={control}
                                            // defaultValue={item.quantity}
                                            render={(props) => <Quantity {...props} placeholder="0" />}
                                        />
                                        <Controller
                                            name={`items[${index}].price`}
                                            control={control}
                                            // defaultValue={item.price}
                                            render={(props) => <Quantity {...props} placeholder="0.00" />}
                                        />
                                    </QuantityPriceContainer>
                                    <MobileQuantityPrice>
                                        {`${item.quantity  } x £ ${  Number(item.price).toFixed(2)}`}
                                    </MobileQuantityPrice>
                                </MobileHelperContainer>
                                <Total name="total" onChange={handleChange} value={total}>
                                    {total}
                                </Total>
                                <SVG
                                    name="removeButton" onClick={() => remove(index)}>
                                    {deleteIcon}
                                </SVG>
                            </ItemContainer>
                            {/* <Button */}
                            {/*  color="primary" */}
                            {/*  variant="outlined" */}
                            {/*  type="button" */}
                            {/*  onClick={() => remove(index)} */}
                            {/* > */}
                            {/*                      - Address */}
                            {/* </Button> */}
                        </div>

                        <div>
                            {/* <NestedField control={control} index={index} /> */}
                        </div>
                    </li>
                ))}
            </ul>
            {/* <button */}
            {/*    type="button" */}
            {/*  style={{ margin: "10px" }} */}
            {/*  onClick={() => append({})} */}
            {/* > */}
            {/*              + Address */}
            {/* </button> */}
            <NewItemButton append={append}/>
            {/* <Button type="submit"> */}
            {/*            Submit */}
            {/* </Button> */}
        </>
    );
}


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
