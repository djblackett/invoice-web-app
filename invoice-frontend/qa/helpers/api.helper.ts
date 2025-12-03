import { request, APIRequestContext } from "@playwright/test";

export interface ApiInvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

export interface ApiInvoice {
  senderAddress: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  };
  clientName: string;
  clientEmail: string;
  clientAddress: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  };
  description: string;
  paymentTerms: number;
  items: ApiInvoiceItem[];
  createdAt?: string;
}

/**
 * API Helper class for invoice operations
 */
export class ApiHelper {
  private apiContext: APIRequestContext | null = null;
  private backendUrl: string;

  constructor() {
    this.backendUrl =
      process.env.VITE_BACKEND_URL || "https://localhost:4000/graphql";
  }

  /**
   * Initialize the API context
   */
  async init(): Promise<void> {
    this.apiContext = await request.newContext({
      ignoreHTTPSErrors: true,
      extraHTTPHeaders: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Cleanup the API context
   */
  async dispose(): Promise<void> {
    if (this.apiContext) {
      await this.apiContext.dispose();
    }
  }

  /**
   * Clear all invoices from the database
   */
  async clearDatabase(): Promise<void> {
    if (!this.apiContext) {
      throw new Error("API context not initialized. Call init() first.");
    }

    const endpoint =
      this.backendUrl.replace("/graphql", "") + "/test-setup";
    const response = await this.apiContext.get(endpoint);

    if (!response.ok()) {
      throw new Error(`Failed to clear database: ${await response.text()}`);
    }
  }

  /**
   * Create an invoice via GraphQL API
   */
  async createInvoice(invoice: ApiInvoice): Promise<any> {
    if (!this.apiContext) {
      throw new Error("API context not initialized. Call init() first.");
    }

    const mutation = `
      mutation CreateInvoice($input: InvoiceInput!) {
        createInvoice(input: $input) {
          id
          clientName
          clientEmail
          description
          status
          total
        }
      }
    `;

    const variables = {
      input: {
        senderAddress: invoice.senderAddress,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        clientAddress: invoice.clientAddress,
        description: invoice.description,
        paymentTerms: invoice.paymentTerms,
        items: invoice.items,
        createdAt: invoice.createdAt || new Date().toISOString(),
      },
    };

    const response = await this.apiContext.post(this.backendUrl, {
      data: {
        query: mutation,
        variables,
      },
    });

    if (!response.ok()) {
      throw new Error(`Failed to create invoice: ${await response.text()}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(
        `GraphQL errors: ${JSON.stringify(result.errors, null, 2)}`,
      );
    }

    return result.data.createInvoice;
  }

  /**
   * Get all invoices
   */
  async getInvoices(): Promise<any[]> {
    if (!this.apiContext) {
      throw new Error("API context not initialized. Call init() first.");
    }

    const query = `
      query GetInvoices {
        invoices {
          id
          clientName
          clientEmail
          status
          total
        }
      }
    `;

    const response = await this.apiContext.post(this.backendUrl, {
      data: { query },
    });

    if (!response.ok()) {
      throw new Error(`Failed to get invoices: ${await response.text()}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(
        `GraphQL errors: ${JSON.stringify(result.errors, null, 2)}`,
      );
    }

    return result.data.invoices;
  }

  /**
   * Delete an invoice by ID
   */
  async deleteInvoice(id: string): Promise<boolean> {
    if (!this.apiContext) {
      throw new Error("API context not initialized. Call init() first.");
    }

    const mutation = `
      mutation DeleteInvoice($id: ID!) {
        deleteInvoice(id: $id)
      }
    `;

    const response = await this.apiContext.post(this.backendUrl, {
      data: {
        query: mutation,
        variables: { id },
      },
    });

    if (!response.ok()) {
      throw new Error(`Failed to delete invoice: ${await response.text()}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(
        `GraphQL errors: ${JSON.stringify(result.errors, null, 2)}`,
      );
    }

    return result.data.deleteInvoice;
  }

  /**
   * Update invoice status
   */
  async updateInvoiceStatus(
    id: string,
    status: "pending" | "paid" | "draft",
  ): Promise<any> {
    if (!this.apiContext) {
      throw new Error("API context not initialized. Call init() first.");
    }

    const mutation = `
      mutation UpdateInvoiceStatus($id: ID!, $status: String!) {
        updateInvoiceStatus(id: $id, status: $status) {
          id
          status
        }
      }
    `;

    const response = await this.apiContext.post(this.backendUrl, {
      data: {
        query: mutation,
        variables: { id, status },
      },
    });

    if (!response.ok()) {
      throw new Error(
        `Failed to update invoice status: ${await response.text()}`,
      );
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(
        `GraphQL errors: ${JSON.stringify(result.errors, null, 2)}`,
      );
    }

    return result.data.updateInvoiceStatus;
  }
}

/**
 * Convert InvoiceData from factory to ApiInvoice format
 */
export function convertToApiInvoice(invoiceData: any): ApiInvoice {
  // Map payment terms to days
  const paymentTermsMap: Record<string, number> = {
    "Net 1 Day": 1,
    "Net 7 Days": 7,
    "Net 14 Days": 14,
    "Net 30 Days": 30,
  };

  return {
    senderAddress: {
      street: invoiceData.streetAddress,
      city: invoiceData.city,
      postCode: invoiceData.postalCode,
      country: invoiceData.country,
    },
    clientName: invoiceData.clientName,
    clientEmail: invoiceData.clientEmail,
    clientAddress: {
      street: invoiceData.clientStreetAddress,
      city: invoiceData.clientCity,
      postCode: invoiceData.clientPostalCode,
      country: invoiceData.clientCountry,
    },
    description: invoiceData.projectDescription,
    paymentTerms: paymentTermsMap[invoiceData.paymentTerms] || 14,
    items: invoiceData.items.map((item: any) => ({
      name: item.description,
      quantity: item.quantity,
      price: item.price,
    })),
  };
}
