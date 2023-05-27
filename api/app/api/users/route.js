import { PrismaClient } from '@prisma/client';
// import * as usersR from "./repository.js"
import {readUsers} from '../prismaRepository.js';

// Rest of your code

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const role = new URL(request.url).searchParams.get("role")?.toLowerCase();

    if (role && role !== "reviewer" && role !== "author" && role !== "organizer") {
      return Response.json({ message: "Invalid parameters" }, { status: 400 });
    }

    const users = await readUsers(role);
    return Response.json(users, { status: 200 });
  } catch (err) {
    console.error(err.message);
    return Response({ message: "Internal server error." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

