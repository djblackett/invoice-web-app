import { render, screen } from "../testUtils";
import { fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "@/app/App";

// Mock the useWindowWidth hook
vi.mock("@/hooks/useWindowWidth", () => ({
  default: () => 1024,
}));

// Mock the useGraphQLClient hook
vi.mock("@/hooks/useApolloClient", () => ({
  default: () => ({
    // Mocked Apollo Client
  }),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("App Component", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.resetAllMocks();
  });

  it("renders avatar element", () => {
    render(<App />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("renders avatar element", () => {
    render(<App />);
    expect(screen.getByTestId("avatar")).toBeInTheDocument();
  });

  it("applies light theme by default", () => {
    render(<App />);
    const container = screen.getByTestId("container");
    expect(container).toHaveStyle("background: #F2F2F2"); // replace with actual light theme background
  });

  it("toggles to dark theme", () => {
    render(<App />);
    const toggleButton = screen.getByTestId("dark-mode-button");
    fireEvent.click(toggleButton);
    expect(window.localStorage.getItem("theme")).toBe("dark");
    const container = screen.getByTestId("container");
    expect(container).toHaveStyle("background: #141625"); // replace with actual dark theme background
  });

  it("renders Header component", () => {
    render(<App />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  // Add more tests as needed
});
