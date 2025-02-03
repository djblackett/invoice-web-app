import { describe, it, expect } from "vitest";
import data from "../../data/invoices";
import { ValidationException } from "@/config/exception.config";
import {
  validateInvoiceData,
  validateInvoiceList,
  validateUserCreate,
  validateReturnedUser,
  validateUserList,
  mapUserEntityToDTO,
  mapPartialInvoiceToInvoice,
} from "@/utils/utils";
import { Role } from "@prisma/client";

describe("utils.ts", () => {
  describe("validateInvoiceData", () => {
    it("should return parsed data for valid invoice input", () => {
      const input = data[0];
      console.log(input);
      const result = validateInvoiceData(input);
      expect(result).toMatchObject(input);
    });

    it("should throw ValidationException for invalid invoice input", () => {
      expect(() => validateInvoiceData({ invalidField: "test" })).toThrowError(
        ValidationException,
      );
    });
  });

  describe("validateInvoiceList", () => {
    it("should return parsed list for valid invoice list input", () => {
      const input = data;
      const result = validateInvoiceList(input);
      expect(result.length).toBe(7);
    });

    it("should throw ValidationException for invalid invoice list input", () => {
      expect(() => validateInvoiceList([{ invalid: "test" }])).toThrowError(
        ValidationException,
      );
    });
  });

  describe("validateUserCreate", () => {
    it("should return CreateUserDTO for valid user creation input", () => {
      const input = {
        name: "new_user",
        username: "new_user@example.com",
        password: "securePassword123",
      };
      const result = validateUserCreate(input);
      console.log(result);
      expect(result).toMatchObject(input);
    });

    it("should throw ValidationException for invalid user creation input", () => {
      expect(() => validateUserCreate({ username: "" })).toThrowError(
        ValidationException,
      );
    });
  });

  describe("validateReturnedUser", () => {
    it("should return ReturnedUser for valid user input", () => {
      const expected = {
        id: "1",
        name: "new_user",
        username: "new_user@example.com",
      };
      const input = { ...expected, passwordHash: "securePassword123" };

      const result = validateReturnedUser(input);
      expect(result).toMatchObject(expected);
    });

    it("should throw ValidationException for invalid user input", () => {
      expect(() => validateReturnedUser({ invalidField: 123 })).toThrowError(
        ValidationException,
      );
    });
  });

  describe("validateUserList", () => {
    it("should return an array of UserDTO for valid user list input", () => {
      const input = [
        {
          id: "1",
          name: "new_user",
          username: "new_user@example.com",
        },
        {
          id: "2",
          name: "new_user2",
          username: "new_use2r@example.com",
        },
      ];
      const result = validateUserList(input);
      expect(result.length).toBe(2);
    });

    it("should throw ValidationException for invalid user list input", () => {
      expect(() => validateUserList([{ invalid: 123 }])).toThrowError(
        ValidationException,
      );
    });
  });

  describe("mapUserEntityToDTO", () => {
    it("should map a UserEntity to a UserDTO correctly", () => {
      const user = {
        name: "John Doe",
        username: "johndoe",
        passwordHash: "hashedPassword123",
      };
      const result = mapUserEntityToDTO(user);
      expect(result).toEqual({
        name: "John Doe",
        username: "johndoe",
      });
    });

    describe("mapPartialInvoiceToInvoice", () => {
      it("should map a partial invoice to a complete invoice with default values", () => {
        const partialInvoice = {
          createdBy: {
            id: "1",
            username: "test@example.com",
            role: Role.USER,
            name: "",
          },
          createdById: "1",
          items: [
            {
              name: "Test Item",
              quantity: 0,
              price: 0,
              total: 0,
            },
          ],
        };

        const result = mapPartialInvoiceToInvoice(partialInvoice);

        expect(result).toMatchObject({
          id: "",
          clientEmail: "",
          clientName: "",
          description: "",
          createdBy: {
            id: "1",
            name: "",
            username: "test@example.com",
            role: "USER",
          },
          createdById: "1",
          status: "draft",
          paymentTerms: 0,
          clientAddress: {
            street: "",
            city: "",
            postCode: "",
            country: "",
          },
          senderAddress: {
            street: "",
            city: "",
            postCode: "",
            country: "",
          },
          items: [
            {
              id: "",
              name: "Test Item",
              price: 0,
              quantity: 0,
              total: 0,
            },
          ],
          total: 0,
        });
      });

      it("should throw ValidationException when createdBy data is missing", () => {
        const invalidInvoice = {
          clientName: "Test Client",
        };

        expect(() => mapPartialInvoiceToInvoice(invalidInvoice)).toThrowError(
          ValidationException,
        );
      });
    });
  });
});
