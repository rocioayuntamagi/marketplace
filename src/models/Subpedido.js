import mongoose from "mongoose";

const subpedidoSchema = new mongoose.Schema({
  pedido: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pedido",
    required: true
  },
  proveedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  items: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
        required: true
      },
      cantidad: {
        type: Number,
        required: true
      },
      precioUnitario: {
        type: Number,
        required: true
      },
      subtotal: {
        type: Number,
        required: true
      }
    }
  ],
  estado: {
    type: String,
    enum: ["pendiente", "preparando", "enviado", "entregado"],
    default: "pendiente"
  }
}, { timestamps: true });

export default mongoose.model("Subpedido", subpedidoSchema);
