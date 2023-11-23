import {FieldValues} from "react-hook-form";
import {v4 as uuidv4} from "uuid";
import {Invoice} from "../types/types";

export const generateId = () => {
  const list = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let res = "";
  for(let i = 0; i < 2; i++) {
    const rnd = Math.floor(Math.random() * list.length);
    res += list.charAt(rnd);
  }

  for(let i = 0; i < 4; i++) {
    res += String(Math.floor(Math.random() * 9));
  }
  return res;
};

export function getCurrency(money: number | bigint) {
  return new Intl.NumberFormat("en-GB", {
    currency: "GBP",
    style: "currency",
  }).format(money); // 'CA$ 100.00'
}

export function getMoney(amount:  number) {
  return amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}

export const convertedDate = (dateString: string) => {
  if (dateString) {
    const date = dateString.split("-");
    const dateObj = new Date(Date.UTC(Number(date[0]), Number(date[1]), Number(date[2])));
    return dateObj.toDateString().substring(4);
  }
};

export const convertDateToString = (date: Date) => {
  const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
  return [year, month, day].join("-");
};

export const convertStringToDate = (str: string | undefined) => {
  if (!str) {
    return new Date();
  }
  const dateArray = str.split("-");
  return new Date(Date.UTC(Number(dateArray[0]), Number(dateArray[1]), Number(dateArray[2])));
};

export const createInvoiceObject = (data: FieldValues, startDate: Date, selectedPaymentOption: number, id: string | undefined) => {
  const newInvoice: Invoice = {
    id: id || "",
    clientName: data.clientName,
    clientAddress: {
      city: data.clientCity,
      country: data.clientCountry,
      postCode: data.clientPostalCode,
      street: data.clientStreetAddress,
    },
    senderAddress: {
      city: data.city,
      country: data.country,
      postCode: data.postalCode,
      street: data.streetAddress,
    },
    clientEmail: data.clientEmail,
    createdAt: convertDateToString(startDate),
    description: data.projectDescription,
    items: [...data.items],
    paymentDue: "",
    paymentTerms: 0,
    status: "",
    total: 0,
  };

  let invoiceTotal = 0;

  const {items} = newInvoice;

  for (let i = 0; i < items.length; i++) {
    items[i].total = items[i].quantity * items[i].price;
    invoiceTotal += Number(items[i].total);
    if (!items[i].id) {
      items[i].id = uuidv4();
    }
  }

  newInvoice.total = invoiceTotal;
  // newInvoice.id = newInvoice.id ? newInvoice.id : generateId();
  newInvoice.paymentTerms = selectedPaymentOption;
  // newInvoice.status = isDraft ?  "draft" : "pending";
  newInvoice.status = data.status;
  const date = new Date(startDate.getTime() + 86400000 * newInvoice.paymentTerms);

  const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
  newInvoice.paymentDue = [year, month, day].join("-");

  // console.log("end of newVoice function", newInvoice);
  return newInvoice;
};