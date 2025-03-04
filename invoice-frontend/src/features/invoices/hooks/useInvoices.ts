import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { ALL_INVOICES } from "../graphql/invoice.queries.ts";
import { selectFilter } from "../store/filterSlice.ts";
import { useMemo } from "react";

import { StatusKey } from "@/features/invoices/types/invoiceTypes.ts";

const useInvoices = () => {
  const filter = useSelector(selectFilter);
  const { data, loading, error } = useQuery(ALL_INVOICES);

  const invoiceList = useMemo(() => {
    if (!data) return [];
    const allInvoices = data.allInvoices || [];
    return allInvoices.filter((invoice: { status: StatusKey }) => {
      const { status } = invoice;
      const { draft, pending, paid } = filter;
      if (!draft && !pending && !paid) return true;
      if (draft && pending && paid) return true;
      if (draft && status === "draft") return true;
      if (pending && status === "pending") return true;
      if (paid && status === "paid") return true;
      return false;
    });
  }, [data, filter]);

  return { invoiceList, loading, error };
};

export default useInvoices;
