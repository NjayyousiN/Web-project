import { promises as fs } from "fs";
import { nanoid } from "nanoid";
//Standard CRUD methods **** DELETE USELESS FUNCTIONS LATER
const path = "data/papers.json";

export async function createPaper(paper) {
    //
    const data = await fs.readFile(path);

    const papers = JSON.parse(data);

    paper = {...paper,
        id: nanoid(),
        createdat: new Date()
    };
    papers.push(paper);

    await fs.writeFile(path, JSON.stringify(papers));
    return paper;

}

export async function readPapers(type) {
    //
    const data = await fs.readFile(path);
    const papers = JSON.parse(data);
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