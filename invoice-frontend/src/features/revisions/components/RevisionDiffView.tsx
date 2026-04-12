import type { InvoiceDiff } from "../types";
import {
  Arrow,
  ChangeGroup,
  ChangeRow,
  EmptyState,
  FieldLabel,
  ItemCard,
  ValueChip,
} from "../styles";
import { fieldLabel, formatValue } from "../utils/formatting";

interface Props {
  diff: InvoiceDiff | null;
  loading: boolean;
  /** True when the selected revision is the very first (no prior state). */
  isInitial: boolean;
}

/**
 * Renders a structured InvoiceDiff as a human-readable change summary.
 * Never falls back to raw JSON — every change is labelled and formatted.
 */
function RevisionDiffView({ diff, loading, isInitial }: Props) {
  if (loading) return <EmptyState>Loading changes…</EmptyState>;
  if (!diff) return <EmptyState>No diff available.</EmptyState>;

  const { fieldChanges, addressChanges, itemChanges } = diff;
  const nothingChanged =
    fieldChanges.length === 0 &&
    addressChanges.length === 0 &&
    itemChanges.length === 0;

  if (nothingChanged) {
    return (
      <EmptyState>
        {isInitial
          ? "This is the initial revision — no prior state to compare against."
          : "No changes between these two revisions."}
      </EmptyState>
    );
  }

  return (
    <>
      {fieldChanges.length > 0 && (
        <ChangeGroup aria-label="Field changes">
          <h3>Fields</h3>
          {fieldChanges.map((change) => (
            <ChangeRow key={change.field}>
              <FieldLabel>{fieldLabel(change.field)}</FieldLabel>
              {isInitial ? (
                <>
                  <span />
                  <span />
                  <ValueChip tone="after">
                    {formatValue(change.field, change.after)}
                  </ValueChip>
                </>
              ) : (
                <>
                  <ValueChip tone="before">
                    {formatValue(change.field, change.before)}
                  </ValueChip>
                  <Arrow aria-hidden>→</Arrow>
                  <ValueChip tone="after">
                    {formatValue(change.field, change.after)}
                  </ValueChip>
                </>
              )}
            </ChangeRow>
          ))}
        </ChangeGroup>
      )}

      {addressChanges.map((addr) => (
        <ChangeGroup
          key={addr.field}
          aria-label={`${fieldLabel(addr.field)} changes`}
        >
          <h3>{fieldLabel(addr.field)}</h3>
          {addr.changes.map((c) => (
            <ChangeRow key={c.key}>
              <FieldLabel>{fieldLabel(c.key)}</FieldLabel>
              {isInitial ? (
                <>
                  <span />
                  <span />
                  <ValueChip tone="after">
                    {c.after === "" ? "—" : c.after}
                  </ValueChip>
                </>
              ) : (
                <>
                  <ValueChip tone="before">
                    {c.before === "" ? "—" : c.before}
                  </ValueChip>
                  <Arrow aria-hidden>→</Arrow>
                  <ValueChip tone="after">
                    {c.after === "" ? "—" : c.after}
                  </ValueChip>
                </>
              )}
            </ChangeRow>
          ))}
        </ChangeGroup>
      ))}

      {itemChanges.length > 0 && (
        <ChangeGroup aria-label="Line item changes">
          <h3>Line items</h3>
          {itemChanges.map((item) => {
            const displayName =
              item.after?.name ?? item.before?.name ?? item.itemKey;
            if (item.changeType === "added") {
              return (
                <ItemCard key={item.itemKey} tone="added">
                  <strong>Added:</strong> {displayName}
                  {item.after && (
                    <>
                      {" "}
                      — {item.after.quantity} ×{" "}
                      {formatValue("price", item.after.price)} ={" "}
                      {formatValue("total", item.after.total)}
                    </>
                  )}
                </ItemCard>
              );
            }
            if (item.changeType === "removed") {
              return (
                <ItemCard key={item.itemKey} tone="removed">
                  <strong>Removed:</strong> {displayName}
                  {item.before && (
                    <>
                      {" "}
                      — {item.before.quantity} ×{" "}
                      {formatValue("price", item.before.price)} ={" "}
                      {formatValue("total", item.before.total)}
                    </>
                  )}
                </ItemCard>
              );
            }
            return (
              <ItemCard key={item.itemKey} tone="modified">
                <strong>Modified:</strong> {displayName}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    marginTop: 6,
                  }}
                >
                  {item.fieldChanges.map((fc) => (
                    <ChangeRow key={fc.field}>
                      <FieldLabel>{fieldLabel(fc.field)}</FieldLabel>
                      <ValueChip tone="before">
                        {formatValue(fc.field, fc.before)}
                      </ValueChip>
                      <Arrow aria-hidden>→</Arrow>
                      <ValueChip tone="after">
                        {formatValue(fc.field, fc.after)}
                      </ValueChip>
                    </ChangeRow>
                  ))}
                </div>
              </ItemCard>
            );
          })}
        </ChangeGroup>
      )}
    </>
  );
}

export default RevisionDiffView;
