import mongoose from "mongoose";

const proveedorSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  nombreComercial: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    default: ""
  },
  telefono: {
    type: String,
    default: ""
  },
  estado: {
    type: String,
    enum: ["pendiente", "aprobado", "rechazado"],
    default: "pendiente"
  }
}, { timestamps: true });

export default mongoose.model("Proveedor", proveedorSchema);
