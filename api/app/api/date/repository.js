import { promises as fs } from "fs";
const datePath = "data/conference-dates.json";

export async function readDate() {
  const data = await fs.readFile(datePath);
  const date = JSON.parse(data);
  return date;
}
