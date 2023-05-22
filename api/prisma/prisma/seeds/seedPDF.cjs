const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();
const jsonFilePath = '../../data/pdfs.json';

// To read json files
function readJSONFile(filePath) {
  const fileData = fs.readFileSync(filePath);
  return JSON.parse(fileData);
}

// Fill the Database with the data read from json
async function seedPDF() {
  try {
    const jsonData = readJSONFile(jsonFilePath);
    const existingPDFs = await prisma.PDF.findMany(); // Retrieve existing PDFs from the database
    const newPDFs = jsonData.filter((item) => {
      // Check if the PDF already exists in the database based on some unique identifier
      // Modify the condition below based on your PDF data structure and unique identifier
      return !existingPDFs.some((pdf) => pdf.content === item.content);
    });

    for (const pdf of newPDFs) {
      await prisma.PDF.create({
        data: {
          content: pdf.content,
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

// Export
module.exports = {
  seedPDF,
};
