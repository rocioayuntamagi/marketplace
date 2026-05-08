import express from "express";
import { authRequired } from "../middlewares/authMiddleware.js";
import { roleRequired } from "../middlewares/roleMiddleware.js";
import { crearPedido, pedidosCliente, subpedidosProveedor, pedidosAdmin, cambiarEstadoSubpedido, seguimientoPedido } from "../controllers/pedidoController.js";


const router = express.Router();

// Cliente crea pedido
router.post("/", authRequired, roleRequired("cliente"), crearPedido);

// Cliente ve sus pedidos
router.get("/cliente", authRequired, roleRequired("cliente"), pedidosCliente);

// Proveedor ve sus subpedidos
router.get("/proveedor", authRequired, roleRequired("proveedor"), subpedidosProveedor);

// Admin ve todos los pedidos
router.get("/admin", authRequired, roleRequired("admin"), pedidosAdmin);

// Proveedor cambia estado de su subpedido
router.patch(
  "/subpedido/:id/estado",
  authRequired,
  roleRequired("proveedor"),
  cambiarEstadoSubpedido
);

// Seguimiento del pedido (cliente)
router.get(
  "/seguimiento/:pedidoId",
  authRequired,
  roleRequired("cliente"),
  seguimientoPedido
);



export default router;
