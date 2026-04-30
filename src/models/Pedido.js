import mongoose from "mongoose";

const pedidoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ["pendiente", "confirmado", "preparando", "enviado", "entregado"],
    default: "pendiente"
  }
}, { timestamps: true });

export default mongoose.model("Pedido", pedidoSchema);
