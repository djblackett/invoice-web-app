import { render, screen } from "@testing-library/react";
import EmptyList from "@/features/invoices/components/EmptyList.tsx";
import { describe, it, expect } from "vitest";

describe("EmptyList component", () => {
  it("renders without crashing", () => {
    render(<EmptyList />);
    expect(screen.getByText(/there is nothing here/i)).toBeInTheDocument();
  });
});
