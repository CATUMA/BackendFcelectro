import mongoose from "mongoose";

const compraSchema = new mongoose.Schema({
  numeroComprobante: {
    type: String,
    unique: true
  },

  usuarioId: String,

  clienteNombre: String,

  productos: [
    {
      nombre: String,
      precio: Number,
      cantidad: Number
    }
  ],

  total: Number,

  fecha: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Compra", compraSchema);
