import express from "express";
import { authRequired } from "../middlewares/authMiddleware.js";
import { roleRequired } from "../middlewares/roleMiddleware.js";
import { obtenerCarrito, agregarAlCarrito, actualizarCantidad, eliminarItem } from "../controllers/carritoController.js";

const router = express.Router();

router.get("/", authRequired, roleRequired("cliente"), obtenerCarrito);
router.post("/", authRequired, roleRequired("cliente"), agregarAlCarrito);
router.patch("/", authRequired, roleRequired("cliente"), actualizarCantidad);
router.delete("/:itemId", authRequired, roleRequired("cliente"), eliminarItem);

export default router;
