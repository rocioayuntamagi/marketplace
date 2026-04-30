import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ["cliente", "proveedor", "admin"],
    default: "cliente"
  },
  estadoProveedor: {
    type: String,
    enum: ["pendiente", "aprobado", "rechazado"],
    default: "pendiente"
  }
}, { timestamps: true });

export default mongoose.model("Usuario", usuarioSchema);
