/*
  Warnings:

  - You are about to drop the column `passenger_type` on the `passengers` table. All the data in the column will be lost.
  - Made the column `document_number` on table `passengers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `birth_date` on table `passengers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `passengers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "passengers" DROP COLUMN "passenger_type",
ALTER COLUMN "document_number" SET NOT NULL,
ALTER COLUMN "birth_date" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL;
