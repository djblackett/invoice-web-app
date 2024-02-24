import data from "../data/invoices";
import {Invoice} from "../types";
import {validateInvoiceData} from "../utils";
import {PrismaRepositoryImpl} from "../repositories/prismaRepositoryImpl";
import {PrismaClient} from "@prisma/client";


// Convert this to a service that sits between graphQL and Prisma

const invoices: Invoice[] = data;

const repository = new PrismaRepositoryImpl(new PrismaClient());

export const getInvoices = async (): Promise<Invoice[]> => {
  return await repository.findAll();
};

export const getInvoiceById = (id: string) => {
  const invoice = invoices.find(invoice => invoice.id === id);
  return validateInvoiceData(invoice);
};


const addInvoice = (invoice: Invoice) => {
  invoices.push(invoice);
};

export const updateInvoice = (id: string, invoiceUpdates: object) => {
  const oldInvoice = getInvoiceById(id);
  const newInvoiceUnvalidated = {...oldInvoice, ...invoiceUpdates};
  const validatedInvoice = validateInvoiceData(newInvoiceUnvalidated);
  const index = invoices.indexOf(oldInvoice);

  invoices.splice(index, 1, validatedInvoice);
  return validatedInvoice;
};

const deleteInvoice = (id: string): boolean => {
    const invoice = invoices. find(item => item.id === id);
  if (invoice) {
    const index = invoices.indexOf(invoice);
    invoices.splice(index, 1);
    return true;
  }
return false;
};



export default {
  getInvoices,
  getInvoiceById,
  addInvoice,
  updateInvoice,
  deleteInvoice
};
