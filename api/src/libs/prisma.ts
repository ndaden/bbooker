import { PrismaClient } from "@prisma/client";

if (!Bun.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

console.log("Connecting to MongoDB with URL:", Bun.env.DATABASE_URL);

export const prisma = new PrismaClient();

prisma.$connect().catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
  process.exit(1);
});
