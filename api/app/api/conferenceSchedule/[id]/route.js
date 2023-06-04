// import * as repo from "../repository.js";
import {
  deleteSchedule,
  readSchedule,
  updateSchedule,
} from "../../prismaRepository.js";

export async function GET(request, { params }) {
  // return schedules by id
  try {
    const { id } = params;
    const schedule = await readSchedule(id);
    if (!schedule) {
      return Response.json({ message: "No schedule found" }, { status: 404 });
    }

    return Response.json(schedule, { status: 200 });
  } catch (error) {
    console.error(error.message);
    return Response.json(
      { message: "Internal error message" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  // Deletes a collection
  try {
    const { id } = params;
    const schedule = await deleteSchedule(id);
    if (schedule === false) {
      return Response.json(
        { message: "Session does not exist" },
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

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const schedule = await updateSchedule(id, body);
    if (schedule === false) {
      return Response.json(
        { message: "Session does not exist" },
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
