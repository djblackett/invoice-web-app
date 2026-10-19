import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
for (const name of [".env.local", ".env"]) {
  const file = fileURLToPath(new URL(name, root));
  if (existsSync(file)) loadEnvFile(file);
}

const backendRequire = createRequire(
  new URL("invoice-backend/package.json", root),
);
const { PrismaClient } = backendRequire("@prisma/client");
const migrationsDir = new URL("invoice-backend/prisma/migrations/", root);
const migrations = readdirSync(migrationsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map(({ name }) => ({
    name,
    checksum: createHash("sha256")
      .update(readFileSync(new URL(`${name}/migration.sql`, migrationsDir)))
      .digest("hex"),
  }));

async function verify() {
  const pooled = new URL(process.env.DATABASE_URL);
  const direct = new URL(process.env.DATABASE_URL_UNPOOLED);
  assert.ok(
    pooled.hostname.endsWith(".neon.tech"),
    "Expected the existing Neon database",
  );
  assert.ok(
    pooled.hostname.includes("-pooler."),
    "DATABASE_URL must be pooled",
  );
  assert.equal(
    direct.hostname,
    pooled.hostname.replace("-pooler.", "."),
    "Both URLs must use the same Neon endpoint",
  );
  assert.equal(
    direct.pathname,
    pooled.pathname,
    "Both URLs must use the same database",
  );
  assert.equal(
    direct.username,
    pooled.username,
    "Both URLs must use the same role",
  );
  for (const url of [pooled, direct]) {
    assert.ok(
      ["require", "verify-ca", "verify-full"].includes(
        url.searchParams.get("sslmode"),
      ),
      "Neon connections must require TLS",
    );
  }

  for (const [label, connection] of [
    ["pooled", pooled],
    ["direct", direct],
  ]) {
    const db = new PrismaClient({ datasourceUrl: connection.href, log: [] });
    try {
      // Enforce read-only on the server, including when using transaction pooling.
      const result = await db.$transaction(
        async (tx) => {
          await tx.$executeRaw`SET TRANSACTION READ ONLY`;
          const [setting] =
            await tx.$queryRaw`SELECT current_setting('transaction_read_only') AS mode`;
          assert.equal(setting.mode, "on");
          const applied =
            await tx.$queryRaw`SELECT migration_name, checksum, finished_at, rolled_back_at FROM "_prisma_migrations"`;
          for (const migration of migrations) {
            assert.ok(
              applied.some(
                (row) =>
                  row.migration_name === migration.name &&
                  row.checksum === migration.checksum &&
                  row.finished_at &&
                  !row.rolled_back_at,
              ),
              `Missing or mismatched migration: ${migration.name}`,
            );
          }
          assert.ok(
            applied.every((row) => row.finished_at || row.rolled_back_at),
            "Unresolved migration failure",
          );
          const demo = await tx.user.findUnique({ where: { id: "demoId" } });
          assert.equal(
            demo?.role,
            "USER",
            "Existing demo identity must have USER role",
          );
          return {
            invoices: await tx.invoice.count({
              where: { createdById: "demoId" },
            }),
            revisions: await tx.invoiceRevision.count({
              where: { invoice: { createdById: "demoId" } },
            }),
          };
        },
        { maxWait: 15000, timeout: 15000 },
      );
      console.log(
        `PASS ${label}: read-only transaction, TLS required, ${migrations.length} matching migrations, demo USER, ${result.invoices} invoices / ${result.revisions} revisions`,
      );
    } finally {
      await db.$disconnect();
    }
  }
}

try {
  await verify();
} catch (error) {
  // Connection exceptions can contain credentials. Print only a safe code.
  console.error(
    `Neon read-only verification failed (${error.code || error.name}). Check URLs, connectivity, migration checksums and demo identity locally.`,
  );
  process.exitCode = 1;
}
