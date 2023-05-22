// const { PrismaClient } = require('@prisma/client');
// const fs = require('fs');
// const prisma = new PrismaClient();
// const jsonFilePath = '../../data/papers.json';

// // To read json files
// function readJSONFile(filePath) {
//   const fileData = fs.readFileSync(filePath);
//   return JSON.parse(fileData);
// }

// async function seedPaperReviewers() {
//   try {
//     const jsonData = readJSONFile(jsonFilePath);

//     for (const paper of jsonData) {
//       if (Array.isArray(paper.reviewers)) {
//         for (const reviewer of paper.reviewers) {
//           const paperReviewerData = {
//             paper: {
//               connect: {
//                 id: paper.id,
//               },
//             },
//           };

//           // Connect to existing reviewer if reviewerId is provided
//           if (reviewer.id !== undefined) {
//             paperReviewerData.reviewer = {
//               connect: {
//                 id: reviewer.id,
//               },
//             };
//           } else {    
//             // Handle case when reviewerId is not available
//             console.log(`Reviewer ID is missing for paper ID: ${paper.id}`);
//             continue; // Skip this reviewer and proceed to the next one
//           }
          
//       // Optional fields validation
//         if (reviewer.evaluation !== undefined) {
//           paperReviewerData.evaluation = reviewer.evaluation;
//         }
//         if (reviewer.contribution !== undefined) {
//           paperReviewerData.contribution = reviewer.contribution;
//         }
//         if (reviewer.strengths !== undefined) {
//           paperReviewerData.strengths = reviewer.strengths;
//         }
//         if (reviewer.weaknesses !== undefined) {
//           paperReviewerData.weaknesses = reviewer.weaknesses;
//         }

//         await prisma.paperReviewer.create({
//           data: paperReviewerData,
//         });
//       }
//     }
//   }
    
//     console.log('[INFO] Data inserted successfully.');
//   } catch (err) {
//     console.error('[ERROR] Error inserting data:', err);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// module.exports = {
//   seedPaperReviewers,
// };
