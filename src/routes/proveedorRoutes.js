import express from "express";
import { authRequired } from "../middlewares/authMiddleware.js";
import { roleRequired } from "../middlewares/roleMiddleware.js";
import { crearProveedor, listarProveedores, cambiarEstadoProveedor } from "../controllers/proveedorController.js";
import { productosProveedor, activarProducto, desactivarProducto, actualizarStock, actualizarPrecio, editarProducto} from "../controllers/proveedorController.js";
import {subpedidosProveedorFiltrados, detalleSubpedido, historialVentasProveedor} from "../controllers/pedidoController.js";
import { preguntasProveedor,preguntasPendientesProveedor, responderPregunta} from "../controllers/proveedorController.js";


const router = express.Router();

// Enviar solicitud de proveedor
router.post("/", authRequired, crearProveedor);

// Listar proveedores (admin)
router.get("/", authRequired, roleRequired("admin"), listarProveedores);

// Cambiar estado (admin)
router.patch("/:id/estado", authRequired, roleRequired("admin"), cambiarEstadoProveedor);


router.get("/productos", authRequired, roleRequired("proveedor"), productosProveedor);

router.patch("/producto/:id/activar", authRequired, roleRequired("proveedor"), activarProducto);
router.patch("/producto/:id/desactivar", authRequired, roleRequired("proveedor"), desactivarProducto);

router.patch("/producto/:id/stock", authRequired, roleRequired("proveedor"), actualizarStock);
router.patch("/producto/:id/precio", authRequired, roleRequired("proveedor"), actualizarPrecio);

router.patch("/producto/:id/editar", authRequired, roleRequired("proveedor"), editarProducto);

// Subpedidos con filtros
router.get("/subpedidos", authRequired, roleRequired("proveedor"), subpedidosProveedorFiltrados);

// Detalle de un subpedido
router.get( "/subpedido/:id", authRequired, roleRequired("proveedor"), detalleSubpedido);

// Historial de ventas
router.get("/ventas/historial", authRequired, roleRequired("proveedor"), historialVentasProveedor);

// Ver todas las preguntas
router.get("/preguntas",authRequired,roleRequired("proveedor"),preguntasProveedor);

// Ver preguntas pendientes
router.get("/preguntas/pendientes",authRequired,roleRequired("proveedor"),preguntasPendientesProveedor);

// Responder pregunta
router.patch("/pregunta/:id/responder",authRequired,roleRequired("proveedor"),responderPregunta);

export default router;
