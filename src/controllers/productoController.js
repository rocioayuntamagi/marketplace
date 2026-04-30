import Producto from "../models/Producto.js";

// Crear producto (solo proveedor aprobado)
export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, imagen } = req.body;

    const nuevo = new Producto({
      proveedor: req.user.id,
      nombre,
      descripcion,
      precio,
      stock,
      imagen
    });

    await nuevo.save();

    res.json({ msg: "Producto creado correctamente" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Listar productos públicos
export const listarProductos = async (req, res) => {
  try {
    const productos = await Producto.find({ activo: true }).populate("proveedor", "nombre email");
    res.json(productos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Listar productos del proveedor logueado
export const misProductos = async (req, res) => {
  try {
    const productos = await Producto.find({ proveedor: req.user.id });
    res.json(productos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Pausar o activar producto
export const cambiarEstadoProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    if (producto.proveedor.toString() !== req.user.id) {
      return res.status(403).json({ msg: "No tienes permisos" });
    }

    producto.activo = !producto.activo;
    await producto.save();

    res.json({ msg: "Estado actualizado" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
