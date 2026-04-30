import mongoose from "mongoose";

const preguntaSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producto",
    required: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  proveedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  pregunta: {
    type: String,
    required: true
  },
  respuesta: {
    type: String,
    default: ""
  },
  estado: {
    type: String,
    enum: ["pendiente", "respondida", "aprobada", "rechazada"],
    default: "pendiente"
  }
}, { timestamps: true });

export default mongoose.model("Pregunta", preguntaSchema);
