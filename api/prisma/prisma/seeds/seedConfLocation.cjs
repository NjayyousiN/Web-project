const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();
const jsonFilePath = '../../data/locations.json';

//To read json files
    function readJSONFile(filePath) {
        const fileData = fs.readFileSync(filePath);
        return JSON.parse(fileData);
    }

    async function seedConferenceLocations() {
      try {
        const jsonData = readJSONFile(jsonFilePath);
        const existingLocations = await prisma.conferenceLocation.findMany(); // Retrieve existing conference locations from the database
        const newLocations = jsonData.filter((item) => {
          // Check if the conference location already exists in the database based on some unique identifier (e.g., location)
          return !existingLocations.some((location) => location.location === item.location);
        });
    
        for (const location of newLocations) {
          await prisma.conferenceLocation.create({
            data: {
              location: location.location,
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
    seedConferenceLocations,
  };