import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

// Perintah ini sangat penting agar process.env tidak kosong
dotenv.config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});