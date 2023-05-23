// const { PrismaClient } = require('@prisma/client');
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ConferenceStats {
  async fetchConferenceStats() {
    const paperStats = await this.getNumberOfPapers();
    const averageAuthorsPerPaper = await this.getAverageAuthorsPerPaper();
    const sessionStats = await this.getSessionStats();

    const paperStatsElement = document.getElementById('paperStats');
    paperStatsElement.innerHTML = `
      <p>Number of papers submitted: ${paperStats.total}</p>
      <p>Number of papers accepted: ${paperStats.accepted}</p>
      <p>Number of papers rejected: ${paperStats.rejected}</p>
    `;

    const authorStatsElement = document.getElementById('authorStats');
    authorStatsElement.innerHTML = `
      <p>Average number of authors per paper: ${averageAuthorsPerPaper}</p>
    `;

    const sessionStatsElement = document.getElementById('sessionStats');
    sessionStatsElement.innerHTML = `
      <p>Number of conference sessions: ${sessionStats.sessionCount}</p>
      <p>Average number of presentations per session: ${sessionStats.averagePresentations}</p>
    `;
  }

  async getNumberOfPapers() {
    const total = await prisma.paper.count();
    const accepted = await prisma.paper.count({
      where: {
        reviews: {
          some: {
            evaluation: {
              gte: 2
            }
          }
        }
      }
    });
    const rejected = total - accepted;

    return { total, accepted, rejected };
  }

  //maybe wrong logic?
 // ...

 async getAverageAuthorsPerPaper() {
  try {
    const paperCount = await prisma.paper.count(); // Count the number of papers
    const authorCount = await prisma.articleAuthor.count(); // Count the number of authors

    const averageAuthors = authorCount / paperCount; // Calculate the average

    console.log(`[INFO] Average authors per paper: ${averageAuthors}`);
  } catch (err) {
    console.error('[ERROR] Error retrieving data:', err);
  } finally {
    await prisma.$disconnect();
  }
}


  async getSessionStats() {
    const sessionCount = await this.getNumberOfConferenceSessions();
    const averagePresentations = await this.getAveragePresentationsPerSession();

    return { sessionCount, averagePresentations };
  }

  async getNumberOfConferenceSessions() {
    try {
      const count = await prisma.conferenceSchedule.count();
  
      return count;
    } catch (err) {
      console.error('[ERROR] Error retrieving data:', err);
      throw err;
    } finally {
      await prisma.$disconnect();
    }
  }
  

  async getAveragePresentationsPerSession() {
    try {
      const sessionCount = await prisma.conferenceSchedule.count(); // Count the number of conference schedules
      const totalPresentations = sessionCount; // Each schedule represents a session with a single presentation
      
      const averagePresentations = totalPresentations / sessionCount; // Calculate the average
      
      console.log(`[INFO] Average presentations per session: ${averagePresentations}`);
    } catch (err) {
      console.error('[ERROR] Error retrieving data:', err);
    } finally {
      await prisma.$disconnect();
    }
  }
}  

const conferenceStats = new ConferenceStats();
conferenceStats.fetchConferenceStats();
