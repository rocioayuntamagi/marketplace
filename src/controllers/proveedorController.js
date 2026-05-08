import Proveedor from "../models/Proveedor.js";
import Usuario from "../models/Usuario.js";
import Producto from "../models/Producto.js";

// Crear solicitud de proveedor
export const crearProveedor = async (req, res) => {
  try {
    const { nombreComercial, direccion, telefono } = req.body;

    // Verificar si ya tiene solicitud
    const existe = await Proveedor.findOne({ usuario: req.user.id });
    if (existe) {
      return res.status(400).json({ msg: "Ya tienes una solicitud enviada" });
    }

    const nuevo = new Proveedor({
      usuario: req.user.id,
      nombreComercial,
      direccion,
      telefono
    });

    await nuevo.save();

    res.json({ msg: "Solicitud enviada. Espera aprobación del administrador." });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Listar proveedores (admin)
export const listarProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.find().populate("usuario", "nombre email rol");
    res.json(proveedores);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Cambiar estado (admin)
export const cambiarEstadoProveedor = async (req, res) => {
  try {
    const { estado } = req.body;
    const { id } = req.params;

    const proveedor = await Proveedor.findById(id);
    if (!proveedor) {
      return res.status(404).json({ msg: "Proveedor no encontrado" });
    }

    proveedor.estado = estado;
    await proveedor.save();

    // Actualizar rol del usuario si es aprobado
    if (estado === "aprobado") {
      await Usuario.findByIdAndUpdate(proveedor.usuario, { rol: "proveedor" });
    }

    res.json({ msg: "Estado actualizado correctamente" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Ver productos del proveedor
export const productosProveedor = async (req, res) => {
  try {
    const productos = await Producto.find({ proveedor: req.user.id });
    res.json(productos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Activar producto
export const activarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findOne({
      _id: id,
      proveedor: req.user.id
    });

    if (!producto) return res.status(404).json({ msg: "Producto no encontrado" });

    producto.activo = true;
    await producto.save();

    res.json({ msg: "Producto activado" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Desactivar producto
export const desactivarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findOne({
      _id: id,
      proveedor: req.user.id
    });

    if (!producto) return res.status(404).json({ msg: "Producto no encontrado" });

    producto.activo = false;
    await producto.save();

    res.json({ msg: "Producto desactivado" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Actualizar stock
export const actualizarStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const producto = await Producto.findOne({
      _id: id,
      proveedor: req.user.id
    });

    if (!producto) return res.status(404).json({ msg: "Producto no encontrado" });

    producto.stock = stock;
    await producto.save();

    res.json({ msg: "Stock actualizado" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Actualizar precio
export const actualizarPrecio = async (req, res) => {
  try {
    const { id } = req.params;
    const { precio } = req.body;

    const producto = await Producto.findOne({
      _id: id,
      proveedor: req.user.id
    });

    if (!producto) return res.status(404).json({ msg: "Producto no encontrado" });

    producto.precio = precio;
    await producto.save();

    res.json({ msg: "Precio actualizado" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Editar nombre/descripcion
export const editarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const producto = await Producto.findOne({
      _id: id,
      proveedor: req.user.id
    });

    if (!producto) return res.status(404).json({ msg: "Producto no encontrado" });

    if (nombre) producto.nombre = nombre;
    if (descripcion) producto.descripcion = descripcion;

    await producto.save();

    res.json({ msg: "Producto actualizado" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

import Pregunta from "../models/Pregunta.js";

// Ver todas las preguntas del proveedor
export const preguntasProveedor = async (req, res) => {
  try {
    const preguntas = await Pregunta.find({ proveedor: req.user.id })
      .populate("producto", "nombre imagen precio")
      .populate("cliente", "nombre email");

    res.json(preguntas);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const preguntasPendientesProveedor = async (req, res) => {
  try {
    const preguntas = await Pregunta.find({
      proveedor: req.user.id,
      respuesta: null
    })
      .populate("producto", "nombre imagen precio")
      .populate("cliente", "nombre email");

    res.json(preguntas);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const responderPregunta = async (req, res) => {
  try {
    const { id } = req.params;
    const { respuesta } = req.body;

    const pregunta = await Pregunta.findOne({
      _id: id,
      proveedor: req.user.id
    });

    if (!pregunta) {
      return res.status(404).json({ msg: "Pregunta no encontrada" });
    }

    pregunta.respuesta = respuesta;
    pregunta.respondidaEn = new Date();

    await pregunta.save();

    res.json({ msg: "Respuesta enviada", pregunta });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
