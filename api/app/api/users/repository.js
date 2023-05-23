import {promises as fs} from "fs";

//Standard CRUD methods **** DELETE USELESS FUNCTIONS LATER
const path = "data/users.json";



export async function readUsers(role) {
    //
    const data = await fs.readFile(path);
    let users = JSON.parse(data);

    if(role) {
        users = users.filter(u => u.role === role);
    }
    return users;
}

