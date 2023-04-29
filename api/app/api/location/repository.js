import { promises as fs } from "fs";
const locPath = "data/locations.json";

export async function readLoc() {
  const data = await fs.readFile(locPath);
  const loc = JSON.parse(data);
  return loc;
}
