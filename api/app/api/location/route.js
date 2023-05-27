// import * as repo from "./repository.js";
import { readLocation } from '../prismaRepository.js';

// CRUD operations
export async function GET(request, { params }) {
  // return all schedules
  try {
    const loc = await readLocation();
    if (loc.length === 0) {
      return Response.json({ message: " No Location found" }, { status: 404 });
    }
    if (loc) {
      return Response.json(loc, { status: 200 });
    }
  } catch (error) {
    console.error(error.message);
    return Response.json(
      { message: "Internal error message" },
      { status: 500 }
    );
  }
}
