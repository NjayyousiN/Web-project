import { PrismaClient } from '@prisma/client';
import ConferenceStats from '../../../prisma/dataController/ConferenceStats.js';

const prisma = new PrismaClient();

export async function GET(request) {
  const conferenceStats = new ConferenceStats();

  try {
    const data = await conferenceStats.fetchConferenceStats();
		return Response.json(data, {status: 200 });        
  } catch (error) {
    console.error('[ERROR] Error retrieving data:', error);
    return status(500).json({ message: 'Error retrieving data' });
  } finally {
    await prisma.$disconnect();
  }
}
