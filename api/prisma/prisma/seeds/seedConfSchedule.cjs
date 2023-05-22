const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();
const jsonFilePath = '../../data/schedule.json';

//To read json files
    function readJSONFile(filePath) {
        const fileData = fs.readFileSync(filePath);
        return JSON.parse(fileData);
    }

async function seedConferenceSchedules() {
    try {
      const jsonData = readJSONFile(jsonFilePath);
      const existingSchedules = await prisma.conferenceSchedule.findMany(); // Retrieve existing conference schedules from the database
      const newSchedules = jsonData.filter((item) => {
        // Check if the conference schedule already exists in the database based on some unique identifier (e.g., title, date)
        return !existingSchedules.some((schedule) => {
          return schedule.title === item.title && schedule.date === item.date;
        });
      });
  
      for (const schedule of newSchedules) {
        await prisma.conferenceSchedule.create({
          data: {
            title: schedule.title,
            date: schedule.date,
            location: schedule.location,
            presenter: schedule.presenter,
            fromTime: schedule.FromTime,
            toTime: schedule.ToTime,
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
    seedConferenceSchedules,
  };