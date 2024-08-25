/*
  Warnings:

  - A unique constraint covering the columns `[senderAddressId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientAddressId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_clientAddressId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_senderAddressId_fkey";

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "clientAddressId" DROP NOT NULL,
ALTER COLUMN "clientAddressId" DROP DEFAULT,
ALTER COLUMN "senderAddressId" DROP NOT NULL,
ALTER COLUMN "senderAddressId" DROP DEFAULT;
DROP SEQUENCE "invoice_clientaddressid_seq";
DROP SEQUENCE "invoice_senderaddressid_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_senderAddressId_key" ON "Invoice"("senderAddressId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_clientAddressId_key" ON "Invoice"("clientAddressId");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientAddressId_fkey" FOREIGN KEY ("clientAddressId") REFERENCES "ClientAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_senderAddressId_fkey" FOREIGN KEY ("senderAddressId") REFERENCES "SenderAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;
