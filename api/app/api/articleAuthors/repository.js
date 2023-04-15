import { promises as fs } from "fs";
import { nanoid } from "nanoid";
//Standard CRUD methods **** DELETE USELESS FUNCTIONS LATER
const path = "data/articleAuthors.json";

export async function createAuthor(author) {
    //
    const data = await fs.readFile(path);

    const authors = JSON.parse(data);

    author = {...author,
        id: nanoid(),
        createdat: new Date()
    };
    authors.push(author);

    await fs.writeFile(path, JSON.stringify(authors));
    return author;

}

export async function readAuthors(type) {
    //
    const data = await fs.readFile(path);
    const authors = JSON.parse(data);
    return authors;
}

// export async function readUser(id) {
//     //
// }

// export async function updateUser(user) {
//     //
// }

export async function deleteAuthor(id) {
    //
    const data = await fs.readFile(path);
    const authors = JSON.parse(data);

    const authIndex = authors.findIndex((auth) => auth.id === id);
    
    if (authIndex !== -1) {
        const author = authors[authIndex];
        authors.splice(authIndex, 1);
        
        await fs.writeFile(path, JSON.stringify(authors));
        return author;
    }
    return null;
}