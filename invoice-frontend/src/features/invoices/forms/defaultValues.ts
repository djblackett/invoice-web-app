import { Invoice, Item } from "../types/invoiceTypes";

const blankDefaultValues = {
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

export const invoiceDefaultValues = (invoice: Invoice) => ({
  country: invoice.senderAddress?.country,
  streetAddress: invoice.senderAddress?.street,
  city: invoice.senderAddress?.city,
  postalCode: invoice.senderAddress?.postCode,
  clientEmail: invoice.clientEmail,
  clientName: invoice.clientName,
  clientCountry: invoice.clientAddress?.country,
  clientStreetAddress: invoice.clientAddress?.street,
  clientCity: invoice.clientAddress?.city,
  clientPostalCode: invoice.clientAddress?.postCode,
  projectDescription: invoice.description,
  paymentDue: invoice.paymentDue,
  paymentTerms: invoice.paymentTerms,
  status: invoice.status,
  total: invoice.total,

  items: invoice.items.map((i) => ({
    id: i.id,
    name: i.name,
    quantity: i.quantity,
    price: i.price,
    total: i.total,
  })),
});

export default blankDefaultValues;
