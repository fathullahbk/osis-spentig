import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  // Menunjuk ke lokasi file schema kamu
  schema: 'prisma/schema.prisma',
  
  // Memindahkan pengaturan URL dari schema.prisma ke sini
  datasource: {
    //url: env('DATABASE_URL'),
    url: env('DIRECT_URL'),
    //directUrl: env('DIRECT_URL'),
  },
});