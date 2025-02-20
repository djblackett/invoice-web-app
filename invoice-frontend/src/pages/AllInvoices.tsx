import { MemoizedAllInvoicesToolbar } from "../components/menus-toolbars/AllInvoicesToolbar";
import useWindowWidth from "../hooks/useWindowWidth";
import AllInvoicesView from "../components/AllInvoicesView";
import useInvoices from "../hooks/useInvoices";
import { AllInvoicesContainer } from "../styles/AllInvoicesStyles";
import { NewInvoiceProvider } from "../components/form-components/NewInvoiceContextProvider";
import { useAuth } from "@/hooks/useAuth";
import { Suspense } from "react";
import React from "react";
import { useSubscription } from "@apollo/client";
import { ALL_INVOICES, INVOICE_ADDED } from "@/graphql/invoice.queries";
import FadeOut from "@/animation/FadeOutText";

const NewInvoice = React.lazy(() => import("./NewInvoice"));

function AllInvoices() {
  const width = useWindowWidth();
  const { invoiceList, loading, error } = useInvoices();

  useSubscription(INVOICE_ADDED, {
    onData: ({ data, client }) => {
      const addedInvoice = data.data.invoiceAdded;
      client.cache.updateQuery({ query: ALL_INVOICES }, ({ allInvoices }) => {
        return { allInvoices: allInvoices.concat(addedInvoice) };
      });
    },
  });

  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  return (
    <AllInvoicesContainer>
      {isAuthenticated && (
        <>
          <NewInvoiceProvider>
            <MemoizedAllInvoicesToolbar
              invoiceList={invoiceList}
              data-testid="invoices-toolbar"
            />
            <Suspense>
              <NewInvoice />
            </Suspense>
          </NewInvoiceProvider>
          <FadeOut className="welcome-text" username={user?.email}></FadeOut>
          <AllInvoicesView
            invoiceList={invoiceList}
            width={width}
            loading={loading}
            error={error}
          />
        </>
      )}
    </AllInvoicesContainer>
  );
}

export default AllInvoices;
