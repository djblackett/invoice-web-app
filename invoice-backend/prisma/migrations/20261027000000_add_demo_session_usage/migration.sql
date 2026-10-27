-- Persistent per-session usage. Numeric limits live in the application policy
-- (demoWorkspaceQuota.ts); the database enforces only structural validity.
ALTER TABLE "DemoSession"
    ADD COLUMN "mutationCount" INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN "resetCount" INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN "lastResetAt" TIMESTAMPTZ(3),
    ADD CONSTRAINT "DemoSession_usage" CHECK (
        "mutationCount" >= 0 AND "resetCount" >= 0
        AND ("resetCount" = 0) = ("lastResetAt" IS NULL)
    );
