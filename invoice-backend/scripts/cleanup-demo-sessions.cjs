// Explicit operator cleanup of EXPIRED temporary demo workspaces (Slice 3C).
// Nothing schedules or calls this automatically: allocation reclaims a small
// batch itself, and this drains a larger backlog on demand, e.g. after
// switching temporary sessions off. Run against the built application:
//   npm run build && DATABASE_URL=... node scripts/cleanup-demo-sessions.cjs [--max-passes N]
// Only sessions already expired on the database clock are touched; live and
// revoked-but-unexpired sessions, ordinary users and the shared demo are not.
// Output is counts only.
require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const {
  cleanupExpiredDemoSessionsReport,
  DEMO_OPERATOR_CLEANUP_BATCH,
} = require("../dist/src/services/demoSession.service.js");

const MAX_PASSES_LIMIT = 50;

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL first.");
  const flag = process.argv.indexOf("--max-passes");
  const requested = flag === -1 ? 10 : Number(process.argv[flag + 1]);
  if (!Number.isInteger(requested) || requested < 1)
    throw new Error("--max-passes must be a positive integer.");
  const passes = Math.min(requested, MAX_PASSES_LIMIT);
  const prisma = new PrismaClient();
  let reclaimed = 0;
  let failed = 0;
  try {
    for (let pass = 1; pass <= passes; pass++) {
      const result = await cleanupExpiredDemoSessionsReport(
        prisma,
        DEMO_OPERATOR_CLEANUP_BATCH,
      );
      reclaimed += result.reclaimed;
      failed = result.failed; // the latest pass: failures are retried each pass
      console.log(
        `pass ${pass}: reclaimed ${result.reclaimed}, failed ${result.failed}`,
      );
      // Stop when a pass made no progress (nothing expired, or all remaining
      // candidates are locked by in-flight writes or failing).
      if (result.reclaimed === 0) break;
    }
  } finally {
    await prisma.$disconnect();
  }
  console.log(`done: reclaimed ${reclaimed}, last-pass failures ${failed}`);
  if (failed > 0) process.exitCode = 2;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Cleanup failed.");
  process.exit(1);
});
