import { Link, LinkProps } from "react-router-dom";
import styled from "styled-components";
import InvoiceGrid from "./invoice-components/InvoiceGrid";
import InvoiceCard from "./invoice-components/InvoiceCard";
import EmptyList from "./EmptyList";
import { Invoice } from "../types/types";
import { Grid } from "react-loader-spinner";

interface StyledLinkProps extends LinkProps {
  isMobile: boolean;
}

const StyledLink = styled(Link)<StyledLinkProps>`
  width: ${(props) => (props.isMobile ? "100%" : "50%")};
  min-width: ${(props) => (props.isMobile ? "auto" : "730px")};
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
  // scrollToTop: () => void;
}

const AllInvoicesView = ({
  invoiceList,
  width,
  loading,
  error,
}: AllInvoicesViewProps) => {
  if (loading) {
    return (
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
              to={`/${invoice.id}`}
              isMobile={width < 1200}
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

export default AllInvoicesView;
