import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  try {
    await pool.connect();
    console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
  } catch (err) {
    console.error("❌ Error conectando a la BD:", err);
  }
});
