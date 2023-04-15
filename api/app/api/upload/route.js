import * as uploadRepo from "./repository.js"

export async function GET(request) {
    try {
        console.log(`[INFO] GET request received for /upload`);
        const attachedPdfs = await uploadRepo.readUpload();
        console.log(`[INFO] Successfully retrieved uploads: ${JSON.stringify(attachedPdfs)}`);
        return Response.json(attachedPdfs, {status: 200 });        
    }  catch (err) {
        console.error(`[ERROR] Failed to retrieve uploads: ${err.message}`);
        return Response({message: "Internal server error."}, { status: 500});
    }
}
    
export async function POST(request) {
    try {
        console.log(`[INFO] POST request received for /upload: ${JSON.stringify(request.body)}`);
        const body = await request.json();
        if ("attachedPdf" in body) {
            const attachedPdf = await uploadRepo.createUpload({attachedPdf: body.attachedPdf});
            console.log(`[INFO] Successfully created upload: ${JSON.stringify(attachedPdf)}`);
            return Response.json(attachedPdf, {status: 201 });        
        } else {
            console.log(`[INFO] Invalid parameters received for /upload POST request: ${JSON.stringify(body)}`);
            return Response.json({message: "Invalid parameters"}, { status: 400});
        }
    }  catch (err) {
        console.error(`[ERROR] Failed to create upload: ${err.message}`);
        return new Response({message: "Internal server error."}, { status: 500});
    }
}
