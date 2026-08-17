import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function isNeonUrl(url: string) {
  return url.includes("neon.tech") || url.includes(".neon.");
}

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const log = process.env.NODE_ENV === "development" ? (["error", "warn"] as const) : (["error"] as const);

  if (isNeonUrl(connectionString)) {
    return new PrismaClient({
      adapter: new PrismaNeon({ connectionString }),
      log: [...log],
    });
  }

  return new PrismaClient({ log: [...log] });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
