const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();
const jsonFilePath = '../../data/institutions.json';

//To read json files
    function readJSONFile(filePath) {
        const fileData = fs.readFileSync(filePath);
        return JSON.parse(fileData);
    }

    async function seedInstitutions() {
      try {
        const jsonData = readJSONFile(jsonFilePath);
        const existingInstitutions = await prisma.institution.findMany(); // Retrieve existing institutions from the database
        const newInstitutions = jsonData.filter((item) => {
          // Check if the institution already exists in the database based on some unique identifier (e.g., name)
          return !existingInstitutions.some((institution) => institution.name === item.institution);
        });
    
        for (const institution of newInstitutions) {
          await prisma.institution.create({
            data: {
              name: institution.institution,
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
    seedInstitutions,
  };