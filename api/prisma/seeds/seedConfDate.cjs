const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();
const jsonFilePath = '../../data/conference-dates.json';

//To read json files
    function readJSONFile(filePath) {
        const fileData = fs.readFileSync(filePath);
        return JSON.parse(fileData);
    }

async function seedConferenceDates() {
    try {
      const jsonData = readJSONFile(jsonFilePath);
      const existingDates = await prisma.conferenceDate.findMany(); // Retrieve existing conference dates from the database
      const newDates = jsonData.filter((item) => {
        // Check if the conference date already exists in the database based on some unique identifier (e.g., date)
        return !existingDates.some((date) => date.date === item.date);
      });

      for (const date of newDates) {
        await prisma.conferenceDate.create({
          data: {
            date: date.date,
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
    seedConferenceDates,
  };