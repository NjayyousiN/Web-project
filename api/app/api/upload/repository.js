import { promises as fs } from "fs";
import { nanoid } from "nanoid";
const path = "data/pdfs.json";

export async function createUpload(attachedPdf) {
    const data = await fs.readFile(path);
    const attachedPdfs = JSON.parse(data);

    // attachedPdf = {filename: attachedPdf.name, mimetype: attachedPdf.type};
    attachedPdf = {filename: attachedPdf.name, mimetype: attachedPdf.type, content: attachedPdf.content};

    attachedPdfs.push(attachedPdf);

    await fs.writeFile(path, JSON.stringify(attachedPdfs));
    console.log(`Attached PDF created.`);
    return attachedPdf;
}

export async function readUpload() {
    const data = await fs.readFile(path);
    const attachedPDFs = JSON.parse(data);
    console.log(`Attached PDFs retrieved.`);
    return attachedPDFs;
}



export async function readUploadByFilename(filename) {
    const attachedPdfs = await readUpload();
    const pdfData = attachedPdfs.find((pdf) => pdf.filename === filename);
    return pdfData;
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