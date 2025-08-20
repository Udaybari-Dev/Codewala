import {PrismaClient} from "../generated/prisma/index.js";

const globalForPrisma = globalThis;

export const db = globalForPrisma.db || new PrismaClient({
    log: ['query', 'error', 'warn'], // helpful while debugging
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
 