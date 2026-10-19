import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  FetchResult,
  InMemoryCache,
  Observable,
} from "@apollo/client";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "../testUtils";
import AllInvoices from "@/features/invoices/pages/AllInvoices";
import { ALL_INVOICES } from "@/features/invoices/graphql/invoice.queries";
import { Invoice } from "@/features/invoices/types/invoiceTypes";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDemoModeContext } from "@/features/shared/components/DemoModeProvider";
import invoiceData from "../data/invoices";

// The shared fixtures omit item IDs, which the GraphQL selection requires.
const invoices = invoiceData.slice(0, 2).map((invoice) => ({
  ...invoice,
  items: invoice.items.map((item, index) => ({
    ...item,
    id: `${invoice.id}-${index}`,
  })),
}));

vi.mock("@/features/auth/hooks/useAuth");

function ModeControl() {
  const { isDemoMode, setIsDemoMode } = useDemoModeContext();
  return (
    <button onClick={() => setIsDemoMode(!isDemoMode)}>
      {isDemoMode ? "Leave demo" : "Enter demo"}
    </button>
  );
}

describe("invoice list subscriptions", () => {
  let client: ApolloClient<unknown>;

  beforeEach(() => {
    sessionStorage.clear();
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: true,
      user: { email: "testuser@example.com" },
      isLoading: false,
    });
  });

  afterEach(() => {
    cleanup();
    client.stop();
    sessionStorage.clear();
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  function renderList(isDemoMode: boolean) {
    vi.stubEnv("VITE_DEMO_MODE", String(isDemoMode));
    const unsubscribe = vi.fn();
    let emitInvoice: (invoice: Invoice) => void = () => {
      throw new Error("No active invoice subscription");
    };
    const subscribe = vi.fn(
      () =>
        new Observable<FetchResult>((observer) => {
          emitInvoice = (invoice) =>
            observer.next({ data: { invoiceAdded: invoice } });
          return unsubscribe;
        }),
    );
    const query = vi.fn(() =>
      Observable.of({ data: { allInvoices: [invoices[0]] } }),
    );
    client = new ApolloClient({
      cache: new InMemoryCache({ addTypename: false }),
      link: new ApolloLink((operation) =>
        operation.operationName === "allInvoices" ? query() : subscribe(),
      ),
    });
    render(
      <ApolloProvider client={client}>
        <ModeControl />
        <AllInvoices />
      </ApolloProvider>,
    );
    return {
      query,
      subscribe,
      unsubscribe,
      emitInvoice: (invoice: Invoice) => act(() => emitInvoice(invoice)),
    };
  }

  it("renders queried invoices in Demo Mode without starting a subscription", async () => {
    const { query, subscribe } = renderList(true);

    expect(await screen.findByText(invoices[0].id)).toBeInTheDocument();
    expect(screen.getAllByTestId("invoice-card")).toHaveLength(1);
    expect(query).toHaveBeenCalledTimes(1);
    expect(subscribe).not.toHaveBeenCalled();
  });

  it("subscribes outside Demo Mode and appends incoming invoices to the cache and list", async () => {
    const { subscribe, emitInvoice } = renderList(false);
    await screen.findByText(invoices[0].id);
    expect(subscribe).toHaveBeenCalledTimes(1);

    emitInvoice(invoices[1]);

    expect(await screen.findByText(invoices[1].id)).toBeInTheDocument();
    expect(screen.getAllByTestId("invoice-card")).toHaveLength(2);
    expect(
      client
        .readQuery<{ allInvoices: Invoice[] }>({ query: ALL_INVOICES })
        ?.allInvoices.map((invoice) => invoice.id),
    ).toEqual([invoices[0].id, invoices[1].id]);
    expect(subscribe).toHaveBeenCalledTimes(1);
  });

  it("starts on leaving Demo Mode, stops on re-entry, and resumes ordinary operation", async () => {
    const { subscribe, unsubscribe, emitInvoice } = renderList(true);
    await screen.findByText(invoices[0].id);
    expect(subscribe).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Leave demo" }));
    await waitFor(() => expect(subscribe).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByRole("button", { name: "Enter demo" }));
    await waitFor(() => expect(unsubscribe).toHaveBeenCalledTimes(1));
    emitInvoice(invoices[1]); // A late event from the stopped stream is ignored.
    expect(screen.queryByText(invoices[1].id)).not.toBeInTheDocument();
    expect(screen.getByText(invoices[0].id)).toBeInTheDocument();
    expect(subscribe).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Leave demo" }));
    await waitFor(() => expect(subscribe).toHaveBeenCalledTimes(2));
    emitInvoice(invoices[1]);
    expect(await screen.findByText(invoices[1].id)).toBeInTheDocument();
    expect(screen.getAllByTestId("invoice-card")).toHaveLength(2);
  });
});
