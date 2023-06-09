// import * as papersRepo from "./repository.js";
import {
  readPapers,
  createPaper,
  updatePaperReview,
} from "../prismaRepository.js";

export async function GET(request) {
  try {
    console.log(`[INFO] GET request received`);
    const papers = await readPapers();
    console.log("papersssssss", papers);
    console.log(`[INFO] Returning ${papers.length} papers`);

    return Response.json(papers, { status: 200 });
  } catch (err) {
    console.error(`[ERROR] Error processing GET request: ${err.message}`);
    return Response(
      { message: `[ERROR ]Internal server error.` },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    console.log(`[INFO] POST request received`);
    const body = await request.json();
    const paper = await createPaper(body);
    console.log(`[INFO] Paper created with id: ${paper.id}`);

    return Response.json(paper, { status: 201 });
  } catch (err) {
    console.error(`[ERROR] Error processing POST request: ${err.message}`);
    return new Response(
      { message: ` [ERROR] Internal server error.` },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    console.log(`[INFO] PUT request received`);
    const body = await request.json();
    console.log(`[INFO] Request body:`, body);

    const { paperId, review } = body;

    const updatedPaper = await updatePaperReview(paperId, review);
    console.log(`[INFO] Paper updated with id: ${updatedPaper.id}`);
    console.log(`[INFO] Paper updated with review: ${updatedPaper.review}`);

    return new Response(JSON.stringify(updatedPaper), { status: 200 });
  } catch (err) {
    console.error(`[ERROR] Error processing PUT request: ${err.message}`);
    return new Response(
      JSON.stringify({ message: ` [ERROR] Internal server error.` }),
      { status: 500 }
    );
  }
}
