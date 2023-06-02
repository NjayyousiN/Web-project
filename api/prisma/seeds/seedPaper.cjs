  const { PrismaClient } = require('@prisma/client');
  const fs = require('fs');
  const prisma = new PrismaClient();
  const jsonFilePath = '../../data/papers.json';

  // To read JSON files
  function readJSONFile(filePath) {
    const fileData = fs.readFileSync(filePath);
    return JSON.parse(fileData);
  }

  async function seedPapers() {
    try {
      const jsonData = readJSONFile(jsonFilePath);
      const existingPapers = await prisma.paper.findMany(); // Retrieve existing papers from the database
      const newPapers = jsonData.filter((item) => {
        // Check if the paper already exists in the database based on some unique identifier (e.g., id)
        return !existingPapers.some((paper) => paper.id === item.id);
      });
  
      for (const paper of newPapers) {
        const presenter = paper.presenter;
  
        // Create or find the presenter
        const presenterData = {
          id: presenter.id,
          firstName: presenter.fname,
          lastName: presenter.lname,
          affiliation: presenter.affiliation,
          email: presenter.email,
        };
  
        let existingPresenter = await prisma.articleAuthor.findFirst({
          where: { id: presenter.id },
        });
  
        if (!existingPresenter) {
          existingPresenter = await prisma.articleAuthor.create({
            data: presenterData,
          });
        }
  
        // Retrieve existing authors from the database
        const existingAuthors = await prisma.articleAuthor.findMany({
          where: {
            OR: paper.authors.map((author) => ({ id: author.id })),
          },
        });
        
        const existingAuthorIds = existingAuthors.map((author) => author.id);
        
        const newAuthors = paper.authors.filter(
          (author) => !existingAuthorIds.includes(author.id)
        );
        
        const authorConnections = [
          ...existingAuthors.map((author) => ({ id: author.id })),
          ...newAuthors,
        ];


        for (const author of newAuthors) {
          await prisma.articleAuthor.create({
            data: {
              id: author.id,
              firstName: author.firstName,
              lastName: author.lastName,
              affiliation: author.affiliation,
              email: author.email,
            },
          });
        }
 

        // Create the paper
        const paperData = {
          id: paper.id,
          title: paper.title,
          abstract: paper.abstract,
          pdfURL: paper.pdfURL,
          createdAt: paper.createdat,
          presenter: { connect: { id: existingPresenter.id } },
          authors: { connect: authorConnections },
        };
  
        await prisma.paper.create({
          data: paperData,
        });
  
        // Create the paper reviews
        if (Array.isArray(paper.reviews)) {
          for (const review of paper.reviews) {
            await prisma.paperReview.create({
              data: {
                evaluation: review.evaluation,
                contribution: review.contribution,
                strengths: review.strengths,
                weaknesses: review.weaknesses,
                paperId: paper.id,
                reviewerId: parseInt(review.reviewerId),
              },
            });
          }
        }
      }
  
      console.log('[INFO] Data inserted successfully.');
    } catch (err) {
      console.error('[ERROR] Error inserting data:', err);
    } finally {
      await prisma.$disconnect();
    }
  }
  
  
  
  
  
  
  

  module.exports = {
    seedPapers,
  };
