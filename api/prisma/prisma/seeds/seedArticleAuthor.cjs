const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();
const jsonFilePath = '../../data/articleAuthors.json';

//To read json files
    function readJSONFile(filePath) {
        const fileData = fs.readFileSync(filePath);
        return JSON.parse(fileData);
    }

async function seedArticleAuthors() {
    try {
      const jsonData = readJSONFile(jsonFilePath);
      const existingAuthors = await prisma.articleAuthor.findMany(); // Retrieve existing authors from the database
      const newAuthors = jsonData.filter((item) => {
        // Check if the author already exists in the database based on some unique identifier (e.g., id or email)
        return !existingAuthors.some((author) => author.id === item.id);
      });
  
      for (const author of newAuthors) {
        await prisma.articleAuthor.create({
          data: {
            id: author.id,
            firstName: author.fname,
            lastName: author.lname,
            affiliation: author.affiliation,
            email: author.email,
          },
        });
      }
  
      console.log('[INFO] Data inserted successfully.');
    } catch (err) {
      console.error('[ERROR] Error inserting data:', err);
    } finally {
      await prisma.$disconnect();
    }
  }

  module.exports = {
    seedArticleAuthors,
  };