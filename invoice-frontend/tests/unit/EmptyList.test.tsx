import { render, screen } from "@testing-library/react";
import EmptyList from "../../src/components/EmptyList";
import { describe, it, expect } from "vitest";

describe("EmptyList component", () => {
  it("renders without crashing", () => {
    render(<EmptyList />);
    expect(screen.getByText(/there is nothing here/i)).toBeInTheDocument();
  });

  // Not sure if this is possible due to styled-components dynamic class names
  it.skip("matches snapshot", () => {
    const { asFragment } = render(<EmptyList />);
    expect(asFragment()).toMatchSnapshot();
  });
});
