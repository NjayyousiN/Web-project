const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();
const jsonFilePath = '../../data/papers.json';

// To read json files
function readJSONFile(filePath) {
  const fileData = fs.readFileSync(filePath);
  return JSON.parse(fileData);
}

async function seedPaperReviews() {
  try {
    const jsonData = readJSONFile(jsonFilePath);

    for (const paper of jsonData) {
      if (Array.isArray(paper.reviews)) {
        for (const review of paper.reviews) {
          const existingReview = await prisma.paperReview.findFirst({
            where: {
              paperId: paper.id,
              reviewerId: parseInt(review.reviewerId),
            },
          });

          if (!existingReview) {
            await prisma.paperReview.create({
              data: {
                evaluation: review.evaluation,
                contribution: review.contribution,
                strengths: review.strengths,
                weaknesses: review.weaknesses,
                paper: { connect: { id: paper.id } },
                reviewer: { connect: { id: parseInt(review.reviewerId) } },
              },
            });
          } else {
            console.log(`[INFO] Skipping duplicate review for paper ${paper.id} and reviewer ${review.reviewerId}`);
          }
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
  seedPaperReviews,
};
