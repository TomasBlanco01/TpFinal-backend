import pool from "../config/db.js";

export const getCategorias = async (req, res) => {
  const result = await pool.query("SELECT * FROM categorias ORDER BY nombre");
  res.json(result.rows);
};
