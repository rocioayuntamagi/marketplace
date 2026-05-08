import express from "express";
import { authRequired } from "../middlewares/authMiddleware.js";
import { roleRequired } from "../middlewares/roleMiddleware.js";
import { obtenerUsuarios, activarUsuario, desactivarUsuario} from "../controllers/adminController.js";
import { obtenerProductos, productosPorProveedor, activarProductoAdmin, desactivarProductoAdmin, productosDesactivados, productosPocoStock} from "../controllers/adminController.js";
import {obtenerPedidos, pedidosPorCliente, pedidosPorProveedor, detallePedidoAdmin, obtenerSubpedidos, subpedidosPorEstado} from "../controllers/adminController.js";
import { ventasTotales, ventasPorProveedor, productosMasVendidos, pedidosPorMes, ingresosPorMes } from "../controllers/adminController.js";


const router = express.Router();

// Ver todos los usuarios
router.get( "/usuarios", authRequired, roleRequired("admin"), obtenerUsuarios );

// Activar usuario
router.patch(
  "/usuario/:id/activar",
  authRequired,
  roleRequired("admin"),
  activarUsuario
);

// Desactivar usuario
router.patch(
  "/usuario/:id/desactivar",
  authRequired,
  roleRequired("admin"),
  desactivarUsuario
);

// Ver todos los productos
router.get(
  "/productos",
  authRequired,
  roleRequired("admin"),
  obtenerProductos
);

// Ver productos por proveedor
router.get(
  "/productos/proveedor/:proveedorId",
  authRequired,
  roleRequired("admin"),
  productosPorProveedor
);

// Activar producto
router.patch(
  "/producto/:id/activar",
  authRequired,
  roleRequired("admin"),
  activarProductoAdmin
);

// Desactivar producto
router.patch(
  "/producto/:id/desactivar",
  authRequired,
  roleRequired("admin"),
  desactivarProductoAdmin
);

// Ver productos desactivados
router.get(
  "/productos/desactivados",
  authRequired,
  roleRequired("admin"),
  productosDesactivados
);

// Ver productos con poco stock
router.get(
  "/productos/poco-stock",
  authRequired,
  roleRequired("admin"),
  productosPocoStock
);

// Pedidos
router.get("/pedidos", authRequired, roleRequired("admin"), obtenerPedidos);
router.get("/pedidos/cliente/:clienteId", authRequired, roleRequired("admin"), pedidosPorCliente);
router.get("/pedidos/proveedor/:proveedorId", authRequired, roleRequired("admin"), pedidosPorProveedor);
router.get("/pedido/:id", authRequired, roleRequired("admin"), detallePedidoAdmin);

// Subpedidos
router.get("/subpedidos", authRequired, roleRequired("admin"), obtenerSubpedidos);
router.get("/subpedidos/estado/:estado", authRequired, roleRequired("admin"), subpedidosPorEstado);

// Estadísticas
router.get("/stats/ventas-totales", authRequired, roleRequired("admin"), ventasTotales);
router.get("/stats/ventas-proveedor/:proveedorId", authRequired, roleRequired("admin"), ventasPorProveedor);
router.get("/stats/productos-mas-vendidos", authRequired, roleRequired("admin"), productosMasVendidos);
router.get("/stats/pedidos-mes", authRequired, roleRequired("admin"), pedidosPorMes);
router.get("/stats/ingresos-mes", authRequired, roleRequired("admin"), ingresosPorMes);



export default router;
