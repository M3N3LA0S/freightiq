import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");
  // ProductDimension seed will be added in Phase 2
  console.log("Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => void prisma.$disconnect());
