import pool from "../config/db.js";

export const reservarTurno = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { empresa_id, fecha, hora } = req.body;

    if (!empresa_id || !fecha || !hora) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const existe = await pool.query(
      "SELECT * FROM turnos WHERE empresa_id = $1 AND fecha = $2 AND hora = $3",
      [empresa_id, fecha, hora]
    );

    if (existe.rowCount > 0 && existe.rows[0].estado === "ocupado") {
      return res.status(400).json({ message: "Turno ya ocupado" });
    }

    if (existe.rowCount === 0) {
      await pool.query(
        "INSERT INTO turnos (empresa_id, usuario_id, fecha, hora, estado) VALUES ($1, $2, $3, $4, 'ocupado')",
        [empresa_id, usuarioId, fecha, hora]
      );
    } else {
      await pool.query(
        "UPDATE turnos SET usuario_id = $1, estado = 'ocupado' WHERE id = $2",
        [usuarioId, existe.rows[0].id]
      );
    }

    res.json({ message: "Turno reservado correctamente" });
  } catch (err) {
    console.error("❌ Error reservando turno:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getMisTurnos = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT 
        t.id,
        t.fecha,
        t.hora,
        t.estado,
        e.nombre AS empresa_nombre
      FROM turnos t
      JOIN empresas e ON e.id = t.empresa_id
      WHERE t.usuario_id = $1
      ORDER BY t.fecha ASC, t.hora ASC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener mis turnos:", error);
    res.status(500).json({ error: "Error al obtener turnos" });
  }
};

export const getTurnosOcupados = async (req, res) => {
  try {
    const { empresa_id, fecha } = req.query;

    if (!empresa_id || !fecha) {
      return res.status(400).json({ message: "Faltan parámetros empresa_id o fecha" });
    }

    const result = await pool.query(
      "SELECT hora FROM turnos WHERE empresa_id = $1 AND fecha = $2 AND estado = 'ocupado'",
      [empresa_id, fecha]
    );

    res.json(result.rows.map(r => ({ hora: r.hora.slice(0,5) })));
  } catch (error) {
    console.error("Error obteniendo turnos ocupados:", error);
    res.status(500).json({ message: "Error al obtener turnos ocupados" });
  }
};

export const cancelarTurno = async (req, res) => {
  try {
    const turnoId = req.params.id;
    const userId = req.user.id;

    const turno = await pool.query(
      "SELECT * FROM turnos WHERE id = $1 AND usuario_id = $2",
      [turnoId, userId]
    );

    if (turno.rowCount === 0) {
      return res.status(404).json({ message: "Turno no encontrado o no autorizado" });
    }

    await pool.query("DELETE FROM turnos WHERE id = $1", [turnoId]);

    res.json({ message: "Turno cancelado correctamente" });
  } catch (err) {
    console.error("❌ Error cancelando turno:", err);
    res.status(500).json({ message: "Error interno" });
  }
};
