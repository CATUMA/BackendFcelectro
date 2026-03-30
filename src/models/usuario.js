import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  correo: String,
  password: String,
  
  rol: String, // admin | cliente | soporte

  foto: {
    type: String,
    default: "" // 🔥 importante
  }
});

export default mongoose.model("Usuario", usuarioSchema);