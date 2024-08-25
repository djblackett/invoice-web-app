import * as Yup from "yup";

// eslint-disable-next-line import/prefer-default-export
export const validationSchema = Yup.object().shape({
  clientName: Yup.string()
    .required("Name is required"),
  clientEmail: Yup.string()
    .email("Email is Invalid")
    .required("Email is required"),
  clientStreetAddress: Yup.string()
    .required("Street address is required"),
  clientCity: Yup.string()
    .required("City is required"),
  clientPostalCode: Yup.string()
    .required("Postal code is required"),
  clientCountry: Yup.string()
    .required("Country is required"),
  projectDescription: Yup.string()
    .required("Project description is required"),
  items: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .required("Name is required"),
      quantity: Yup.number().positive().integer()
        .required("Quantity is required"),
      price: Yup.number().positive().max(10000)
        .required("Price is required")
    })
  )
});