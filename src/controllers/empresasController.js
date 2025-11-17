import pool from "../config/db.js";

export const getEmpresasByCategoria = async (req, res) => {
  const { categoriaId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM empresas WHERE categoria_id = $1",
      [categoriaId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener empresas por categoría" });
  }
};

export const getEmpresaById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM empresas WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener empresa por ID:", error);
    res.status(500).json({ message: "Error al obtener la empresa" });
  }
};


export const getEmpresas = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, c.nombre AS categoria 
       FROM empresas e 
       LEFT JOIN categorias c ON e.categoria_id = c.id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener empresas" });
  }
};


export const updateEmpresa = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    direccion,
    telefono,
    slogan,
    duracion_turno_min,
    categoria_id,
    admin_id,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE empresas
       SET nombre = $1, direccion = $2, telefono = $3, slogan = $4,
           duracion_turno_min = $5, categoria_id = $6, admin_id = $7
       WHERE id = $8
       RETURNING *`,
      [
        nombre,
        direccion,
        telefono,
        slogan,
        duracion_turno_min,
        categoria_id,
        admin_id,
        id,
      ]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Empresa no encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar empresa" });
  }
};

export const deleteEmpresa = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM empresas WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Empresa no encontrada" });
    res.json({ message: "Empresa eliminada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar empresa" });
  }
};


export const getHorariosByEmpresa = async (req, res) => {
  try {
    const { empresaId } = req.params;

    const result = await pool.query(
      `
      SELECT dia_semana, hora_inicio, hora_fin
      FROM horarios_empresa
      WHERE empresa_id = $1
      ORDER BY
        CASE 
          WHEN dia_semana = 'Lunes' THEN 1
          WHEN dia_semana = 'Martes' THEN 2
          WHEN dia_semana = 'Miércoles' THEN 3
          WHEN dia_semana = 'Jueves' THEN 4
          WHEN dia_semana = 'Viernes' THEN 5
          WHEN dia_semana = 'Sábado' THEN 6
          WHEN dia_semana = 'Domingo' THEN 7
        END;
      `,
      [empresaId]
    );

    const horarios = {};
    result.rows.forEach((h) => {
      const dia = h.dia_semana.trim();
      if (!horarios[dia]) horarios[dia] = [];
      const rango = `${h.hora_inicio}-${h.hora_fin}`;
      if (!horarios[dia].includes(rango)) {
        horarios[dia].push(rango);
      }
    });

    res.json(horarios);
  } catch (error) {
    console.error("Error al obtener horarios de la empresa:", error);
    res
      .status(500)
      .json({ message: "Error al obtener horarios de la empresa" });
  }
};


export const createEmpresa = async (req, res) => {
  const {
    nombre,
    direccion,
    telefono,
    slogan,
    duracion_turno_min,
    categoria_id,
    admin_id,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO empresas
      (nombre, direccion, telefono, slogan, duracion_turno_min, categoria_id, admin_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        nombre,
        direccion,
        telefono,
        slogan,
        duracion_turno_min,
        categoria_id,
        admin_id,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear empresa" });
  }
};
