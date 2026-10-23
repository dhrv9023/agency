import { PrismaClient } from '@prisma/client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — Prisma Client Singleton (Connection Pool Safe)
 * ==============================================================================
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  if (url.includes('[PASSWORD]') || url.includes('[REF]') || url.includes('[REGION]')) return false;
  return url.startsWith('postgresql://') || url.startsWith('postgres://');
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
