import type { interfaces } from "inversify";
import type { PrismaClient } from "@prisma/client";
import TYPES from "@/constants/identifiers";
import type { UserIdAndRole } from "@/constants/types";
import type { IInvoiceRepo } from "@/repositories/InvoiceRepo";
import type { IInvoiceRevisionRepo } from "@/repositories/InvoiceRevisionRepo";
import type { IUserRepo } from "@/repositories/userRepo";
import { PrismaInvoiceRepository } from "@/repositories/implementations/prismaInvoiceRepository";
import { PrismaInvoiceRevisionRepository } from "@/repositories/implementations/prismaInvoiceRevisionRepository";
import { PrismaUserRepository } from "@/repositories/implementations/prismaUserRepo";
import { InvoiceService } from "@/services/invoice.service";
import { InvoiceRevisionService } from "@/services/invoiceRevision.service";
import { UserService } from "@/services/user.service";
import type { DbClient, RepositoryDatabase } from "./database.connection";
import {
  DatabaseConnection,
  TransactionDatabaseConnection,
} from "./prisma.database.connection";

/**
 * A unit of work: the ordinary repositories and invoice services, resolved
 * against ONE open interactive transaction and ONE identity. Every repository
 * statement uses `tx`; repository `atomic` sections join it instead of
 * committing separately. The root Prisma client is not resolvable here, so
 * code in the scope cannot mix clients. The caller owns the transaction, and
 * must not use the scope after it settles (Prisma then rejects every query).
 *
 * `TYPES.TransactionScope` marks the stricter coordinated-write semantics:
 * revision failures propagate, and invoice/item IDs are server-generated.
 * A temporary session's guarded services stay closed here unless the
 * coordinator also binds `TYPES.DemoWriteCapability`, issued for this
 * scope's `DatabaseConnection` (see demoSessionWrite.ts).
 */
export function createTransactionScope(
  parent: interfaces.Container,
  tx: DbClient,
  user: UserIdAndRole,
): interfaces.Container {
  const scope = parent.createChild();
  scope
    .bind<RepositoryDatabase>(DatabaseConnection)
    .toConstantValue(new TransactionDatabaseConnection(tx));
  scope.bind<PrismaClient>(TYPES.PrismaClient).toDynamicValue(() => {
    throw new Error("Root database client is unavailable in a transaction");
  });
  scope.bind<UserIdAndRole>(TYPES.UserContext).toConstantValue(user);
  scope.bind<boolean>(TYPES.TransactionScope).toConstantValue(true);
  // Rebind locally so no dependency is resolved from (or cached by) the parent.
  // That includes UserService: a request container rebinds it to a closure
  // over its own (root-client) repository, which would escape the transaction.
  scope.bind<IInvoiceRepo>(TYPES.IInvoiceRepo).to(PrismaInvoiceRepository);
  scope
    .bind<IInvoiceRevisionRepo>(TYPES.IInvoiceRevisionRepo)
    .to(PrismaInvoiceRevisionRepository);
  scope.bind<IUserRepo>(TYPES.IUserRepo).to(PrismaUserRepository);
  scope.bind<InvoiceService>(TYPES.InvoiceService).to(InvoiceService);
  scope
    .bind<InvoiceRevisionService>(TYPES.InvoiceRevisionService)
    .to(InvoiceRevisionService);
  scope.bind<UserService>(TYPES.UserService).to(UserService);
  return scope;
}
