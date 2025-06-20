import { inject, injectable } from "inversify";
import { PrismaClient } from "@prisma/client";
import { IDatabaseConnection } from "./database.connection";
import TYPES from "@/constants/identifiers";
import { Logger } from "@/config/logger.config";
import { USE_IN_MEMORY } from "@/config/server.config";

@injectable()
export class SQLiteDatabaseConnection implements IDatabaseConnection {
  constructor(
    @inject(TYPES.PrismaClient) public prisma: PrismaClient,
    @inject(TYPES.Logger) public logger: Logger,
  ) {}

  public getDatabase() {
    return this.prisma;
  }

  public async initConnection(): Promise<void> {
    try {
      await this.prisma.$connect();

      if (USE_IN_MEMORY) {
        this.logger.info("Connected to SQLite in-memory database");
        // For in-memory database, we need to create the schema
        await this.createSchema();
      } else {
        this.logger.info("Connected to SQLite file database");
      }
    } catch (e) {
      this.logger.error(e instanceof Error ? e.message : String(e));
      await this.prisma.$disconnect();
      process.exit(1);
    }
  }

  private async createSchema(): Promise<void> {
    try {
      // Create tables for in-memory database
      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "User" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT,
          "username" TEXT NOT NULL UNIQUE,
          "role" TEXT NOT NULL DEFAULT 'USER'
        );
      `);

      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "ClientAddress" (
          "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          "street" TEXT NOT NULL,
          "city" TEXT NOT NULL,
          "postCode" TEXT NOT NULL,
          "country" TEXT NOT NULL
        );
      `);

      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "SenderAddress" (
          "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          "street" TEXT NOT NULL,
          "city" TEXT NOT NULL,
          "postCode" TEXT NOT NULL,
          "country" TEXT NOT NULL
        );
      `);

      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Invoice" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "createdById" TEXT NOT NULL,
          "createdAt" TEXT NOT NULL,
          "paymentDue" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "paymentTerms" INTEGER NOT NULL,
          "clientName" TEXT NOT NULL,
          "clientEmail" TEXT NOT NULL,
          "status" TEXT NOT NULL,
          "total" DECIMAL NOT NULL,
          "senderAddressId" INTEGER UNIQUE,
          "clientAddressId" INTEGER UNIQUE,
          FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE,
          FOREIGN KEY ("senderAddressId") REFERENCES "SenderAddress"("id") ON DELETE CASCADE,
          FOREIGN KEY ("clientAddressId") REFERENCES "ClientAddress"("id") ON DELETE CASCADE
        );
      `);

      await this.prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "Invoice_createdById_idx" ON "Invoice"("createdById");
      `);

      await this.prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Item" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "quantity" INTEGER NOT NULL,
          "price" DECIMAL NOT NULL,
          "total" DECIMAL NOT NULL,
          "invoiceId" TEXT NOT NULL,
          FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE
        );
      `);

      await this.prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "Item_invoiceId_idx" ON "Item"("invoiceId");
      `);

      this.logger.info("In-memory database schema created successfully");
    } catch (error) {
      this.logger.error(
        `Failed to create in-memory database schema: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }
}
