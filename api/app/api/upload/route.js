// import * as uploadRepo from "./repository.js"
import { Buffer } from "buffer";
import {
  readUploadByFilename,
  createUpload,
} from '../prismaRepository.js';

export async function GET(request) {
    try {
      const url = new URL(request.url);
      const filename = url.pathname.substring(1); // Removes the leading '/'

      const pdfData = await readUploadByFilename(filename);

      if (!pdfData) {
        return new Response(
          JSON.stringify({ message: "PDF not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      const pdfBuffer = Buffer.from(pdfData.base64Content, "base64");

      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=${pdfData.filename}`,
        },
      });
    } catch (err) {
      console.error(`[ERROR] Failed to serve PDF: ${err.message}`);
      return new Response(
        JSON.stringify({ message: "Internal server error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
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
    const uploadResults = [];

    if (attachedPdfs.length === 0) {
      return new Response(
        JSON.stringify({ message: `[INFO] No PDFs attached` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    for (const attachedPdf of attachedPdfs) {
      const buffer = await attachedPdf.arrayBuffer();
      const base64Pdf = Buffer.from(buffer).toString("base64");
      const uploadResult = await createUpload({ ...attachedPdf, content: base64Pdf });

      uploadResults.push({
        filename: uploadResult.filename,
        base64Content: base64Pdf
    });
    }

    const firstUploadResult = uploadResults[0];

    console.log(`[INFO] Successfully created upload.`);

    return new Response(JSON.stringify({
      url: firstUploadResult.filename,
      base64Content: firstUploadResult.base64Content
    }), { status: 201, headers: { "Content-Type": "application/json" } });

  } catch (err) {
      console.error(`[ERROR] Failed to create upload: ${err.message}`);
      return new Response(
        JSON.stringify({ message: `[ERROR ]Internal server error` }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
  }
}
