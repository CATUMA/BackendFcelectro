import express from "express";
import Producto from "../models/producto.js";
import Compra from "../models/compra.js";

const router = express.Router();


// 🔥 REALIZAR COMPRA
router.post("/", async (req, res) => {
  const { carrito, usuarioId, clienteNombre } = req.body; // 🔥 AGREGAR clienteNombre

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

    // 🔢 GENERAR NÚMERO DE COMPROBANTE
    const cantidad = await Compra.countDocuments();
    const numeroComprobante = `FCE-${String(cantidad + 1).padStart(6, "0")}`;

    // 🔥 GUARDAR COMPRA
    const nuevaCompra = new Compra({
      usuarioId, // 👈 consistente
      clienteNombre,          // 👈 NUEVO
      productos: productosCompra,
      total,
      numeroComprobante       // 👈 FALTABA ESTO
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

// 🔥 REPORTE MENSUAL DE VENTAS
router.get("/reporte/mensual", async (req, res) => {
  try {

    const reporte = await Compra.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$fecha" },
            month: { $month: "$fecha" }
          },
          totalVentas: { $sum: "$total" },
          cantidadCompras: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    res.json(reporte);

  } catch (error) {
    res.status(500).json({ mensaje: "Error en reporte mensual" });
  }
});


// 🔥 PRODUCTOS MÁS VENDIDOS
router.get("/reporte/top-productos", async (req, res) => {
  try {

    const reporte = await Compra.aggregate([
      { $unwind: "$productos" },
      {
        $group: {
          _id: "$productos.nombre",
          totalVendido: { $sum: "$productos.cantidad" },
          totalGanado: {
            $sum: {
              $multiply: ["$productos.precio", "$productos.cantidad"]
            }
          }
        }
      },
      { $sort: { totalVendido: -1 } }
    ]);

    res.json(reporte);

  } catch (error) {
    res.status(500).json({ mensaje: "Error en reporte de productos" });
  }
});

export default router;