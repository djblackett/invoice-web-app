CREATE TABLE "DemoSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credentialHash" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "revokedAt" TIMESTAMPTZ(3),
    CONSTRAINT "DemoSession_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "DemoSession_reserved_user" CHECK ("userId" LIKE 'demo-session:%'),
    CONSTRAINT "DemoSession_lifetime" CHECK ("expiresAt" = "createdAt" + INTERVAL '24 hours'),
    CONSTRAINT "DemoSession_hash" CHECK ("credentialHash" ~ '^[0-9a-f]{64}$')
);
CREATE UNIQUE INDEX "DemoSession_userId_key" ON "DemoSession"("userId");
CREATE UNIQUE INDEX "DemoSession_credentialHash_key" ON "DemoSession"("credentialHash");
CREATE INDEX "DemoSession_expiresAt_idx" ON "DemoSession"("expiresAt");
ALTER TABLE "DemoSession" ADD CONSTRAINT "DemoSession_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "DemoAllocationState" (
    "id" INTEGER NOT NULL,
    "tokens" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "DemoAllocationState_tokens" CHECK ("tokens" >= 0 AND "tokens" <= 10),
    CONSTRAINT "DemoAllocationState_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "DemoAllocationState_singleton" CHECK ("id" = 1)
);
INSERT INTO "DemoAllocationState" ("id", "updatedAt") VALUES (1, '1970-01-01');
