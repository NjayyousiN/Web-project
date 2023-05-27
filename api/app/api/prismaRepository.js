import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();



     export async function createAuthor(author) {
      return prisma.user.create({ data: author });
    }
    
    export async function  readAuthors(type) {
      return prisma.user.findMany({ where: { role: type } });
    }
    
    export async function  readAuthor(id) {
      return prisma.user.findUnique({ where: { id } });
    }
    
    export async function  deleteAuthor(id) {
      return prisma.user.delete({ where: { id } });
    }
    
    export async function  createSchedule(body) {
      return prisma.conferenceSchedule.create({ data: body });
    }
    
    export async function  deleteSchedule(title) {
      return prisma.conferenceSchedule.delete({ where: { title } });
    }
    
    export async function  updateSchedule(title, body) {
      return prisma.conferenceSchedule.update({ where: { title }, data: body });
    }
    
    export async function  readConfDate() {
      return prisma.conferenceDate.findMany();
    }
    
    export async function  readInstitutions(type) {
      return prisma.institution.findMany({ where: { name: type } });
    }
    
    export async function  readLocation() {
      return prisma.conferenceLocation.findMany();
    }
    
    export async function  createPaper(paper) {
      return prisma.paper.create({ data: paper });
    }
    
    export async function  readPapers(type) {
      return prisma.paper.findMany({ where: { title: type } });
    }
    
    export async function  readPaper(id) {
      return prisma.paper.findUnique({ where: { id } });
    }
    
    export async function  updatePaperReview(paperId, review) {
      return prisma.paperReview.update({ where: { paperId }, data: review });
    }
    
    export async function  createUpload(attachedPdf) {
      return prisma.pdf.create({ data: attachedPdf });
    }
    
    export async function  readUpload() {
      return prisma.pdf.findMany();
    }
    
    export async function  readUploadByFilename(filename) {
      return prisma.pdf.findUnique({ where: { content: filename } });
    }
    
    export async function readUsers(role) {
      return prisma.user.findMany({ where: { role } });
    }

