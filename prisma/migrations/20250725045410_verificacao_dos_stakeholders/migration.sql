/*
  Warnings:

  - You are about to drop the column `address_complement` on the `customers` table. All the data in the column will be lost.
  - Made the column `departure_city` on table `travels` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "customers" DROP COLUMN "address_complement";

-- AlterTable
ALTER TABLE "travels" ALTER COLUMN "departure_city" SET NOT NULL;
