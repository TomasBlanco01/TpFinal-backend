import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(client => {
    console.log("✅ Conectado a la base de datos PostgreSQL");
    client.release();
  })
  .catch(err => {
    console.error("❌ Error al conectar con la base de datos:", err.message);
  });

export default pool;