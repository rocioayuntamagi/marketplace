import express from "express";
import { authRequired } from "../middlewares/authMiddleware.js";
import { roleRequired } from "../middlewares/roleMiddleware.js";
import { crearProveedor, listarProveedores, cambiarEstadoProveedor } from "../controllers/proveedorController.js";

const router = express.Router();

// Enviar solicitud de proveedor
router.post("/", authRequired, crearProveedor);

// Listar proveedores (admin)
router.get("/", authRequired, roleRequired("admin"), listarProveedores);

// Cambiar estado (admin)
router.patch("/:id/estado", authRequired, roleRequired("admin"), cambiarEstadoProveedor);

export default router;
