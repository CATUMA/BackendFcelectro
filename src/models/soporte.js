import mongoose from "mongoose";

const soporteSchema = new mongoose.Schema({
    usuarioId: String, // 🔥 clave para historial

    nombre: String,
    correo: String,

    tipoProducto: String,
    descripcion: String,

    estado: {
        type: String,
        default: "Pendiente" // 🔥 clave para HU-21
    },

    fecha: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Soporte", soporteSchema);