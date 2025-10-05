import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const connectDB = async () => {
  console.log('connecting to database (Prisma)...');
  try {
    await prisma.$connect();
    console.log('Prisma connected');
  } catch (error) {
    console.error('Prisma connection error:', error);
    process.exit(1);
  }
};

export { prisma };
export default connectDB;
