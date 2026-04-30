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
