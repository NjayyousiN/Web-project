// import * as repo from "./repository.js";
import { readConfDate } from '../prismaRepository.js';

// CRUD operations
export async function GET(request, { params }) {
  // return all schedules
  try {
    const date = await readConfDate();
    if (date.length === 0) {
      return Response.json({ message: " No date found" }, { status: 404 });
    }
    if (date) {
      return Response.json(date, { status: 200 });
    }
  } catch (error) {
    console.error(error.message);
    return Response.json(
      { message: "Internal error message" },
      { status: 500 }
    );
  }
}
