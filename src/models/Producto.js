import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  proveedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    default: ""
  },
  precio: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  imagen: {
    type: String,
    default: ""
  },
  activo: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model("Producto", productoSchema);
