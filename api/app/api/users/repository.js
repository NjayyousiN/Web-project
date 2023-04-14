import {promises as fs} from "fs";

//Standard CRUD methods **** DELETE USELESS FUNCTIONS LATER
const path = "data/users.json";

export async function createUser(user) {
    //SIGN UP
}

export async function readUsers(role) {
    //
    const data = await fs.readFile(path);
    let users = JSON.parse(data);

    if(role) {
        users = users.filter(u => u.role === role);
    }
    return users;
}

export async function readUser(id) {
    //
}

export async function updateUser(user) {
    //
}

export async function deleteUser(id) {
    //
}