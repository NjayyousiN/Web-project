// import * as repo from "./repository.js";
import { readSchedule, createSchedule} from '../prismaRepository.js';

// CRUD operations
export async function GET(request, { params }) {
  // return all schedules
  try {
    const schedule = await readSchedule();
    if (schedule.length === 0) {
      return Response.json({ message: "No schedule found" }, { status: 404 });
    }
    if (schedule) {
      return Response.json(schedule, { status: 200 });
    }
  } catch (error) {
    console.error(error.message);
    return Response.json(
      { message: "Internal error message" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  // Creates a new collection. The name of the collection is part of the request body
  try {
    const body = await request.json();
    const schedule = await createSchedule(body);
    if (schedule === false) {
      return Response.json(
        { message: "Session already exists" },
        { status: 400 }
      );
    }
    return Response.json(schedule, { status: 201 });
  } catch (error) {
    console.error(error.message);
    return Response.json(
      { message: "Internal error message" },
      { status: 500 }
    );
  }
}
