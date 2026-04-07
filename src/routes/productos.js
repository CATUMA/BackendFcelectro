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
  try {
    const nuevo = new Producto(req.body);
    const guardado = await nuevo.save();
    res.json(guardado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar producto" });
  }
});

// 🔹 EDITAR PRODUCTO
router.put("/:id", async (req, res) => {
  const actualizado = await Producto.findByIdAndUpdate(
    req.params.id,
    req.body,
    { returnDocument: "after" }
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


// 🔥 ENVIAR A OFERTAS (CORRECTO)
router.put("/oferta/:id", async (req, res) => {
  try {

    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    producto.oferta = true;
    await producto.save();

    res.json({ mensaje: "Producto enviado a ofertas", producto });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al enviar a ofertas" });
  }
});


// 🔥 OBTENER OFERTAS (CORRECTO)
router.get("/ofertas", async (req, res) => {
  try {

    const ofertas = await Producto.find({ oferta: true });

    res.json(ofertas);

  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener ofertas" });
  }
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