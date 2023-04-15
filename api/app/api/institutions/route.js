import * as institutionsRepo from "./repository.js"

export async function GET(request) {
    try {

        const institutions = await institutionsRepo.readInstitutions();

        return Response.json(institutions, {status: 200 });        
    }  catch (err) {
            console.error(err.message);
            return Response.json({message: "Internal server error."}, { status: 500});
    }

}
