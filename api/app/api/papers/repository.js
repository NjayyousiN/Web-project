import { promises as fs } from "fs";
import { nanoid } from "nanoid";

const path = "data/papers.json";

export async function createPaper(paper) {
    console.log(`Creating paper with data: ${JSON.stringify(paper)}`);

    const data = await fs.readFile(path);
    const papers = JSON.parse(data);

    paper = {
        ...paper,
        id: nanoid(),
        createdat: new Date()
    };
    papers.push(paper);

    await fs.writeFile(path, JSON.stringify(papers));
    console.log(`Paper created with id: ${paper.id}`);
    return paper;
}

export async function readPapers(type) {
    console.log(`Reading papers from file: ${path}`);

    const data = await fs.readFile(path);
    const papers = JSON.parse(data);

    console.log(`Found ${papers.length} papers in file`);
    return papers;
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