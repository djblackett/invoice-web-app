// import {describe, expect} from "jest"
import { InvoiceService } from "../../src/services/invoice.service";
import { PrismaInvoiceRepository } from "../../src/repositories/implementations/prismaInvoiceRepository";


// Mock the PrismaInvoiceRepository module
jest.mock('../../src/repositories/implementations/prismaInvoiceRepository', () => {
  return {
    InvoiceRepository: jest.fn().mockImplementation(() => {
      return {
        findAll: jest.fn().mockResolvedValue([{ /* Mock invoice data */ }]),
      };
    }),
  };
});

describe('InvoiceService', () => {
  let invoiceService: InvoiceService;
  let invoiceRepoMock: PrismaInvoiceRepository;
  let databaseConnection = jest.fn()

  beforeEach(() => {
    // Initialize the mock PrismaInvoiceRepository
    // invoiceRepoMock = new PrismaInvoiceRepository(databaseConnection);
    // Create a new instance of InvoiceService with the mock repository
    // invoiceService = new InvoiceService(invoiceRepoMock);
  });


  it('getInvoices should return a list of invoices', async () => {
    // Call the method under test
    const invoices = await invoiceService.getInvoices();
    // Assert that the repository's findAll method was called
    expect(invoiceRepoMock.findAll).toHaveBeenCalled();
    // Assert that the method returns the expected result
    expect(invoices).toEqual([{ /* Expected invoice data */ }]);
  });

})


// describe("Moose", () => {
//   test("Example test", () => {
//     expect(3 + 4).toBe(7);
//   });
// });
