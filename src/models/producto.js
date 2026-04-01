import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
  stock: Number,
  imagen: String,
  
  oferta: {
  type: Boolean,
  default: false
}
});

export default mongoose.model("Producto", productoSchema);