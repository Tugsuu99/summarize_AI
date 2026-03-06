import { PrismaClient } from "@prisma/client/extension";
import { PrismaPg } from "@prisma/adapter-pg";
import { connection } from "next/server";

const adapter = new PrismaPg({
  connectionString: process.env.PRISMA_DATABASE_URL,
});
const prisma = new PrismaClient({
  adapter,
});

export default prisma;
