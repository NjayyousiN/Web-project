import { promises as fs } from "fs";
const path = "data/institutions.json";


export async function readInstitutions(type) {
    const data = await fs.readFile(path);
    const institutions = JSON.parse(data);
    return institutions;
}
