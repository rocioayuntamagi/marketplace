import express from "express";
import { authRequired } from "../middlewares/authMiddleware.js";
import { roleRequired } from "../middlewares/roleMiddleware.js";
import { crearProducto, listarProductos, misProductos, cambiarEstadoProducto } from "../controllers/productoController.js";

const router = express.Router();

// Crear producto (solo proveedores)
router.post("/", authRequired, roleRequired("proveedor"), crearProducto);

// Listado público
router.get("/", listarProductos);

// Mis productos (proveedor)
router.get("/mios", authRequired, roleRequired("proveedor"), misProductos);

// Pausar / activar producto
router.patch("/:id/estado", authRequired, roleRequired("proveedor"), cambiarEstadoProducto);

export default router;
