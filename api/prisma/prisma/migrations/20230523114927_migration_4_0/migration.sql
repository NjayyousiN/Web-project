-- CreateTable
CREATE TABLE "_AuthorOf" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_AuthorOf_A_fkey" FOREIGN KEY ("A") REFERENCES "ArticleAuthor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AuthorOf_B_fkey" FOREIGN KEY ("B") REFERENCES "Paper" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_AuthorOf_AB_unique" ON "_AuthorOf"("A", "B");

-- CreateIndex
CREATE INDEX "_AuthorOf_B_index" ON "_AuthorOf"("B");
