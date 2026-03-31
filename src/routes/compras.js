import express from "express";
import Producto from "../models/producto.js";
import Compra from "../models/compra.js"; // 🔥 IMPORTANTE

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

      // 🔥 GUARDAR INFO LIMPIA (SIN IMAGEN)
      productosCompra.push({
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: item.cantidad
      });

      total += producto.precio * item.cantidad;
    }

    // 🔥 GUARDAR COMPRA (HISTORIAL)
    const nuevaCompra = new Compra({
      usuarioId,
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


// 🔥 HISTORIAL DE COMPRAS POR USUARIO (HU-08)
router.get("/:usuarioId", async (req, res) => {
  try {

    const compras = await Compra.find({
      usuarioId: req.params.usuarioId
    }).sort({ fecha: -1 }); // 🔥 más reciente primero

    res.json(compras);

  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener historial" });
  }
});

export default router;