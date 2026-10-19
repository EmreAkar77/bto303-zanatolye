import { PrismaClient } from '@prisma/client';

// Next.js hot reload esnasında bağlantı havuzunun tükenmesini önleyen tekil (singleton) Prisma istemcisi
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
