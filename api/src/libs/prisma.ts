import { PrismaClient } from "@prisma/client";

if (!Bun.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Force Prisma to use runtime DATABASE_URL by passing it directly
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: Bun.env.DATABASE_URL,
    },
  },
});

prisma.$connect().catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
  process.exit(1);
});
