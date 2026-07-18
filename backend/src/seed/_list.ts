import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, fullName: true, email: true, role: true, status: true } });
  console.log(JSON.stringify(users, null, 2));
  const campuses = await prisma.campus.findMany().catch(() => null);
  console.log('CAMPUSES', JSON.stringify(campuses, null, 2));
}

main().finally(() => prisma.$disconnect());
