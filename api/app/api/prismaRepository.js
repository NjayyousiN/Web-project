import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export async function createAuthor(author) {
  return prisma.articleAuthor.create({
    data: {
      firstName: author.firstName,
      lastName: author.lastName,
      affiliation: author.affiliation,
      email: author.email,
    }
  });
}

export async function readAuthors(type) {
  return prisma.articleAuthor.findMany({ where: { role: type } });
}

export async function readAuthor(id) {
  return prisma.articleAuthor.findUnique({ where: { id } });
}

export async function deleteAuthor(id) {
  return prisma.articleAuthor.delete({ where: { id } });
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
  return prisma.conferenceSchedule.update({
    where: { id: parseInt(id) }, data: {
      date: body.date,
      location: body.location,
      fromTime: body.FromTime,
      toTime: body.ToTime,
    }
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

export async function createPaper(paper) {
  const { authors, ...paperData } = paper;

  const createdPaper = await prisma.paper.create({
    data: {
      ...paperData,
      authors: {
        connect: authors.map(author => ({ id: author.id }))
      }
    },
  });

  return createdPaper;
}


export async function readPapers(type) {
  return prisma.paper.findMany({ where: { title: type } });
}

export async function readPaper(id) {
  return prisma.paper.findUnique({ where: { id } });
}

export async function updatePaperReview(paperId, review) {
  return prisma.paperReview.update({
    where: { paperId }, data: {
      evaluation: review.evaluation,
      contribution: review.contribution,
      strengths: review.strengths,
      weaknesses: review.weaknesses,

    }
  });
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

export async function readSchedules() {
  return prisma.conferenceSchedule.findMany();
}

export async function readSchedule(id) {
  return prisma.conferenceSchedule.findUnique({ where: { id: parseInt(id) } });
}

