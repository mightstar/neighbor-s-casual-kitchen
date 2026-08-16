import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "guest@neighbors.kitchen";
  const passwordHash = await hash("Neighbor123", 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Lake Highlands Guest",
      email,
      passwordHash,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
