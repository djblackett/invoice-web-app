import { Item } from "../types/invoiceTypes";

const defaultValues = {
  items: [
    {
      name: "",
      price: 0,
      quantity: 0,
      total: 0,
      id: "",
    },
  ] as [Item],
  country: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  clientCountry: "",
  clientName: "",
  clientEmail: "",
  clientStreetAddress: "",
  clientCity: "",
  clientPostalCode: "",
  projectDescription: "",
};

export default defaultValues;
