/*
  Warnings:

  - Made the column `senderAddressId` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `invoiceId` on table `Item` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_senderAddressId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_invoiceId_fkey";

-- AlterTable
CREATE SEQUENCE invoice_clientaddressid_seq;
CREATE SEQUENCE invoice_senderaddressid_seq;
ALTER TABLE "Invoice" ALTER COLUMN "clientAddressId" SET DEFAULT nextval('invoice_clientaddressid_seq'),
ALTER COLUMN "senderAddressId" SET NOT NULL,
ALTER COLUMN "senderAddressId" SET DEFAULT nextval('invoice_senderaddressid_seq');
ALTER SEQUENCE invoice_clientaddressid_seq OWNED BY "Invoice"."clientAddressId";
ALTER SEQUENCE invoice_senderaddressid_seq OWNED BY "Invoice"."senderAddressId";

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "invoiceId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_senderAddressId_fkey" FOREIGN KEY ("senderAddressId") REFERENCES "SenderAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
