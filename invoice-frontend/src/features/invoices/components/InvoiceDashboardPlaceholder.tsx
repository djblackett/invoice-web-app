import { AllInvoicesContainer } from "../styles/AllInvoicesStyles";
import { InvoiceListToolbar } from "./AllInvoicesToolbar";
import InvoiceContentStatus from "./InvoiceContentStatus";

export default function InvoiceDashboardPlaceholder({
  error = false,
  onRetry,
  initializing = false,
}: {
  error?: boolean;
  onRetry?: () => void;
  initializing?: boolean;
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
          error
            ? "Demo could not be initialized."
            : initializing
              ? "Preparing demo invoices…"
              : "Loading invoices…"
        }
        error={error}
        onRetry={onRetry}
        retryLabel="Retry Demo"
      />
    </AllInvoicesContainer>
  );
}
