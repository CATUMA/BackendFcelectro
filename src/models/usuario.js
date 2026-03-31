import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  correo: String,
  password: String,
  
  rol: {
  type: String,
  enum: ["admin", "cliente", "soporte", "vendedor"],
  default: "cliente"
  },

  foto: {
    type: String,
    default: "" // 🔥 importante
  }
});

export default mongoose.model("Usuario", usuarioSchema);