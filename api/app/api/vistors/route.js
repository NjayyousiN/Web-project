import * as repo from "./repository.js";

// CRUD operations
export async function GET(request, { params }) {
  // return all schedules
  try {
    const schedule = await repo.readSchedule();
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

