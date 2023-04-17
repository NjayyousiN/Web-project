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
