import { PrismaClient } from "@prisma/client";
import { IncrementalCache } from "next/dist/server/lib/incremental-cache";
const prisma = new PrismaClient();

export async function createAuthor(author) {
  return prisma.articleAuthor.create({
    data: {
      firstName: author.firstName,
      lastName: author.lastName,
      affiliation: author.affiliation,
      email: author.email,
    },
  });
}

export async function readAuthors(type) {
  return prisma.articleAuthor.findMany({
    where: { role: type },
    include: {
      firstName: true,
      lastName: true,
    },
  });
}

export async function readAuthor(id) {
  return prisma.articleAuthor.findUnique({
    where: { id },
    include: {
      firstName: true,
      lastName: true,
    },
  });
}

export async function deleteAuthor(id) {
  return prisma.articleAuthor.delete({ where: { id } });
}

export async function readSchedules() {
  return prisma.conferenceSchedule.findMany({});
}

export async function readSchedule(id) {
  const found = prisma.conferenceSchedule.findUnique({
    where: { id: parseInt(id) },
  });

  if (!found) {
    return false;
  }

  return found;
}

export async function createSchedule(body) {
  return prisma.conferenceSchedule.create({ data: body });
}

export async function deleteSchedule(id) {
  try {
    const schedule = await prisma.conferenceSchedule.delete({
      where: { id: parseInt(id) },
    });
    return schedule;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

export async function updateSchedule(id, body) {
  const found = await prisma.conferenceSchedule.findUnique({
    where: { id: parseInt(id) },
  });
  if (!found) {
    return false;
  }

  return prisma.conferenceSchedule.update({
    where: { id: parseInt(id) },
    data: {
      date: body.date,
      location: body.location,
      fromTime: body.FromTime,
      toTime: body.ToTime,
    },
  });
}

export async function readConfDate() {
  return prisma.conferenceDate.findMany();
}

export async function readInstitutions(type) {
  return prisma.institution.findMany({ where: { name: type } });
}

export async function readLocation() {
  return prisma.conferenceLocation.findMany();
}
// not working yet
export async function createPaper(paper) {
  const { authors, ...paperData } = paper;

  const createdPaper = await prisma.paper.create({
    data: {
      ...paperData,
      authors: {
        connect: authors.map((author) => ({ id: author.id })),
      },
    },
  });

  return createdPaper;
}

export async function readPapers(type) {
  return prisma.paper.findMany({
    where: { title: type },
    include: {
      authors: true,
      presenter: true,
      reviewers: true,
      reviews: true,
    },
  });
}

export async function readPaper(id) {
  return prisma.paper.findUnique({
    where: { id },
    include: { authors: true, presenter: true, reviewers: true, reviews: true },
  });
}
// wokring but need to be checked again
export async function updatePaperReview(paperId, review) {
  try {
    // Check if a review for the given paperId and reviewerId exists
    const existingReview = await prisma.paperReview.findFirst({
      where: {
        paperId: paperId,
        reviewerId: parseInt(review.reviewerId),
      },
    });

    if (existingReview) {
      // If a review exists, update it with the new review data
      const updatedReview = await prisma.paperReview.update({
        where: {
          id: existingReview.id,
        },
        data: {
          evaluation: review.evaluation,
          contribution: review.contribution,
          strengths: review.strengths,
          weaknesses: review.weaknesses,
        },
      });

      return updatedReview;
    } else {
      // If a review doesn't exist, create a new review
      const createdReview = await prisma.paperReview.create({
        data: {
          evaluation: review.evaluation,
          contribution: review.contribution,
          strengths: review.strengths,
          weaknesses: review.weaknesses,
          paper: {
            connect: { id: paperId },
          },
          reviewer: {
            connect: { id: parseInt(review.reviewerId) },
          },
        },
      });

      return createdReview;
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error updating/creating paper review:", error);
    throw error;
  }
}

export async function createUpload(attachedPdf) {
  return prisma.pdf.create({ data: attachedPdf });
}

export async function readUpload() {
  return prisma.pdf.findMany();
}

export async function readUploadByFilename(filename) {
  return prisma.pdf.findUnique({ where: { content: filename } });
}

export async function readUsers(role) {
  return prisma.user.findMany({ where: { role } });
}
