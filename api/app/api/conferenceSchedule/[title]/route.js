import * as repo from "../repository.js";

export async function DELETE(request, { params }) {
  // Deletes a collection
  try {
    const { title } = params;
    const schedule = await repo.deleteSchedule(title);
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
  // Updates a schedule
  try {
    const { title } = params;
    const body = await request.json();
    const schedule = await repo.updateSchedule(title, body);
    if (schedule === false) {
      return Response.json(
        { message: "Session does not exist" },
        { status: 400 }
      );
    }
    return Response.json(schedule, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: "Internal error message" },
      { status: 500 }
    );
  }
}
