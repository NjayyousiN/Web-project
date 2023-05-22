const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();
const jsonFilePath = '../../data/users.json';

//To read json files
    function readJSONFile(filePath) {
        const fileData = fs.readFileSync(filePath);
        return JSON.parse(fileData);
    }

    //Fill the Database with the data read from json
    async function seedUsers() {
        try {
          const jsonData = readJSONFile(jsonFilePath);
          const existingUsers = await prisma.user.findMany(); // Retrieve existing users from the database   
          const newUsers = jsonData.filter((item) => {
            // Check if the user already exists in the database based on some unique identifier (e.g., email)
            return !existingUsers.some((user) => user.email === item.email);
          });
          for (const user of newUsers) {
            await prisma.user.create({
              data: {
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                password: user.password,
                role: user.role,
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
    seedUsers,
  };

