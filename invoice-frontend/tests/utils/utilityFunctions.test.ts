import { describe, it, expect } from "vitest";
import {
  generateId,
  getCurrency,
  getMoney,
  convertDateToString,
  convertStringToDate,
  createInvoiceObject,
} from "../../src/utils/utilityFunctions";
import { FieldValues } from "react-hook-form";
import { parse } from "date-fns";

describe("utilityFunctions", () => {
  describe("generateId", () => {
    it("should generate an ID with 2 letters followed by 4 digits", () => {
      const id = generateId();
      expect(id).toMatch(/^[A-Z]{2}\d{4}$/);
    });
  });

  describe("getCurrency", () => {
    it("should format the number as currency", () => {
      const formatted = getCurrency(1000);
      expect(formatted).toBe("£1,000.00");
    });
  });

  describe("getMoney", () => {
    it("should format the number with commas and two decimal places", () => {
      const formatted = getMoney(1234567.89);
      expect(formatted).toBe("1,234,567.89");
    });
  });

  describe("convertDateToString", () => {
    it("should convert a Date object to a string in YYYY-MM-DD format", () => {
      const date = new Date("2023-10-05");
      const dateString = convertDateToString(date);
      expect(dateString).toBe("2023-10-05");
    });
  });

  describe("convertStringToDate", () => {
    it("should convert a string in YYYY-MM-DD format to a Date object", () => {
      const date = convertStringToDate("2023-10-05");
      const expected = parse(
        "2023-10-05",
        "yyyy-MM-dd",
        new Date(Date.UTC(0, 0, 0)),
      );
      expect(date).toStrictEqual(expected);
    });

    it("should return the current date if the string is undefined", () => {
      const date = convertStringToDate(undefined);
      expect(date).toBeInstanceOf(Date);
    });
  });

  describe("createInvoiceObject", () => {
    it("should create a new invoice object", () => {
      const data: FieldValues = {
        clientName: "John Doe",
        clientCity: "New York",
        clientCountry: "USA",
        clientPostalCode: "10001",
        clientStreetAddress: "123 Main St",
        city: "Los Angeles",
        country: "USA",
        postalCode: "90001",
        streetAddress: "456 Elm St",
        clientEmail: "john.doe@example.com",
        projectDescription: "Web development",
        items: [
          { quantity: 2, price: 100, total: 200 },
          { quantity: 1, price: 300, total: 300 },
        ],
      };
      const startDate = new Date("2023-10-05");
      const selectedPaymentOption = 30;

      const invoice = createInvoiceObject(
        data,
        startDate,
        selectedPaymentOption,
      );

      expect(invoice).toMatchObject({
        clientName: "John Doe",
        clientAddress: {
          city: "New York",
          country: "USA",
          postCode: "10001",
          street: "123 Main St",
        },
        senderAddress: {
          city: "Los Angeles",
          country: "USA",
          postCode: "90001",
          street: "456 Elm St",
        },
        clientEmail: "john.doe@example.com",
        createdAt: "2023-10-05",
        description: "Web development",
        items: [
          { quantity: 2, price: 100, total: 200 },
          { quantity: 1, price: 300, total: 300 },
        ],
        paymentDue: "2023-11-04",
        paymentTerms: 30,
        status: "draft",
        total: 500,
      });
    });
  });
});
