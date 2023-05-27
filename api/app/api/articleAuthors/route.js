// import * as authorsRepo from "./repository.js"
import { readAuthors, createAuthor, deleteAuthor} from '../prismaRepository.js';

export async function GET(request, { params }) {
    try {

        const authors = await readAuthors();

        return Response.json(authors, {status: 200 });        
    }  catch (err) {
            console.error(err.message);
            return Response.json({message: "Internal server error."}, { status: 500});
    }

}
    
export async function POST(request, { params }) {

    try {

        const body = await request.json();
        if ("fname" in body && "lname" in body && "affiliation" in body && "email" in body ) {
            const author = await createAuthor({fname: body.fname, lname: body.lname,
                 affiliation: body.affiliation, email: body.email});
            return Response.json(author, {status: 201 });        
        }
        return Response.json( {message: "Invalid parameters"}, { status: 400})

    }  catch (err) {
        console.error(err.message);
        return new Response({message: "Internal server error."}, { status: 500});
    }

}

export async function DELETE(request, { params }) {

    try {
        const { id } = params;
        const author = await deleteAuthor(id);
        
        if(author) {
            return Response.json(author, { status: 200 })
        }
        return Response.json({ message: "Author not found"}, { status: 404 });

    } catch (err) {
        console.error(err.message);
        return new Response({message: "Internal server error."}, { status: 500});
    }

}
