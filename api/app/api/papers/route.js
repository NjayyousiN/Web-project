import * as papersRepo from "./repository.js"

export async function GET(request) {
    try {

        const papers = await papersRepo.readPapers();

        return Response.json(papers, {status: 200 });        
    }  catch (err) {
            console.error(err.message);
            return Response({message: "Internal server error."}, { status: 500});
    }

}
    
export async function POST(request) {

    try {

        const body = await request.json();
        if ("paper_title" in body && "paper_abstract" in body && "paper_authors" in body && "presenter" in body && "pdfUrl" in body) {
            const paper = await papersRepo.createPaper({paper_title: body.paper_title, paper_abstract: body.paper_abstract,
                 paper_authors: body.paper_authors, presenter: body.presenter, pdfUrl: body.pdfUrl});
            return Response.json(paper, {status: 201 });        
        }
        return Response.json( {message: "Invalid parameters"}, { status: 400})

    }  catch (err) {
        console.error(err.message);
        return new Response({message: "Internal server error."}, { status: 500});
    }

}