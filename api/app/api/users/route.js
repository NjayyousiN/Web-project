import * as usersRepo from "./repository.js"

export async function GET(request, { params }) {

    try {
        const role = new URL(request.url).searchParams.get("role")?.toLowerCase();

        if (role && role !== "reviewer" && role !== "author" && role !== "organizer"){
            return Response.json({message: "Invalid parameters"}, { status: 400});   
        }
        const users = await usersRepo.readUsers(role);
        return Response.json(users, {status: 200 });        
    } catch (err) {
        console.error(err.message);
        return Response({message: "Internal server error."}, { status: 500});
    }

}
    