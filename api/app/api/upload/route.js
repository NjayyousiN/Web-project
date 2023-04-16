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
    console.log(`[INFO] POST request received for /upload`);

    if (!request.headers.get("Content-Type").startsWith("multipart/form-data")) {
      return new Response(
        JSON.stringify({ message: "Invalid request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const formData = await request.formData();
    const attachedPdfs = formData.getAll("attachedPdf");

    if (attachedPdfs.length === 0) {
      return new Response(
        JSON.stringify({ message: "No PDFs attached" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const uploadResult = await uploadRepo.createUpload(attachedPdfs);

    console.log(`[INFO] Successfully created upload: ${JSON.stringify(uploadResult)}`);

    return new Response(
      JSON.stringify(uploadResult),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(`[ERROR] Failed to create upload: ${err.message}`);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
