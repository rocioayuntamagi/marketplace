import express from "express";
import { authRequired } from "../middlewares/authMiddleware.js";
import { roleRequired } from "../middlewares/roleMiddleware.js";
import { crearPregunta, responderPregunta, moderarPregunta, preguntasPublicas, preguntasPendientesProveedor } from "../controllers/preguntaController.js";

const router = express.Router();

// Cliente pregunta
router.post("/", authRequired, roleRequired("cliente"), crearPregunta);

// Proveedor responde
router.patch("/:id/responder", authRequired, roleRequired("proveedor"), responderPregunta);

// Admin modera
router.patch("/:id/moderar", authRequired, roleRequired("admin"), moderarPregunta);

// Público: ver preguntas aprobadas
router.get("/:productoId", preguntasPublicas);

// Preguntas pendientes del proveedor
router.get(
  "/proveedor/pendientes",
  authRequired,
  roleRequired("proveedor"),
  preguntasPendientesProveedor
);


export default router;
