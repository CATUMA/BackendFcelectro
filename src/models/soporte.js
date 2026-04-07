import mongoose from "mongoose";

const soporteSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    correo: {
      type: String,
      required: true,
    },
    tipoProducto: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      enum: ["Pendiente", "En proceso", "Finalizado"],
      default: "Pendiente",
    },
    // 🔔 NOTIFICACIÓN
    notificado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // 🔥 importante para ordenar
  }
);

export default mongoose.model("Soporte", soporteSchema);