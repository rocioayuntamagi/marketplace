import Carrito from "../models/Carrito.js";
import Producto from "../models/Producto.js";

// Obtener carrito del cliente
export const obtenerCarrito = async (req, res) => {
  try {
    let carrito = await Carrito.findOne({ cliente: req.user.id }).populate("items.producto");

    if (!carrito) {
      carrito = new Carrito({ cliente: req.user.id, items: [] });
      await carrito.save();
    }

    res.json(carrito);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Agregar producto al carrito
export const agregarAlCarrito = async (req, res) => {
  try {
    const { productoId, cantidad } = req.body;

    const producto = await Producto.findById(productoId);
    if (!producto) return res.status(404).json({ msg: "Producto no encontrado" });

    let carrito = await Carrito.findOne({ cliente: req.user.id });

    if (!carrito) {
      carrito = new Carrito({ cliente: req.user.id, items: [] });
    }

    const itemExistente = carrito.items.find(
      (i) => i.producto.toString() === productoId
    );

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.precioUnitario;
    } else {
      carrito.items.push({
        producto: productoId,
        cantidad,
        precioUnitario: producto.precio,
        subtotal: producto.precio * cantidad
      });
    }

    await carrito.save();

    res.json({ msg: "Producto agregado al carrito" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Actualizar cantidad
export const actualizarCantidad = async (req, res) => {
  try {
    const { itemId, cantidad } = req.body;

    const carrito = await Carrito.findOne({ cliente: req.user.id });
    if (!carrito) return res.status(404).json({ msg: "Carrito no encontrado" });

    const item = carrito.items.id(itemId);
    if (!item) return res.status(404).json({ msg: "Item no encontrado" });

    item.cantidad = cantidad;
    item.subtotal = cantidad * item.precioUnitario;

    await carrito.save();

    res.json({ msg: "Cantidad actualizada" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Eliminar item
export const eliminarItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const carrito = await Carrito.findOne({ cliente: req.user.id });
    if (!carrito) return res.status(404).json({ msg: "Carrito no encontrado" });

    carrito.items = carrito.items.filter((i) => i._id.toString() !== itemId);

    await carrito.save();

    res.json({ msg: "Item eliminado" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
