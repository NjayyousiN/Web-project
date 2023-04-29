import { promises as fs } from "fs";
const schedulePath = "data/schedule.json";
const datePath = "data/conference-dates.json";


export async function readDate(date) {
  const response = await fs.readFile(schedulePath);
  let data = JSON.parse(response);
  console.log(data);
  return data.find((item) => item.date === date);
}

export async function readSchedule() {
  const data = await fs.readFile(schedulePath);
  const schedule = JSON.parse(data);
  return schedule;
}