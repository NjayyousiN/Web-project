/*
  Warnings:

  - A unique constraint covering the columns `[id,presenterId]` on the table `Paper` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "idx_presenterId" ON "Paper"("presenterId");

-- CreateIndex
CREATE UNIQUE INDEX "Paper_id_presenterId_key" ON "Paper"("id", "presenterId");
