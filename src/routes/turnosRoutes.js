import express from "express";
import {
  reservarTurno,
  getMisTurnos,
  getTurnosOcupados,
  cancelarTurno
} from "../controllers/turnosController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/reservar", authMiddleware, reservarTurno);
router.get("/mis-turnos", authMiddleware, getMisTurnos);
router.get("/ocupados", getTurnosOcupados);
router.delete("/cancelar/:id", authMiddleware, cancelarTurno);

export default router;
