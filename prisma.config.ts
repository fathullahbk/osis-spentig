import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // Kita arahkan url ke environment variable DATABASE_URL
    url: process.env.DATABASE_URL,
  },
});