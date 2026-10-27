-- Lifetime count of admitted write attempts, failed ones included (Slice 3B.2).
-- Separate from "mutationCount", which counts committed changes only. The limit
-- lives in the application policy (demoWorkspaceQuota.ts).
ALTER TABLE "DemoSession"
    ADD COLUMN "attemptCount" INTEGER NOT NULL DEFAULT 0,
    ADD CONSTRAINT "DemoSession_attempts" CHECK ("attemptCount" >= 0);
