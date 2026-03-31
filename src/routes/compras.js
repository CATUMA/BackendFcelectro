import express from "express";
import Producto from "../models/producto.js";
import Compra from "../models/compra.js";

const router = express.Router();


// 🔥 REALIZAR COMPRA
router.post("/", async (req, res) => {
  const { carrito, usuarioId } = req.body;

  try {
    let productosCompra = [];
    let total = 0;

    for (const item of carrito) {

      const producto = await Producto.findById(item.id);

      if (!producto) continue;

      // 🚨 VALIDAR STOCK
      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          mensaje: `Stock insuficiente: ${producto.nombre}`
        });
      }

      // 🔥 DESCONTAR STOCK
      producto.stock -= item.cantidad;
      await producto.save();

      productosCompra.push({
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: item.cantidad
      });

      total += producto.precio * item.cantidad;
    }

    // 🔥 GUARDAR COMPRA
    const nuevaCompra = new Compra({
      usuarioId, // 👈 consistente
      productos: productosCompra,
      total
    });

    await nuevaCompra.save();

    res.json({
      mensaje: "Compra realizada correctamente",
      compra: nuevaCompra
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en la compra" });
  }
});


// 🔥 HISTORIAL POR USUARIO (CLIENTE)
router.get("/usuario/:usuarioId", async (req, res) => {
  try {

    const compras = await Compra.find({
      usuarioId: req.params.usuarioId
    }).sort({ fecha: -1 });

    res.json(compras);

  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener historial" });
  }
});


// 🔥 HISTORIAL GENERAL (ADMIN)
router.get("/", async (req, res) => {
  try {

    const compras = await Compra.find()
      .sort({ fecha: -1 });

    res.json(compras);

  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener compras" });
  }
});


// 🔥 MÉTRICAS (DASHBOARD)
router.get("/metricas", async (req, res) => {
  try {

    const compras = await Compra.find();

    const totalVentas = compras.reduce((acc, c) => acc + c.total, 0);
    const totalCompras = compras.length;

    res.json({
      totalVentas,
      totalCompras
    });

  } catch (error) {
    res.status(500).json({ mensaje: "Error en métricas" });
  }
});

export default router;