import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch(err => console.error("❌ Error MongoDB:", err));

// Rutas
import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import proveedorRoutes from "./routes/proveedorRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";
import preguntaRoutes from "./routes/preguntaRoutes.js";
import carritoRoutes from "./routes/carritoRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";


app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/preguntas", preguntaRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/proveedor", proveedorRoutes);
app.use("/api/admin", adminRoutes);

// Ruta base de prueba
app.get("/", (req, res) => {
  res.send("API funcionando correctamente 🚀");
});

// Levantar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));


