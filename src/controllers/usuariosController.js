import bcrypt from "bcryptjs";
import pool from "../config/db.js";

export const getUsuarios = async (req, res) => {
  const result = await pool.query("SELECT id, nombre, email, rol FROM usuarios");
  res.json(result.rows);
};

export const crearUsuario = async (req, res) => {
  const { nombre, email, contraseña, rol } = req.body;
  try {
    const hash = await bcrypt.hash(contraseña, 10);
    await pool.query(
      "INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES ($1, $2, $3, $4)",
      [nombre, email, hash, rol]
    );
    res.status(201).json({ mensaje: "Usuario creado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creando usuario" });
  }
};
