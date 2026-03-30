import mongoose from "mongoose";

const soporteSchema = new mongoose.Schema({
    nombre: String,
    correo: String,
    tipoProducto: String,
    descripcion: String,
    fecha: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Soporte", soporteSchema);