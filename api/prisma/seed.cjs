
//Imports
const { PrismaClient } = require('@prisma/client');
const seedPDF = require('./seeds/seedPDF.cjs');
const seedArticleAuthor = require('./seeds/seedArticleAuthor.cjs');
const seedConferenceDate = require('./seeds/seedConfDate.cjs');
const seedConferenceLocation = require('./seeds/seedConfLocation.cjs');
const seedConferenceSchedule = require('./seeds/seedConfSchedule.cjs');
const seedInstitution = require('./seeds/seedInstitution.cjs');
const seedPaper = require('./seeds/seedPaper.cjs');
const seedUser = require('./seeds/seedUser.cjs');
// const seedPaperReviewers = require('./seeds/seedPaperReviewer.cjs');
const seedPaperReview = require('./seeds/seedPaperReview.cjs');
const prisma = new PrismaClient();

//Seed All Functions
async function seedAll() {
  try {
    await seedPDF.seedPDF(prisma);
    await seedArticleAuthor.seedArticleAuthors(prisma);
    await seedConferenceDate.seedConferenceDates(prisma);
    await seedConferenceLocation.seedConferenceLocations(prisma);
    await seedConferenceSchedule.seedConferenceSchedules(prisma);
    await seedInstitution.seedInstitutions(prisma);
    await seedPaper.seedPapers(prisma);
    await seedUser.seedUsers(prisma);
    // await seedPaperReviewers.seedPaperReviewers(prisma);
    await seedPaperReview.seedPaperReviews(prisma);

    console.log('[INFO] Data seeding completed successfully.');
  } catch (err) { 
    console.error('[ERROR] Error seeding data:', err);
  } finally {
    await prisma.$disconnect();
  }
}

//Call seedAll
seedAll()
  .catch((err) => {
    console.error('[ERROR] Error seeding data:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
