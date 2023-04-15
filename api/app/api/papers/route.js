import * as papersRepo from "./repository.js"

export async function GET(request) {
    try {
        console.log("GET request received");

        const papers = await papersRepo.readPapers();

        console.log(`Returning ${papers.length} papers`);

        return Response.json(papers, {status: 200 });        
    } catch (err) {
        console.error(`Error processing GET request: ${err.message}`);
        return Response({message: "Internal server error."}, { status: 500});
    }
}
    
export async function POST(request) {
    try {
        console.log("POST request received");

        const body = await request.json();
        const paper = await papersRepo.createPaper(body);
        
        console.log(`Paper created with id: ${paper.id}`);

        return Response.json(paper, {status: 201 });        
    } catch (err) {
        console.error(`Error processing POST request: ${err.message}`);
        return new Response({message: "Internal server error."}, { status: 500});
    }
}
