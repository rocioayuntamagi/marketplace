import Usuario from "../models/Usuario.js";
import Producto from "../models/Producto.js";
import Pedido from "../models/Pedido.js";
import Subpedido from "../models/Subpedido.js";

// Ver todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-password");
    res.json(usuarios);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Activar usuario
export const activarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    usuario.activo = true;
    await usuario.save();

    res.json({ msg: "Usuario activado" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Desactivar usuario
export const desactivarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    usuario.activo = false;
    await usuario.save();

    res.json({ msg: "Usuario desactivado" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


// Ver todos los productos del marketplace
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find()
      .populate("proveedor", "nombre email");
    res.json(productos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const productosPorProveedor = async (req, res) => {
  try {
    const { proveedorId } = req.params;

    const productos = await Producto.find({ proveedor: proveedorId })
      .populate("proveedor", "nombre email");

    res.json(productos);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const activarProductoAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findById(id);
    if (!producto) return res.status(404).json({ msg: "Producto no encontrado" });

    producto.activo = true;
    await producto.save();

    res.json({ msg: "Producto activado por admin" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const desactivarProductoAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findById(id);
    if (!producto) return res.status(404).json({ msg: "Producto no encontrado" });

    producto.activo = false;
    await producto.save();

    res.json({ msg: "Producto desactivado por admin" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const productosDesactivados = async (req, res) => {
  try {
    const productos = await Producto.find({ activo: false })
      .populate("proveedor", "nombre email");

    res.json(productos);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const productosPocoStock = async (req, res) => {
  try {
    const productos = await Producto.find({ stock: { $lt: 5 } })
      .populate("proveedor", "nombre email");

    res.json(productos);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


// Ver todos los pedidos
export const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate("cliente", "nombre email")
      .sort({ createdAt: -1 });

    res.json(pedidos);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const pedidosPorCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;

    const pedidos = await Pedido.find({ cliente: clienteId })
      .populate("cliente", "nombre email")
      .sort({ createdAt: -1 });

    res.json(pedidos);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const pedidosPorProveedor = async (req, res) => {
  try {
    const { proveedorId } = req.params;

    const subpedidos = await Subpedido.find({ proveedor: proveedorId })
      .populate("pedido")
      .populate("items.producto", "nombre precio");

    res.json(subpedidos);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const detallePedidoAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findById(id)
      .populate("cliente", "nombre email");

    if (!pedido) {
      return res.status(404).json({ msg: "Pedido no encontrado" });
    }

    const subpedidos = await Subpedido.find({ pedido: id })
      .populate("proveedor", "nombre email")
      .populate("items.producto", "nombre precio descripcion");

    res.json({
      pedido,
      subpedidos
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const obtenerSubpedidos = async (req, res) => {
  try {
    const subpedidos = await Subpedido.find()
      .populate("pedido", "total estado createdAt")
      .populate("proveedor", "nombre email")
      .populate("items.producto", "nombre precio")
      .sort({ createdAt: -1 });

    res.json(subpedidos);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const subpedidosPorEstado = async (req, res) => {
  try {
    const { estado } = req.params;

    const subpedidos = await Subpedido.find({ estado })
      .populate("pedido", "total estado createdAt")
      .populate("proveedor", "nombre email")
      .populate("items.producto", "nombre precio");

    res.json(subpedidos);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const ventasTotales = async (req, res) => {
  try {
    const subpedidos = await Subpedido.find({ estado: "entregado" });

    let total = 0;
    subpedidos.forEach(sp => total += sp.items.reduce((acc, item) => acc + item.subtotal, 0));

    res.json({ totalVendido: total });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const ventasPorProveedor = async (req, res) => {
  try {
    const { proveedorId } = req.params;

    const subpedidos = await Subpedido.find({
      proveedor: proveedorId,
      estado: "entregado"
    });

    let total = 0;
    subpedidos.forEach(sp => total += sp.items.reduce((acc, item) => acc + item.subtotal, 0));

    res.json({ proveedorId, totalVendido: total });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const productosMasVendidos = async (req, res) => {
  try {
    const subpedidos = await Subpedido.find({ estado: "entregado" })
      .populate("items.producto", "nombre");

    const ranking = {};

    subpedidos.forEach(sp => {
      sp.items.forEach(item => {
        const nombre = item.producto.nombre;
        ranking[nombre] = (ranking[nombre] || 0) + item.cantidad;
      });
    });

    const ordenados = Object.entries(ranking)
      .sort((a, b) => b[1] - a[1])
      .map(([producto, cantidad]) => ({ producto, cantidad }));

    res.json(ordenados);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const pedidosPorMes = async (req, res) => {
  try {
    const pedidos = await Pedido.find();

    const meses = {};

    pedidos.forEach(p => {
      const mes = p.createdAt.getMonth() + 1;
      meses[mes] = (meses[mes] || 0) + 1;
    });

    res.json(meses);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const ingresosPorMes = async (req, res) => {
  try {
    const subpedidos = await Subpedido.find({ estado: "entregado" });

    const meses = {};

    subpedidos.forEach(sp => {
      const mes = sp.createdAt.getMonth() + 1;
      const totalSubpedido = sp.items.reduce((acc, item) => acc + item.subtotal, 0);

      meses[mes] = (meses[mes] || 0) + totalSubpedido;
    });

    res.json(meses);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
