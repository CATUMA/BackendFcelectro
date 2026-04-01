import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Soporte from "./models/soporte.js";
import productosRoutes from "./routes/productos.js";
import authRoutes from "./routes/auth.js";
import comprasRoutes from "./routes/compras.js";

dotenv.config();

const app = express();

// 🔥 PRIMERO MIDDLEWARES
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// 🔥 LUEGO LAS RUTAS
app.use("/api/auth", authRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/compras", comprasRoutes);

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Conectado a MongoDB Atlas"))
    .catch((err) => console.log("Error de conexión:", err));

app.get("/soporte", async (req, res) => {
    try {
        const soportes = await Soporte.find();
        res.status(200).json(soportes);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los datos" });
    }
});

app.post("/soporte", async (req, res) => {
    try {
        const nuevoSoporte = new Soporte(req.body);
        await nuevoSoporte.save();
        res.status(201).json({ mensaje: "Solicitud enviada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar la solicitud" });
    }
});

app.listen(4000, () => {
    console.log("Servidor en puerto 4000");
});