/*
  Warnings:

  - You are about to drop the `ArticleAuthor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConferenceDate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConferenceLocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConferenceSchedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Institution` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PDF` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Paper` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaperReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaperReviewer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AuthorOf` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PaperReviewers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ArticleAuthor";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ConferenceDate";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ConferenceLocation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ConferenceSchedule";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Institution";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PDF";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Paper";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PaperReview";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PaperReviewer";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_AuthorOf";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_PaperReviewers";
PRAGMA foreign_keys=on;
