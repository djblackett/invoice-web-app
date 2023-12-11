/*
  Warnings:

  - You are about to drop the column `postcode` on the `ClientAddress` table. All the data in the column will be lost.
  - You are about to drop the column `postcode` on the `SenderAddress` table. All the data in the column will be lost.
  - Added the required column `postCode` to the `ClientAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postCode` to the `SenderAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClientAddress" DROP COLUMN "postcode",
ADD COLUMN     "postCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SenderAddress" DROP COLUMN "postcode",
ADD COLUMN     "postCode" TEXT NOT NULL;
