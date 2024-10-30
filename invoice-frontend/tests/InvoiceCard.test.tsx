import '@testing-library/jest-dom/extend-expect';
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import InvoiceCard, { InvoiceCardProps } from "../src/components/invoice-components/InvoiceCard";
import { Invoice } from "../src/types/types";

// Sample Invoice data
const sampleInvoice: Invoice = {
    id: "RT3080",
    createdAt: "2021-08-18",
    paymentDue: "2021-08-19",
    description: "Re-branding",
    paymentTerms: 1,
    clientName: "Jensen Huang",
    clientEmail: "jensenh@mail.com",
    status: "paid",
    senderAddress: {
        street: "19 Union Terrace",
        city: "London",
        postCode: "E1 3EZ",
        country: "United Kingdom",
    },
    clientAddress: {
        street: "106 Kendell Street",
        city: "Sharrington",
        postCode: "NR24 5WQ",
        country: "United Kingdom",
    },
    items: [
        {
            name: "Brand Guidelines",
            quantity: 1,
            price: 1800.90,
            total: 1800.90,
        },
    ],
    total: 1800.9,
};

describe("InvoiceCard component", () => {
    const setup = (props: InvoiceCardProps) => render(<InvoiceCard {...props} />);

    it("should render the invoice ID correctly", () => {
        setup({ invoice: sampleInvoice });
        const idElement = screen.getByText(/RT3080/i);
        expect(idElement).toBeInTheDocument();
    });

    it("should display the correct client name", () => {
        setup({ invoice: sampleInvoice });
        const clientNameElement = screen.getByText(sampleInvoice.clientName);
        expect(clientNameElement).toBeInTheDocument();
    });

    it("should display the converted due date", () => {
        setup({ invoice: sampleInvoice });
        const expectedDate = "Aug 19 2021"; // Expected date format from convertedDate
        const dueDateElement = screen.getByText(`${expectedDate}`);
        expect(dueDateElement).toBeInTheDocument();
    });

    it("should display the correct total amount", () => {
        setup({ invoice: sampleInvoice });
        const amountElement = screen.getByText(/1,?800.90/i);
        expect(amountElement).toBeInTheDocument();
    });

    it("should render the correct status based on invoice status", () => {
        setup({ invoice: sampleInvoice });
        const statusElement = screen.getByText(/Paid/i);
        expect(statusElement).toBeInTheDocument();
    });

    it("should render 'Pending' status if the invoice status is pending", () => {
        const pendingInvoice = { ...sampleInvoice, status: "pending" };
        setup({ invoice: pendingInvoice });
        const statusElement = screen.getByText(/Pending/i);
        expect(statusElement).toBeInTheDocument();
    });

    it("should render 'Draft' status if the invoice status is draft", () => {
        const draftInvoice = { ...sampleInvoice, status: "draft" };
        setup({ invoice: draftInvoice });
        const statusElement = screen.getByText(/Draft/i);
        expect(statusElement).toBeInTheDocument();
    });
});
