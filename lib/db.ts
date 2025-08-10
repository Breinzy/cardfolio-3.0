import { PrismaClient } from "@prisma/client";

declare global {
  // Using var on purpose to allow hot-reload reuse in dev
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}


