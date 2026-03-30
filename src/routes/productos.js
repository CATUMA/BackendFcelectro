import express from "express";
import Producto from "../models/producto.js";

const router = express.Router();

// 🔹 LISTAR PRODUCTOS
router.get("/", async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

// 🔹 REGISTRAR PRODUCTO
router.post("/", async (req, res) => {
  const nuevo = new Producto(req.body);
  const guardado = await nuevo.save();
  res.json(guardado);
});

// 🔹 EDITAR PRODUCTO
router.put("/:id", async (req, res) => {
  const actualizado = await Producto.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(actualizado);
});

// 🔹 ELIMINAR PRODUCTO
router.delete("/:id", async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Eliminado" });
});

// 🔹 BAJO STOCK
router.get("/bajo-stock", async (req, res) => {
  const productos = await Producto.find({ stock: { $lt: 5 } });
  res.json(productos);
});

// producto con IMAGEN

router.post("/productos", async (req, res) => {
  const { nombre, descripcion, precio, stock, imagen } = req.body;

  const nuevoProducto = new Producto({
    nombre,
    descripcion,
    precio,
    stock,
    imagen // 🔥 guardar base64
  });

  await nuevoProducto.save();
  res.json(nuevoProducto);
});

export default router;