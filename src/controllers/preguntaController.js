import Pregunta from "../models/Pregunta.js";
import Producto from "../models/Producto.js";

// Cliente hace pregunta
export const crearPregunta = async (req, res) => {
  try {
    const { productoId, pregunta } = req.body;

    const producto = await Producto.findById(productoId);
    if (!producto) return res.status(404).json({ msg: "Producto no encontrado" });

    const nueva = new Pregunta({
      producto: productoId,
      cliente: req.user.id,
      proveedor: producto.proveedor,
      pregunta
    });

    await nueva.save();

    res.json({ msg: "Pregunta enviada. Espera respuesta del proveedor." });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Proveedor responde
export const responderPregunta = async (req, res) => {
  try {
    const { id } = req.params;
    const { respuesta } = req.body;

    const preg = await Pregunta.findById(id);
    if (!preg) return res.status(404).json({ msg: "Pregunta no encontrada" });

    if (preg.proveedor.toString() !== req.user.id) {
      return res.status(403).json({ msg: "No tienes permisos" });
    }

    preg.respuesta = respuesta;
    preg.estado = "respondida";
    await preg.save();

    res.json({ msg: "Respuesta enviada. Espera aprobación del admin." });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Admin aprueba o rechaza
export const moderarPregunta = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // aprobada o rechazada

    const preg = await Pregunta.findById(id);
    if (!preg) return res.status(404).json({ msg: "Pregunta no encontrada" });

    preg.estado = estado;
    await preg.save();

    res.json({ msg: "Pregunta moderada correctamente" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Listado público (solo aprobadas)
export const preguntasPublicas = async (req, res) => {
  try {
    const { productoId } = req.params;

    const preguntas = await Pregunta.find({
      producto: productoId,
      estado: "aprobada"
    });

    res.json(preguntas);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Preguntas pendientes para el proveedor logueado
export const preguntasPendientesProveedor = async (req, res) => {
  try {
    const preguntas = await Pregunta.find({
      proveedor: req.user.id,
      estado: { $in: ["pendiente", "respondida"] }
    })
    .populate("producto", "nombre precio")
    .populate("cliente", "nombre email");

    res.json(preguntas);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
