/*
  Warnings:

  - Added the required column `agent_id` to the `passengers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "passengers" ADD COLUMN     "agent_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "idx_passengers_agent" ON "passengers"("agent_id");
