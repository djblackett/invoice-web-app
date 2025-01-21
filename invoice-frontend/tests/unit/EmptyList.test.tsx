import { render, screen } from "@testing-library/react";
import EmptyList from "../../src/components/EmptyList";
import { describe, it, expect } from "vitest";

describe("EmptyList component", () => {
  it("renders without crashing", () => {
    render(<EmptyList />);
    expect(screen.getByText(/there is nothing here/i)).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<EmptyList />);
    expect(asFragment()).toMatchSnapshot();
  });
});
