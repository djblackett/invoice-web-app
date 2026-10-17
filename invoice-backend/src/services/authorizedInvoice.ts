import type { Invoice, UserIdAndRole } from "@/constants/types";
import type { IInvoiceRepo } from "@/repositories/InvoiceRepo";
import {
  NotFoundException,
  ValidationException,
} from "@/config/exception.config";

/** Shared policy for invoice operations and access to their revision history. */
export async function getAuthorizedInvoice(
  invoiceRepo: IInvoiceRepo,
  user: UserIdAndRole | null,
  invoiceId: string,
): Promise<Partial<Invoice>> {
  if (!user?.id || !user.role) {
    throw new ValidationException("Unauthorized");
  }

  const invoice = (await invoiceRepo.findByUserIdAndInvoiceId(
    user.id,
    user.role,
    invoiceId,
  )) as Partial<Invoice> | null;

  // Retain a service guard even if a repository implementation is mis-scoped.
  if (!invoice || (user.role !== "ADMIN" && invoice.createdById !== user.id)) {
    throw new NotFoundException("Invoice not found");
  }
  return invoice;
}
