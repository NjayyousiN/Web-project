import { promises as fs } from "fs";
import { nanoid } from "nanoid";
//Standard CRUD methods **** DELETE USELESS FUNCTIONS LATER
const path = "data/pdfs.json";

export async function createUpload(attachedPdf) {
    //
    const data = await fs.readFile(path);

    const attachedPdfs = JSON.parse(data);

    attachedPdf = {...attachedPdf,
    };
    attachedPdfs.push(attachedPdf);

    await fs.writeFile(path, JSON.stringify(attachedPdfs));
    return attachedPdf;

}

export async function readUpload() {
    //
    const data = await fs.readFile(path);
    const attachedPDFs = JSON.parse(data);
    return attachedPDFs;
}

// export async function readUser(id) {
//     //
// }

// export async function updateUser(user) {
//     //
// }

// export async function deleteUser(id) {
//     //
// }