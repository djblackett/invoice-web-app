import { Grid } from "react-loader-spinner";
import styled from "styled-components";
import InvoiceGrid from "./InvoiceGrid";

// Match the existing invoice rows so loading does not move the list's origin.
const PlaceholderRow = styled.div`
  width: 100%;
  min-height: 136px;
  margin: 8px 0;
  padding: 24px;
  border-radius: 8px;
  background: ${({ theme }) => theme.background};
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  @media (min-width: 600px) {
    min-height: 90px;
  }

  @media (min-width: 1200px) {
    width: 50%;
    min-width: 730px;
  }
`;

const Message = styled.div`
  flex: 1;
  min-width: 0;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.text};

  small {
    display: block;
    margin-top: 4px;
    font-size: 13px;
    line-height: 16px;
    color: ${({ theme }) => theme.greyText};
  }
`;

const Bar = styled.span`
  height: 12px;
  width: 24%;
  border-radius: 4px;
  background: ${({ theme }) => theme.outline};
  opacity: 0.12;

  &:last-child {
    margin-left: auto;
    width: 16%;
  }
`;

const Retry = styled.button`
  border: 0;
  border-radius: 24px;
  padding: 14px 20px;
  background: ${({ theme }) => theme.newButton};
  color: white;
  font: inherit;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.newButtonHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;

export default function InvoiceContentStatus({
  message = "Loading invoices…",
  error = false,
  onRetry,
  retryLabel = "Retry",
  retryDisabled = false,
  detail,
}: {
  message?: string;
  error?: boolean;
  onRetry?: () => void;
  retryLabel?: string;
  retryDisabled?: boolean;
  /** Replaces the default secondary line. */
  detail?: string;
}) {
  return (
    <InvoiceGrid>
      <PlaceholderRow
        role={error ? "alert" : "status"}
        data-testid="invoice-content-status"
      >
        {!error && (
          <Grid
            width="32"
            height="32"
            color="#7c5dfa"
            ariaLabel="Loading invoices"
          />
        )}
        <Message>
          {message}
          <small>
            {detail ??
              (error
                ? "Please try again."
                : "This can take a moment while the demo wakes up.")}
          </small>
        </Message>
        {error && onRetry && (
          <Retry onClick={onRetry} disabled={retryDisabled}>
            {retryLabel}
          </Retry>
        )}
      </PlaceholderRow>
      {!error &&
        Array.from({ length: 6 }, (_, index) => (
          <PlaceholderRow aria-hidden="true" key={index}>
            <Bar />
            <Bar />
            <Bar />
          </PlaceholderRow>
        ))}
    </InvoiceGrid>
  );
}
