import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import categoriasRoutes from "./routes/categoriasRoutes.js";
import empresasRoutes from "./routes/empresasRoutes.js";
import turnosRoutes from "./routes/turnosRoutes.js";

dotenv.config();
const app = express();

app.get("/", (req, res) => {
  res.send("✅ Backend corriendo correctamente");
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/empresas", empresasRoutes);
app.use("/api/turnos", turnosRoutes);

export default app;
