import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Yuehua0132374h!", 10);

  await prisma.user.upsert({
    where: {
      email: "yu3hua@gmail.com",
    },
    update: { passwordHash,
    role: "admin",},
    create: {
      email: "yu3hua@gmail.com",
      name: "Yue Hua",
      passwordHash,
      role: "admin",
    },
  });

  console.log("Admin created");
}

main()
  .finally(() => prisma.$disconnect());