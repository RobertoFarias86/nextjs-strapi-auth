import { PrismaClient } from '@prisma/client';

// Evita recriar o client em dev (hot-reload)
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;