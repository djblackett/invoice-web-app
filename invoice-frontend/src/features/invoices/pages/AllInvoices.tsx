import { Invoice } from "../types/invoiceTypes";
import { MemoizedAllInvoicesToolbar } from "../components/AllInvoicesToolbar.tsx";
import useWindowWidth from "../../shared/hooks/useWindowWidth.tsx";
import AllInvoicesView from "../components/AllInvoicesView.tsx";
import useInvoices from "../hooks/useInvoices.ts";
import { AllInvoicesContainer } from "../styles/AllInvoicesStyles.tsx";
import { NewInvoiceProvider } from "../forms/NewInvoiceContextProvider.tsx";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { Suspense } from "react";
import React from "react";
import { useSubscription } from "@apollo/client";
import {
  ALL_INVOICES,
  INVOICE_ADDED,
} from "@/features/invoices/graphql/invoice.queries.ts";
import FadeOut from "@/features/shared/animations/FadeOutText.tsx";
import { useDemoModeContext } from "@/features/shared/components/DemoModeProvider";

const NewInvoice = React.lazy(() => import("./NewInvoice.tsx"));

function AllInvoices() {
  const width = useWindowWidth();
  const { invoiceList, loading, error } = useInvoices();
  const { isDemoMode } = useDemoModeContext();

  useSubscription<{ invoiceAdded: Invoice }>(INVOICE_ADDED, {
    skip: isDemoMode,
    onData: ({ data, client }) => {
      const addedInvoice = (data.data as { invoiceAdded: Invoice })
        .invoiceAdded;
      client.cache.updateQuery<{ allInvoices: Invoice[] }>(
        { query: ALL_INVOICES },
        (cached) => {
          const { allInvoices } = cached as { allInvoices: Invoice[] };
          return { allInvoices: allInvoices.concat(addedInvoice) };
        },
      );
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
