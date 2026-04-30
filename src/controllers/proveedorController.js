import Proveedor from "../models/Proveedor.js";
import Usuario from "../models/Usuario.js";

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
