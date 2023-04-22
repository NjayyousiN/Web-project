import * as papersRepo from "../repository.js"

export async function GET(request, { params }) {
	try {	
		const { id } = params;
		const authors = await papersRepo.readPaper(id);
		return Response.json(authors, {status: 200 });        
	} catch (err) {
			console.error(err.message);
			return Response.json({message: `[ERROR] Internal server error.`}, { status: 500});
	}
}
