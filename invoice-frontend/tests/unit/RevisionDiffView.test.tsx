import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import RevisionDiffView from "@/features/revisions/components/RevisionDiffView";
import type { InvoiceDiff } from "@/features/revisions/types";
import { lightTheme } from "@/features/shared/styles/Themes";

/**
 * The diff view is the only place the user actually reads "what changed",
 * so the rendering contract matters: added / removed / modified must be
 * visually distinct and human-readable, never raw JSON. These tests pin
 * that contract.
 */

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>);

describe("RevisionDiffView", () => {
  it("renders scalar field changes with before and after values", () => {
    const diff: InvoiceDiff = {
      fromRevisionId: "a",
      toRevisionId: "b",
      fieldChanges: [
        { field: "status", before: "pending", after: "paid" },
        { field: "total", before: "200", after: "250" },
      ],
      addressChanges: [],
      itemChanges: [],
    };

    renderWithTheme(
      <RevisionDiffView diff={diff} loading={false} isInitial={false} />,
    );

    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("pending")).toBeInTheDocument();
    expect(screen.getByText("paid")).toBeInTheDocument();
    // Total is formatted as currency, not raw number
    expect(screen.getByText(/£250/)).toBeInTheDocument();
  });

  it("labels added / removed / modified items distinctly", () => {
    const diff: InvoiceDiff = {
      fromRevisionId: "a",
      toRevisionId: "b",
      fieldChanges: [],
      addressChanges: [],
      itemChanges: [
        {
          itemKey: "i1",
          changeType: "modified",
          before: { id: "i1", name: "Banner", price: 100, quantity: 1, total: 100 },
          after: { id: "i1", name: "Banner", price: 150, quantity: 1, total: 150 },
          fieldChanges: [
            { field: "price", before: "100", after: "150" },
            { field: "total", before: "100", after: "150" },
          ],
        },
        {
          itemKey: "i2",
          changeType: "added",
          before: null,
          after: { id: "i2", name: "Logo", price: 500, quantity: 1, total: 500 },
          fieldChanges: [],
        },
        {
          itemKey: "i3",
          changeType: "removed",
          before: { id: "i3", name: "Old Item", price: 50, quantity: 1, total: 50 },
          after: null,
          fieldChanges: [],
        },
      ],
    };

    renderWithTheme(
      <RevisionDiffView diff={diff} loading={false} isInitial={false} />,
    );

    // The added-item card contains "Added: Logo — 1 × £500...". Use the
    // whole visible label rather than drilling into sub-nodes.
    expect(screen.getByText(/Added:/)).toBeInTheDocument();
    expect(screen.getByText(/Logo — 1 ×/)).toBeInTheDocument();
    expect(screen.getByText(/Removed:/)).toBeInTheDocument();
    expect(screen.getByText(/Old Item — 1 ×/)).toBeInTheDocument();
    expect(screen.getByText(/Modified:/)).toBeInTheDocument();
    // The modified item has a per-field diff
    expect(screen.getByText("Price")).toBeInTheDocument();
  });

  it("shows a friendly empty state when nothing changed", () => {
    const diff: InvoiceDiff = {
      fromRevisionId: "a",
      toRevisionId: "b",
      fieldChanges: [],
      addressChanges: [],
      itemChanges: [],
    };
    renderWithTheme(
      <RevisionDiffView diff={diff} loading={false} isInitial={false} />,
    );
    expect(
      screen.getByText(/No changes between these two revisions/i),
    ).toBeInTheDocument();
  });

  it("explains the initial-revision state so the first entry isn't confusing", () => {
    const diff: InvoiceDiff = {
      fromRevisionId: null,
      toRevisionId: "b",
      fieldChanges: [],
      addressChanges: [],
      itemChanges: [],
    };
    renderWithTheme(
      <RevisionDiffView diff={diff} loading={false} isInitial={true} />,
    );
    expect(
      screen.getByText(/initial revision/i),
    ).toBeInTheDocument();
  });
});
