// import * as institutionsRepo from "./repository.js"
import { readInstitutions } from '../prismaRepository.js';

export async function GET(request) {
	try {
		const institutions = await readInstitutions();
		return Response.json(institutions, {status: 200 });        
	} catch (err) {
			console.error(err.message);
			return Response.json({message: `[ERROR] Internal server error.`}, { status: 500});
	}

}
