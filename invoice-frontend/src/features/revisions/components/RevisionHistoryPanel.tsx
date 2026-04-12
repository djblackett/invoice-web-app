import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import {
  INVOICE_REVISIONS,
  INVOICE_REVISION_DIFF,
  RESTORE_INVOICE_REVISION,
} from "../graphql/revision.queries";
import { GET_INVOICE_BY_ID } from "@/features/invoices/graphql/invoice.queries";
import type { InvoiceDiff, InvoiceRevision } from "../types";
import {
  Badge,
  CloseButton,
  ConfirmModal,
  DetailHeader,
  DetailPane,
  EmptyState,
  Panel,
  PanelBackdrop,
  PanelHeader,
  RestoreButton,
  Timeline,
  TimelineHeadline,
  TimelineItem,
  TimelineMeta,
} from "../styles";
import { formatTimestamp, revisionHeadline } from "../utils/formatting";
import RevisionDiffView from "./RevisionDiffView";

interface Props {
  invoiceId: string;
  open: boolean;
  onClose: () => void;
}

/**
 * Side-panel revision history viewer, invoked from the invoice detail
 * screen. Shows a reverse-chronological timeline on the left, the
 * structured diff (against the previous revision) on the right, and a
 * restore button guarded by a confirmation modal.
 *
 * This component never renders raw JSON — all change data is formatted by
 * `RevisionDiffView`.
 */
function RevisionHistoryPanel({ invoiceId, open, onClose }: Props) {
  const { data, loading, error, refetch } = useQuery<{
    invoiceRevisions: InvoiceRevision[];
  }>(INVOICE_REVISIONS, {
    variables: { invoiceId },
    skip: !open,
    fetchPolicy: "cache-and-network",
  });

  const revisions = useMemo(
    () => data?.invoiceRevisions ?? [],
    [data?.invoiceRevisions],
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Auto-select the most recent revision on first load / when the list changes.
  useEffect(() => {
    if (revisions.length > 0 && !revisions.some((r) => r.id === selectedId)) {
      setSelectedId(revisions[0]?.id ?? null);
    }
  }, [revisions, selectedId]);

  const selected = revisions.find((r) => r.id === selectedId) ?? null;

  // The "from" revision is the chronological predecessor of the selected
  // one. Revisions are returned newest-first, so predecessor = next index.
  const previousRevision = useMemo(() => {
    if (!selected) return null;
    const idx = revisions.findIndex((r) => r.id === selected.id);
    return idx >= 0 && idx < revisions.length - 1 ? revisions[idx + 1] : null;
  }, [revisions, selected]);

  const { data: diffData, loading: diffLoading } = useQuery<{
    invoiceRevisionDiff: InvoiceDiff;
  }>(INVOICE_REVISION_DIFF, {
    variables: {
      fromRevisionId: previousRevision?.id ?? null,
      toRevisionId: selected?.id ?? "",
    },
    skip: !selected,
    fetchPolicy: "cache-and-network",
  });

  const [confirming, setConfirming] = useState(false);
  const [restoreInvoiceRevision, { loading: restoring }] = useMutation(
    RESTORE_INVOICE_REVISION,
    {
      refetchQueries: [
        { query: GET_INVOICE_BY_ID, variables: { getInvoiceById: invoiceId } },
      ],
      awaitRefetchQueries: true,
      onCompleted: () => {
        toast.success("Invoice restored");
        setConfirming(false);
        refetch();
      },
      onError: (err) => {
        console.error(err);
        toast.error("Failed to restore revision");
      },
    },
  );

  if (!open) return null;

  const isSelectedHead = selected && revisions[0]?.id === selected.id;
  const isInitial = !previousRevision && !!selected;

  return (
    <PanelBackdrop
      role="dialog"
      aria-modal="true"
      aria-label="Revision history"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Panel data-testid="revision-history-panel">
        <PanelHeader>
          <h2>Revision history</h2>
          <CloseButton onClick={onClose} aria-label="Close revision history">
            Close
          </CloseButton>
        </PanelHeader>

        <Timeline aria-label="Invoice revisions">
          {loading && revisions.length === 0 && (
            <EmptyState style={{ padding: "0 20px" }}>Loading…</EmptyState>
          )}
          {error && (
            <EmptyState style={{ padding: "0 20px" }}>
              Failed to load history.
            </EmptyState>
          )}
          {!loading && !error && revisions.length === 0 && (
            <EmptyState style={{ padding: "0 20px" }}>
              No revisions yet.
            </EmptyState>
          )}
          {revisions.map((rev) => {
            const selectedNow = rev.id === selectedId;
            return (
              <TimelineItem
                key={rev.id}
                selected={selectedNow}
                tabIndex={0}
                role="button"
                aria-pressed={selectedNow}
                data-testid={`revision-item-${rev.revisionNumber}`}
                onClick={() => setSelectedId(rev.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedId(rev.id);
                  }
                }}
              >
                <TimelineHeadline>
                  <Badge kind={rev.changeType}>{rev.changeType}</Badge>
                  <span>#{rev.revisionNumber}</span>
                  <span
                    style={{
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {revisionHeadline(rev)}
                  </span>
                </TimelineHeadline>
                <TimelineMeta>
                  {formatTimestamp(rev.createdAt)}
                  {rev.createdBy &&
                    ` · ${rev.createdBy.name ?? rev.createdBy.username}`}
                </TimelineMeta>
              </TimelineItem>
            );
          })}
        </Timeline>

        <DetailPane aria-live="polite">
          {!selected ? (
            <EmptyState>Select a revision to see the changes.</EmptyState>
          ) : (
            <>
              <DetailHeader>
                <div>
                  <h3 style={{ margin: 0 }}>
                    Revision #{selected.revisionNumber}
                    {isSelectedHead && " (current)"}
                  </h3>
                  <TimelineMeta>
                    {formatTimestamp(selected.createdAt)}
                    {selected.createdBy &&
                      ` · ${selected.createdBy.name ?? selected.createdBy.username}`}
                    {selected.restoredFromRevisionId && " · restore"}
                  </TimelineMeta>
                </div>
                <RestoreButton
                  onClick={() => setConfirming(true)}
                  disabled={isSelectedHead || restoring}
                  data-testid="restore-button"
                  aria-label="Restore this revision"
                >
                  {isSelectedHead ? "Current" : "Restore this version"}
                </RestoreButton>
              </DetailHeader>

              <RevisionDiffView
                diff={diffData?.invoiceRevisionDiff ?? null}
                loading={diffLoading}
                isInitial={isInitial}
              />
            </>
          )}
        </DetailPane>
      </Panel>

      {confirming && selected && (
        <ConfirmModal role="alertdialog" aria-labelledby="confirm-restore-title">
          <div>
            <h3 id="confirm-restore-title" style={{ margin: 0 }}>
              Restore revision #{selected.revisionNumber}?
            </h3>
            <p style={{ margin: 0 }}>
              The current invoice will be overwritten to match this revision.
              History is preserved — a new entry will be added to the timeline.
            </p>
            <div className="actions">
              <CloseButton
                onClick={() => setConfirming(false)}
                disabled={restoring}
              >
                Cancel
              </CloseButton>
              <RestoreButton
                onClick={() =>
                  restoreInvoiceRevision({
                    variables: {
                      invoiceId,
                      revisionId: selected.id,
                    },
                  })
                }
                disabled={restoring}
                data-testid="confirm-restore-button"
              >
                {restoring ? "Restoring…" : "Yes, restore"}
              </RestoreButton>
            </div>
          </div>
        </ConfirmModal>
      )}
    </PanelBackdrop>
  );
}

export default RevisionHistoryPanel;
