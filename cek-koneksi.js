const { Client } = require('pg');

// Ganti URL di bawah dengan URL yang Anda punya (pakai tanda kutip)
const connectionString = "postgresql://neondb_owner:npg_xpDgnJ2KWbX0@ep-royal-mountain-a106upio-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

const client = new Client({ connectionString });

client.connect()
  .then(() => {
    console.log("✅ Mantap! Koneksi ke Neon Berhasil.");
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log("Waktu Server:", res.rows[0].now);
    process.exit();
  })
  .catch(err => {
    console.error("❌ Waduh, Gagal:", err.stack);
    process.exit(1);
  });