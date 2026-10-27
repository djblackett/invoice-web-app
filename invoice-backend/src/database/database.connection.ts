import type { Prisma, PrismaClient } from "@prisma/client";

export interface IDatabaseConnection {
  initConnection: () => Promise<void>;
  getDatabase: () => PrismaClient<{
    errorFormat: "pretty";
  }>;
}

/** Root client or an interactive-transaction client; both expose the models. */
export type DbClient = Prisma.TransactionClient;

/**
 * What repositories may use. `atomic` starts a transaction at the root, but
 * JOINS the enclosing one inside a transaction scope, so a repository's
 * multi-statement unit can never commit independently of its caller.
 */
export interface RepositoryDatabase {
  readonly client: DbClient;
  atomic<T>(work: (tx: DbClient) => Promise<T>): Promise<T>;
}
