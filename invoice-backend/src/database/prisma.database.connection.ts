import { inject, injectable } from "inversify";
import { PrismaClient } from "@prisma/client";
import type {
  AtomicOptions,
  DbClient,
  IDatabaseConnection,
  RepositoryDatabase,
} from "./database.connection";
import TYPES from "@/constants/identifiers";
import { Logger } from "@/config/logger.config";

@injectable()
export class DatabaseConnection
  implements IDatabaseConnection, RepositoryDatabase
{
  constructor(
    @inject(TYPES.PrismaClient) public prisma: PrismaClient,
    @inject(TYPES.Logger) public logger: Logger,
  ) {}

  public getDatabase() {
    return this.prisma;
  }

  public get client(): DbClient {
    return this.prisma;
  }

  public atomic<T>(
    work: (tx: DbClient) => Promise<T>,
    options?: AtomicOptions,
  ): Promise<T> {
    return this.prisma.$transaction(work, options);
  }

  public async initConnection(): Promise<void> {
    try {
      await this.prisma.$connect();
      this.logger.info("Connected to Prisma");
    } catch (e) {
      this.logger.error(e instanceof Error ? e.message : String(e));
      await this.prisma.$disconnect();
      process.exit(1);
    }
  }
}

/**
 * Bound to one open interactive transaction (see transactionScope.ts). The
 * transaction's owner commits or rolls back; nothing in the scope can reach
 * the root client to start an independent transaction.
 */
export class TransactionDatabaseConnection implements RepositoryDatabase {
  constructor(public readonly client: DbClient) {}

  // Joins: the owner chose the isolation level, so `options` cannot apply.
  public atomic<T>(work: (tx: DbClient) => Promise<T>): Promise<T> {
    return work(this.client);
  }

  public getDatabase(): never {
    throw new Error("Root database client is unavailable in a transaction");
  }

  public initConnection(): never {
    throw new Error("Root database client is unavailable in a transaction");
  }
}
