import mongoose from "mongoose";

const carritoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
    unique: true
  },
  items: [
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1
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
]
}, { timestamps: true });

export default mongoose.model("Carrito", carritoSchema);
