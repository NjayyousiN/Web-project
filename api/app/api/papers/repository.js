import { promises as fs } from "fs";
import { nanoid } from "nanoid";

const path = "data/papers.json";

export async function createPaper(paper) {

	console.log(`[INFO] Creating paper with data: ${JSON.stringify(paper)}`);
	const data = await fs.readFile(path);
	const papers = JSON.parse(data);

	paper = {
			...paper,
			id: nanoid(),
			createdat: new Date()
	};
	papers.push(paper);

	await fs.writeFile(path, JSON.stringify(papers));
	console.log(`[INFO] Paper created with id: ${paper.id}`);

	return paper;
}

export async function readPapers(type) {
	console.log(`[INFO] Reading papers from file: ${path}`);
	const data = await fs.readFile(path);
	const papers = JSON.parse(data);
	console.log(`[INFO] Found ${papers.length} papers in file`);

	return papers;
}

export async function readPaper(id) {
	const data = await fs.readFile(path);
	const papers = JSON.parse(data);
	const paper = papers.find((paper) => paper.id === id);

	return paper;
}

//NEEDS MODIFICATIONS
export async function updatePaperReview(paperId, review) {
	console.log(`[INFO] Updating review for paper with id: ${paperId}`);
	console.log(`[INFO] Review:`, review);
  
	const data = await fs.readFile(path);
	const papers = JSON.parse(data);
  
	const paperIndex = papers.findIndex((paper) => paper.id === paperId);
  
	if (paperIndex === -1) {
	  throw Response.json(`Paper not found`);
	}
  
	// Update the review in the paper's reviews array
	const paper = papers[paperIndex];
	if (!paper.reviews) {
		// Initialize the reviews array 
	  paper.reviews = []; 
	}
	const existingReviewIndex = paper.reviews.findIndex(
	  (r) => r.reviewerId === review.reviewerId
	);
	if (existingReviewIndex >= 0) {
	  paper.reviews[existingReviewIndex] = review;
	} else {
	  paper.reviews.push(review);
	}
  
	// Save the updated papers list
	await fs.writeFile(path, JSON.stringify(papers));
	console.log(`[INFO] Review submitted for paper with id: ${paperId}`);
	return paper;
  }
  
