import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { unlink } from "node:fs/promises";
import path from "node:path";
import container from "../../src/config/inversify.config";
import TYPES from "../../src/constants/identifiers";

export interface TestDatabaseConfig {
  prisma: PrismaClient;
  cleanup: () => Promise<void>;
  databaseUrl: string;
}

export async function setupTestDatabase(): Promise<TestDatabaseConfig> {
  const databaseUrl = process.env.DATABASE_URL || "";

  if (
    databaseUrl.startsWith("file:") ||
    databaseUrl.startsWith("sqlite:") ||
    databaseUrl.includes(".db")
  ) {
    return setupSQLiteTestDatabase();
  } else if (databaseUrl.startsWith("postgres")) {
    return setupPostgreSQLTestDatabase();
  } else {
    throw new Error(`Unsupported database URL: ${databaseUrl}`);
  }
}

async function setupSQLiteTestDatabase(): Promise<TestDatabaseConfig> {
  const originalDatabaseUrl = process.env.DATABASE_URL || "";
  const isInMemory = originalDatabaseUrl.includes(":memory:");

  let testDatabaseUrl: string;
  let testDbPath: string | undefined;

  if (isInMemory) {
    testDatabaseUrl = "file::memory:";
  } else {
    const testDbName = `test_${randomUUID()}.db`;
    testDbPath = path.join(process.cwd(), "prisma", testDbName);
    testDatabaseUrl = `file:${testDbPath}`;
  }

  const prisma = new PrismaClient({
    datasourceUrl: testDatabaseUrl,
  });

  // Create the database schema
  if (isInMemory) {
    // Use raw SQL to create schema for in-memory
    await prisma.$connect();
    await createSchema(prisma);
  } else {
    const originalEnv = process.env.DATABASE_URL;
    process.env.DATABASE_URL = testDatabaseUrl;

    try {
      execSync("npx prisma db push", { stdio: "inherit" });
    } finally {
      process.env.DATABASE_URL = originalEnv;
    }

    await prisma.$connect();
  }

  const cleanup = async () => {
    await prisma.$disconnect();
    if (!isInMemory && testDbPath) {
      try {
        await unlink(testDbPath);
      } catch (error) {
        if ((error as any).code !== "ENOENT") {
          console.warn(
            `Failed to delete test database file: ${testDbPath}`,
            error,
          );
        }
      }
    }
  };

  return {
    prisma,
    cleanup,
    databaseUrl: testDatabaseUrl,
  };
}

async function createSchema(prisma: PrismaClient): Promise<void> {
  // Same as in SQLiteDatabaseConnection
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT,
      "username" TEXT NOT NULL UNIQUE,
      "role" TEXT NOT NULL DEFAULT 'USER'
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ClientAddress" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "street" TEXT NOT NULL,
      "city" TEXT NOT NULL,
      "postCode" TEXT NOT NULL,
      "country" TEXT NOT NULL
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "SenderAddress" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "street" TEXT NOT NULL,
      "city" TEXT NOT NULL,
      "postCode" TEXT NOT NULL,
      "country" TEXT NOT NULL
    );
  `);

  await prisma.$executeRawUnsafe(`
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

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "Invoice_createdById_idx" ON "Invoice"("createdById");
  `);

  await prisma.$executeRawUnsafe(`
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

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "Item_invoiceId_idx" ON "Item"("invoiceId");
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "InvoiceRevision" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "invoiceId" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "createdById" TEXT NOT NULL,
      "revisionNumber" INTEGER NOT NULL,
      "changeType" TEXT NOT NULL,
      "jsonDiff" TEXT,
      "fullSnapshot" TEXT NOT NULL,
      "description" TEXT,
      FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE,
      FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE,
      UNIQUE ("invoiceId", "revisionNumber")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "InvoiceRevision_invoiceId_idx" ON "InvoiceRevision"("invoiceId");
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "InvoiceRevision_createdById_idx" ON "InvoiceRevision"("createdById");
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "InvoiceRevision_createdAt_idx" ON "InvoiceRevision"("createdAt");
  `);
}

async function setupPostgreSQLTestDatabase(): Promise<TestDatabaseConfig> {
  const baseDatabaseUrl = (
    process.env.DATABASE_URL ||
    "postgresql://postgres:example@localhost:5432/db-test"
  ).replace(/\?schema=[^&]+/, "");
  const schemaName = `test_schema_${randomUUID().replace(/-/g, "").slice(0, 16)}`; // 16 hex chars
  const newDatabaseUrl = `${baseDatabaseUrl}?schema=${schemaName}`;

  const prisma = new PrismaClient({
    datasourceUrl: newDatabaseUrl,
  });

  await prisma.$executeRawUnsafe(`SET search_path TO "${schemaName}", public`);
  await prisma.$connect();

  // Create the database schema
  process.env.DATABASE_URL = newDatabaseUrl; // <-- Add this line before db push
  execSync("npx prisma db push", { stdio: "inherit" });

  const cleanup = async () => {
    try {
      await prisma.$executeRawUnsafe(
        `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`,
      );
    } catch (error) {
      console.warn(`Failed to drop schema ${schemaName}:`, error);
    }
    await prisma.$disconnect();
  };

  return {
    prisma,
    cleanup,
    databaseUrl: newDatabaseUrl,
  };
}

export function bindPrismaToContainer(prisma: PrismaClient): void {
  // Rebind the PrismaClient in the main container for tests
  if (container.isBound(TYPES.PrismaClient)) {
    container.rebind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma);
  } else {
    container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma);
  }
}
