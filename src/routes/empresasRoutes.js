import express from "express";
import {
  getEmpresas,
  getEmpresasByCategoria,
  updateEmpresa,
  deleteEmpresa,
  getHorariosByEmpresa,
  getEmpresaById,
  createEmpresa,
} from "../controllers/empresasController.js";

const router = express.Router();

router.get("/", getEmpresas);

router.get("/categoria/:categoriaId", getEmpresasByCategoria);

router.get("/horarios/:empresaId", getHorariosByEmpresa);

router.put("/:id", updateEmpresa);

router.delete("/:id", deleteEmpresa);

router.get("/:id", getEmpresaById);

router.post("/", createEmpresa);


export default router;
