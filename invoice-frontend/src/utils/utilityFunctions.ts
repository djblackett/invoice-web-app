import { FieldValues } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Invoice } from "../types/types";
import { parse } from "date-fns";

export const generateId = () => {
  const list = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let res = "";
  for (let i = 0; i < 2; i++) {
    const rnd = Math.floor(Math.random() * list.length);
    res += list.charAt(rnd);
  }

  for (let i = 0; i < 4; i++) {
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

export function getMoney(amount: number) {
  return amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}

export const convertedDate = (paymentDue: string) => {
  const date = paymentDue.split("-");
  const dateObj = new Date(
    Date.UTC(Number(date[0]), Number(date[1]) - 1, Number(date[2])),
  );
  const utcDateArr = dateObj.toUTCString().split(" ");
  return `${utcDateArr[1]}  ${utcDateArr[2]} ${utcDateArr[3]}`;
};

export const convertDateToString = (date: Date) => {
  const [month, day, year] = [
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCFullYear(),
  ];
  return [year, month, day.toString().padStart(2, "0")].join("-");
};

export const convertStringToDate = (str: string | undefined) => {
  if (!str) {
    return new Date();
  }
  return parse(str, "yyyy-MM-dd", new Date(Date.UTC(0, 0, 0))); // Parses as UTC
};

export const createInvoiceObject = (
  data: FieldValues,
  startDate: Date | null,
  selectedPaymentOption: number,
  id?: string,
  invoice?: Invoice,
) => {
  if (startDate === null) {
    startDate = new Date();
  }
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
    createdAt: startDate
      ? convertDateToString(startDate)
      : convertDateToString(new Date()),
    description: data.projectDescription,
    items: [...data.items],
    paymentDue: "",
    paymentTerms: 0,
    status: invoice?.status || "draft",
    total: 0,
  };

  let invoiceTotal = 0;
  const { items } = newInvoice;

  for (let i = 0; i < items.length; i++) {
    items[i].quantity = Number(items[i].quantity);
    items[i].price = Number(items[i].price);
    items[i].total = items[i].quantity * items[i].price;
    invoiceTotal += Number(items[i].total);
    if (!items[i].id) {
      items[i].id = uuidv4();
    }
  }

  newInvoice.total = invoiceTotal;
  newInvoice.id = newInvoice.id ? newInvoice.id : generateId();
  newInvoice.paymentTerms = selectedPaymentOption;

  // calculate payment due date
  const date = new Date(startDate.getTime() + 86400000 * selectedPaymentOption);

  const [month, day, year] = [
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCFullYear(),
  ];
  newInvoice.paymentDue = [year, month, day.toString().padStart(2, "0")].join(
    "-",
  );
  return newInvoice;
};
