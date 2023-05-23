import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default class ProjectRepository {
 
     async  createAuthor(author) {
      return prisma.user.create({ data: author });
    }
    
     async  readAuthors(type) {
      return prisma.user.findMany({ where: { role: type } });
    }
    
     async  readAuthor(id) {
      return prisma.user.findUnique({ where: { id } });
    }
    
     async  deleteAuthor(id) {
      return prisma.user.delete({ where: { id } });
    }
    
     async  createSchedule(body) {
      return prisma.conferenceSchedule.create({ data: body });
    }
    
     async  deleteSchedule(title) {
      return prisma.conferenceSchedule.delete({ where: { title } });
    }
    
     async  updateSchedule(title, body) {
      return prisma.conferenceSchedule.update({ where: { title }, data: body });
    }
    
     async  readConfDate() {
      return prisma.conferenceDate.findMany();
    }
    
     async  readInstitutions(type) {
      return prisma.institution.findMany({ where: { name: type } });
    }
    
     async  readLocation() {
      return prisma.conferenceLocation.findMany();
    }
    
     async  createPaper(paper) {
      return prisma.paper.create({ data: paper });
    }
    
     async  readPapers(type) {
      return prisma.paper.findMany({ where: { title: type } });
    }
    
     async  readPaper(id) {
      return prisma.paper.findUnique({ where: { id } });
    }
    
     async  updatePaperReview(paperId, review) {
      return prisma.paperReview.update({ where: { paperId }, data: review });
    }
    
     async  createUpload(attachedPdf) {
      return prisma.pdf.create({ data: attachedPdf });
    }
    
     async  readUpload() {
      return prisma.pdf.findMany();
    }
    
     async  readUploadByFilename(filename) {
      return prisma.pdf.findUnique({ where: { content: filename } });
    }
    
     async readUsers(role) {
      return prisma.user.findMany({ where: { role } });
    }
    

    //  async getNumberOfPapers() {
    //     const total = await prisma.paper.count();
    //     const accepted = await prisma.paper.count({ where: { status: 'accepted' } });
    //     const rejected = await prisma.paper.count({ where: { status: 'rejected' } });
      
    //     return { total, accepted, rejected };
    //   }
      
    //    async getAverageAuthorsPerPaper() {
    //     const result = await prisma.user.aggregate({
    //       _groupBy: { paperId: true },
    //       _avg: { id: true }
    //     });
      
    //     return result._avg.id || 0;
    //   }
      
    //    async getNumberOfConferenceSessions() {
    //     const count = await prisma.conferenceSchedule.count();
      
    //     return count;
    //   }
      
    //    async getAveragePresentationsPerSession() {
    //     const result = await prisma.conferenceSchedule.aggregate({
    //       _count: { id: true },
    //       _avg: { presentationsCount: true }
    //     });
      
    //     return result._avg.presentationsCount || 0;
    //   }


        // async clearDatabase() {
        //     try {
        //         // Delete all data from each model in the reverse order of their dependencies
        //         await prisma.paperReview.deleteMany();
        //         await prisma.articleAuthor.deleteMany();
        //         await prisma.user.deleteMany();
        //         await prisma.paper.deleteMany();
        //         await prisma.conferenceSchedule.deleteMany();
        //         await prisma.pdf.deleteMany();
        //         await prisma.conferenceLocation.deleteMany();
        //         await prisma.institution.deleteMany();
        //         await prisma.conferenceDate.deleteMany();

        //         console.log('[INFO] Database cleared successfully.');
        //     } catch (err) {
        //         console.error('[ERROR] Error clearing database:', err);
        //     } finally {
        //         await prisma.$disconnect();
        //     }
        // }
  }

const repository = new ProjectRepository();

