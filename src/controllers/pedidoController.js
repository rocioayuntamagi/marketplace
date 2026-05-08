import Carrito from "../models/Carrito.js";
import Pedido from "../models/Pedido.js";
import Subpedido from "../models/Subpedido.js";
import Producto from "../models/Producto.js";

// Crear pedido desde el carrito
export const crearPedido = async (req, res) => {
  try {
    const carrito = await Carrito.findOne({ cliente: req.user.id });

    if (!carrito || carrito.items.length === 0) {
      return res.status(400).json({ msg: "El carrito está vacío" });
    }

    // Calcular total
    const total = carrito.items.reduce((acc, item) => acc + item.subtotal, 0);

    // Crear pedido general
    const pedido = new Pedido({
      cliente: req.user.id,
      total
    });

    await pedido.save();

    // Agrupar items por proveedor
    const itemsPorProveedor = {};

    for (const item of carrito.items) {
      const producto = await Producto.findById(item.producto);

      if (!itemsPorProveedor[producto.proveedor]) {
        itemsPorProveedor[producto.proveedor] = [];
      }

      itemsPorProveedor[producto.proveedor].push({
        producto: item.producto,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        subtotal: item.subtotal
      });
    }

    // Crear subpedidos
    for (const proveedorId in itemsPorProveedor) {
      await Subpedido.create({
        pedido: pedido._id,
        proveedor: proveedorId,
        items: itemsPorProveedor[proveedorId]
      });
    }

    // Vaciar carrito
    carrito.items = [];
    await carrito.save();

    res.json({ msg: "Pedido creado correctamente", pedidoId: pedido._id });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Ver pedidos del cliente
export const pedidosCliente = async (req, res) => {
  try {
    const pedidos = await Pedido.find({ cliente: req.user.id });
    res.json(pedidos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Ver subpedidos del proveedor
export const subpedidosProveedor = async (req, res) => {
  try {
    const subpedidos = await Subpedido.find({ proveedor: req.user.id })
      .populate("pedido")
      .populate("items.producto");

    res.json(subpedidos);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Ver todos los pedidos (admin)
export const pedidosAdmin = async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.json(pedidos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Cambiar estado del subpedido
export const cambiarEstadoSubpedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const subpedido = await Subpedido.findById(id);

    if (!subpedido) {
      return res.status(404).json({ msg: "Subpedido no encontrado" });
    }

    // Solo el proveedor dueño puede cambiar el estado
    if (subpedido.proveedor.toString() !== req.user.id) {
      return res.status(403).json({ msg: "No autorizado" });
    }

    // Validar estado
    const estadosValidos = ["pendiente", "preparando", "enviado", "entregado"];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ msg: "Estado inválido" });
    }

    subpedido.estado = estado;
    await subpedido.save();

    res.json({ msg: "Estado actualizado", subpedido });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Seguimiento del pedido (cliente)
export const seguimientoPedido = async (req, res) => {
  try {
    const { pedidoId } = req.params;

    // Verificar que el pedido sea del cliente logueado
    const pedido = await Pedido.findOne({
      _id: pedidoId,
      cliente: req.user.id
    });

    if (!pedido) {
      return res.status(404).json({ msg: "Pedido no encontrado" });
    }

    // Traer subpedidos asociados
    const subpedidos = await Subpedido.find({ pedido: pedidoId })
      .populate("proveedor", "nombre email")
      .populate("items.producto", "nombre precio");

    res.json({
      pedido: {
        id: pedido._id,
        total: pedido.total,
        estado: pedido.estado,
        creado: pedido.createdAt
      },
      subpedidos
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Subpedidos del proveedor con filtros y orden
export const subpedidosProveedorFiltrados = async (req, res) => {
  try {
    const { estado, orden } = req.query;

    const filtro = { proveedor: req.user.id };

    if (estado) {
      filtro.estado = estado;
    }

    const sort = orden === "asc" ? { createdAt: 1 } : { createdAt: -1 };

    const subpedidos = await Subpedido.find(filtro)
      .populate("pedido", "total estado createdAt")
      .populate("items.producto", "nombre precio")
      .sort(sort);

    res.json(subpedidos);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Detalle de un subpedido
export const detalleSubpedido = async (req, res) => {
  try {
    const { id } = req.params;

    const subpedido = await Subpedido.findOne({
      _id: id,
      proveedor: req.user.id
    })
      .populate("pedido", "total estado createdAt")
      .populate("items.producto", "nombre precio descripcion imagen");

    if (!subpedido) {
      return res.status(404).json({ msg: "Subpedido no encontrado" });
    }

    res.json(subpedido);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Historial de ventas del proveedor
export const historialVentasProveedor = async (req, res) => {
  try {
    const subpedidos = await Subpedido.find({
      proveedor: req.user.id,
      estado: "entregado"
    }).populate("items.producto", "nombre precio");

    let totalVendido = 0;
    let cantidadPedidos = subpedidos.length;

    const productosVendidos = {};

    subpedidos.forEach(sp => {
      sp.items.forEach(item => {
        totalVendido += item.subtotal;

        if (!productosVendidos[item.producto.nombre]) {
          productosVendidos[item.producto.nombre] = 0;
        }

        productosVendidos[item.producto.nombre] += item.cantidad;
      });
    });

    res.json({
      totalVendido,
      cantidadPedidos,
      productosVendidos
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
