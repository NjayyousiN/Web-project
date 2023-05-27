// import * as authorsRepo from "../repository.js"
import { readAuthor, deleteAuthor} from '../../prismaRepository.js';

export async function GET(request, { params }) {
	try {	
		const { id } = params;
		const authors = await readAuthor(id);
		return Response.json(authors, {status: 200 });        
	} catch (err) {
			console.error(err.message);
			return Response.json({message: `[ERROR] Internal server error.`}, { status: 500});
	}
}
    
export async function POST(request, { params }) {
	try {
		const { id } = params;
		return Response.json( {path: `/api/articleAuthors/${id}`, method: "POST"}, { status: 200 })

	} catch (err) {
			console.error(err.message);
			return new Response({message: `[ERROR] Internal server error.`}, { status: 500});
	}
}

export async function DELETE(request, { params }) {
	try {
		const { id } = params;
		const author = await deleteAuthor(id);
		
		if(author) {
				return Response.json(author, { status: 200 })
		}
		return Response.json({ message: `[ERROR] Author not found`}, { status: 404 });

	} catch (err) {
			console.error(err.message);
			return new Response({message: `[ERROR] Internal server error.`}, { status: 500});
	}
}
