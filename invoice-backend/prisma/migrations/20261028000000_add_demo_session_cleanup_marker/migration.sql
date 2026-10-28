-- When cleanup of an expired temporary workspace last failed (Slice 3C).
-- Candidate ordering only: failed sessions are retried after every session that
-- has never failed. Additive and nullable; no backfill is needed.
ALTER TABLE "DemoSession" ADD COLUMN "cleanupFailedAt" TIMESTAMPTZ(3);
