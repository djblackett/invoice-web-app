import { Link, LinkProps } from "react-router-dom";
import styled from "styled-components";
import InvoiceGrid from "./InvoiceGrid.tsx";
import InvoiceCard from "./InvoiceCard.tsx";
import EmptyList from "./EmptyList.tsx";
import { memo } from "react";
import { Invoice } from "@/features/invoices/types/invoiceTypes.ts";
import InvoiceContentStatus from "./InvoiceContentStatus";

interface StyledLinkProps extends LinkProps {
  $isMobile: boolean;
}

const StyledLink = styled(Link)<StyledLinkProps>`
  width: ${(props) => (props.$isMobile ? "100%" : "50%")};
  min-width: ${(props) => (props.$isMobile ? "auto" : "730px")};
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface AllInvoicesViewProps {
  invoiceList: Invoice[];
  width: number;
  loading: boolean;
  error?: Error;
  onRetry?: () => void;
}

const AllInvoicesView = ({
  invoiceList,
  width,
  loading,
  error,
  onRetry,
}: AllInvoicesViewProps) => {
  if (loading) return <InvoiceContentStatus />;
  if (error)
    return (
      <InvoiceContentStatus
        error
        message="Invoices could not be loaded."
        onRetry={onRetry}
      />
    );

  return (
    <>
      {invoiceList.length > 0 ? (
        <InvoiceGrid>
          {invoiceList.map((invoice) => (
            <StyledLink
              key={invoice.id}
              to={`/invoices/${invoice.id}`}
              $isMobile={width < 1200}
              tabIndex={-1}
            >
              <InvoiceCard invoice={invoice} />
            </StyledLink>
          ))}
        </InvoiceGrid>
      ) : (
        <EmptyList />
      )}
    </>
  );
};

export default memo(AllInvoicesView);
