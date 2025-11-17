import express from "express";
import { getUsuarios, crearUsuario } from "../controllers/usuariosController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", authMiddleware, getUsuarios);
router.post("/", crearUsuario);

export default router;
