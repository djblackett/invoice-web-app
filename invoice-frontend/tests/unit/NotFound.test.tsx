import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NotFound from "@/pages/NotFound";

describe("NotFound", () => {
  it("renders 404 - Not Found message", () => {
    render(<NotFound />);
    const message = screen.getByText(/404 - Not Found!/i);
    expect(message).toBeInTheDocument();
  });
});
