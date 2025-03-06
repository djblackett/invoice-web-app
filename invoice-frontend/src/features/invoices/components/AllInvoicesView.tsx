import { Link, LinkProps } from "react-router-dom";
import styled from "styled-components";
import InvoiceGrid from "./InvoiceGrid.tsx";
import InvoiceCard from "./InvoiceCard.tsx";
import EmptyList from "./EmptyList.tsx";
import { Grid } from "react-loader-spinner";
import { memo } from "react";
import { Invoice } from "@/features/invoices/types/invoiceTypes.ts";

interface StyledLinkProps extends LinkProps {
  $isMobile: boolean;
}

const WakeUp = styled.h1`
  text-align: center;
`;

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
}

const AllInvoicesView = ({
  invoiceList,
  width,
  loading,
  error,
}: AllInvoicesViewProps) => {
  if (loading) {
    return (
      <>
        <Grid
          visible={true}
          height="80"
          width="80"
          color="#7c5dfa"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={{ margin: "50px" }}
          wrapperClass="grid-wrapper"
        />
        {process.env.NODE_ENV === "production" && (
          <WakeUp>Waking up the backend containers</WakeUp>
        )}
      </>
    );
  }
  if (error)
    return (
      <>
        <h1>{error.message}</h1>
        <p style={{ maxWidth: "50%", alignSelf: "center" }}>
          {JSON.stringify(error)}
        </p>
      </>
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
