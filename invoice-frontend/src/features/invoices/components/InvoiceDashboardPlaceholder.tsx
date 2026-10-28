import { AllInvoicesContainer } from "../styles/AllInvoicesStyles";
import { InvoiceListToolbar } from "./AllInvoicesToolbar";
import InvoiceContentStatus from "./InvoiceContentStatus";

export default function InvoiceDashboardPlaceholder({
  error = false,
  onRetry,
  initializing = false,
  message,
  detail,
  retryLabel = "Retry Demo",
  retryDisabled,
}: {
  error?: boolean;
  onRetry?: () => void;
  initializing?: boolean;
  message?: string;
  detail?: string;
  retryLabel?: string;
  retryDisabled?: boolean;
}) {
  return (
    <AllInvoicesContainer>
      <InvoiceListToolbar
        invoiceList={[]}
        loading
        loadingLabel={error ? "Count unavailable" : undefined}
        onNewInvoice={() => {}}
      />
      <InvoiceContentStatus
        message={
          message ??
          (error
            ? "Demo could not be initialized."
            : initializing
              ? "Preparing demo invoices…"
              : "Loading invoices…")
        }
        detail={detail}
        error={error}
        onRetry={onRetry}
        retryLabel={retryLabel}
        retryDisabled={retryDisabled}
      />
    </AllInvoicesContainer>
  );
}
