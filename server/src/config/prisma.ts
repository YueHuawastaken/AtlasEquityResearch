import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __atlasPrisma: PrismaClient | undefined;
}

export const prisma = globalThis.__atlasPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__atlasPrisma = prisma;
}
