import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prismaClientSingleton = () => {
  // 1. Buat Adapter untuk PostgreSQL / Neon
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
  });

  // 2. Suntikkan adapter ke dalam Prisma Client
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;