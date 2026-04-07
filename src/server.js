import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import productosRoutes from "./routes/productos.js";
import authRoutes from "./routes/auth.js";
import comprasRoutes from "./routes/compras.js";
import soporteRoutes from "./routes/soporte.js";

dotenv.config();

const app = express();

// 🔥 MIDDLEWARES
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// 🔥 RUTAS (CORRECTO)
app.use("/api/auth", authRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/compras", comprasRoutes);
app.use("/api/soporte", soporteRoutes);

// 🔥 CONEXIÓN A MONGODB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.log("❌ Error de conexión:", err));

// 🔥 RUTA TEST (OPCIONAL)
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// 🔥 SERVER
app.listen(4000, () => {
  console.log("🚀 Servidor en puerto 4000");
});