/*
  Warnings:

  - You are about to alter the column `createdAt` on the `Paper` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Paper" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "pdfURL" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "presenterId" TEXT,
    CONSTRAINT "Paper_presenterId_fkey" FOREIGN KEY ("presenterId") REFERENCES "ArticleAuthor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Paper" ("abstract", "createdAt", "id", "pdfURL", "presenterId", "title") SELECT "abstract", "createdAt", "id", "pdfURL", "presenterId", "title" FROM "Paper";
DROP TABLE "Paper";
ALTER TABLE "new_Paper" RENAME TO "Paper";
CREATE INDEX "idx_presenterId" ON "Paper"("presenterId");
CREATE UNIQUE INDEX "Paper_id_presenterId_key" ON "Paper"("id", "presenterId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
