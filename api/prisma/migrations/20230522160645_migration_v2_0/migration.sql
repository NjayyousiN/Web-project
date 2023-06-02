-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PaperReviewer" (
    "evaluation" INTEGER,
    "contribution" INTEGER,
    "strengths" TEXT,
    "weaknesses" TEXT,
    "paperId" TEXT NOT NULL,
    "reviewerId" INTEGER NOT NULL,

    PRIMARY KEY ("paperId", "reviewerId"),
    CONSTRAINT "PaperReviewer_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PaperReviewer_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PaperReviewer" ("contribution", "evaluation", "paperId", "reviewerId", "strengths", "weaknesses") SELECT "contribution", "evaluation", "paperId", "reviewerId", "strengths", "weaknesses" FROM "PaperReviewer";
DROP TABLE "PaperReviewer";
ALTER TABLE "new_PaperReviewer" RENAME TO "PaperReviewer";
CREATE UNIQUE INDEX "PaperReviewer_paperId_key" ON "PaperReviewer"("paperId");
CREATE UNIQUE INDEX "PaperReviewer_reviewerId_key" ON "PaperReviewer"("reviewerId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
