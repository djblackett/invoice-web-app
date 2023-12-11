-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "paymentDue" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "paymentTerms" INTEGER NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "clientAddressId" INTEGER NOT NULL,
    "senderAddressId" INTEGER,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "invoiceId" TEXT,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientAddress" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "ClientAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SenderAddress" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "SenderAddress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientAddressId_fkey" FOREIGN KEY ("clientAddressId") REFERENCES "ClientAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_senderAddressId_fkey" FOREIGN KEY ("senderAddressId") REFERENCES "SenderAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
