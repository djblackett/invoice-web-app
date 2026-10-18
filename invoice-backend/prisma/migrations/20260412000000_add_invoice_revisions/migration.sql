-- CreateTable
CREATE TABLE "InvoiceRevision" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "revisionNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,
    "changeType" TEXT NOT NULL,
    "restoredFromRevisionId" TEXT,
    "message" TEXT,
    "snapshot" JSONB NOT NULL,

    CONSTRAINT "InvoiceRevision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InvoiceRevision_invoiceId_idx" ON "InvoiceRevision"("invoiceId");

-- CreateIndex
CREATE INDEX "InvoiceRevision_createdById_idx" ON "InvoiceRevision"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceRevision_invoiceId_revisionNumber_key" ON "InvoiceRevision"("invoiceId", "revisionNumber");

-- AddForeignKey
ALTER TABLE "InvoiceRevision" ADD CONSTRAINT "InvoiceRevision_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceRevision" ADD CONSTRAINT "InvoiceRevision_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
