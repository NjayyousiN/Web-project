import { promises as fs } from "fs";
const schedulePath = "data/schedule.json";

export async function readSchedule() {
  const data = await fs.readFile(schedulePath);
  const schedule = JSON.parse(data);
  return schedule;
}

// add new session to the schedule

export async function createSchedule(body) {
  //re read the schedule
  const sessions = await readSchedule();

  //check if the session already exists
  const existingSession = sessions.find(
    (session) => session.title === body.title
  );

  if (existingSession !== undefined) {
    return false;
  }

  //create a new session
  const newSession = {
    title: body.title,
    date: body.date,
    location: body.location,
    presenter: body.presenter,
    FromTime: body.FromTime,
    ToTime: body.ToTime,
  };
  //add the new session to the array of sessions
  sessions.push(newSession);
  //write the new array of sessions to the file
  await fs.writeFile(schedulePath, JSON.stringify(sessions));
  return newSession;
}

// delete session from the schedule
export async function deleteSchedule(title) {
  const sessions = await readSchedule();
  const index = sessions.findIndex((session) => session.title === title);
  // check if the session exists
  if (index !== -1) {
    // delete the session
    const deletedSession = sessions[index];
    sessions.splice(index, 1);
    await fs.writeFile(schedulePath, JSON.stringify(sessions));
    return deletedSession;
  } else {
    return false;
  }
}

// update session in the schedule
export async function updateSchedule(title, body) {
  const sessions = await readSchedule();
  const index = sessions.findIndex((session) => session.title === title);
  // check if the session exists
  if (index !== -1) {
    // update the session
    sessions[index].date = body.date;
    sessions[index].location = body.location;
    sessions[index].FromTime = body.FromTime;
    sessions[index].ToTime = body.ToTime;
    await fs.writeFile(schedulePath, JSON.stringify(sessions));
    return sessions[index];
  } else {
    return false;
  }
}
