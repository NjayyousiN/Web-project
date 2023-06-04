// import * as papersRepo from "../repository.js"
import { readPaper } from "../../prismaRepository.js";
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const authors = await readPaper(id);
    if (!authors) {
      return Response.json(
        { message: `[ERROR] Paper not found.` },
        { status: 404 }
      );
    }
    return Response.json(authors, { status: 200 });
  } catch (err) {
    console.error(err.message);
    return Response.json(
      { message: `[ERROR] Internal server error.` },
      { status: 500 }
    );
  }
}
