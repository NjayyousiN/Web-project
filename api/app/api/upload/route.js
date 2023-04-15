import * as uploadRepo from "./repository.js"

export async function GET(request) {
    try {
        const attachedPdfs = await uploadRepo.readUpload();

        return Response.json(attachedPdfs, {status: 200 });        
    }  catch (err) {
            console.error(err.message);
            return Response({message: "Internal server error."}, { status: 500});
    }

}
    
export async function POST(request) {

    try {
        const body = await request.json();
        if ("attachedPdf" in body) {
            const attachedPdf = await uploadRepo.createUpload({attachedPdf: body.attachedPdf});
            return Response.json(attachedPdf, {status: 201 });        
        } else {
            return Response.json({message: "Invalid parameters"}, { status: 400});
        }
    }  catch (err) {
        console.error(err.message);
        return new Response({message: "Internal server error."}, { status: 500});
    }
}