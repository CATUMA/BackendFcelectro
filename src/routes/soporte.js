import express from "express";
import Soporte from "../models/soporte.js";

const router = express.Router();


// ✅ CREAR SOPORTE
router.post("/", async (req, res) => {
  try {
    const nuevo = new Soporte({
      ...req.body,
      estado: "Pendiente",
      notificado: false,
    });

    await nuevo.save();

    res.status(201).json({
      ...nuevo.toObject(),
      problema: nuevo.descripcion, // 🔥 MAPEO
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al guardar soporte" });
  }
});


// ✅ LISTAR TODOS
router.get("/", async (req, res) => {
  try {
    const data = await Soporte.find().sort({ createdAt: -1 });

    // 🔥 MAPEO GLOBAL
    const respuesta = data.map((item) => ({
      ...item.toObject(),
      problema: item.descripcion,
    }));

    res.json(respuesta);

  } catch (error) {
    res.status(500).json({ mensaje: "Error obteniendo datos" });
  }
});


// ✅ HISTORIAL POR USUARIO
router.get("/usuario/:id", async (req, res) => {
  try {
    const data = await Soporte.find({
      usuarioId: req.params.id,
    }).sort({ createdAt: -1 });

    const respuesta = data.map((item) => ({
      ...item.toObject(),
      problema: item.descripcion,
    }));

    res.json(respuesta);

  } catch (error) {
    res.status(500).json({ mensaje: "Error obteniendo historial" });
  }
});


// 🔔 NOTIFICACIONES
router.get("/notificaciones", async (req, res) => {
  try {
    const data = await Soporte.find({ notificado: false })
      .sort({ createdAt: -1 });

    const respuesta = data.map((item) => ({
      ...item.toObject(),
      problema: item.descripcion,
    }));

    res.json(respuesta);

  } catch (error) {
    res.status(500).json({ mensaje: "Error obteniendo notificaciones" });
  }
});


// 🔔 MARCAR COMO LEÍDA
router.put("/notificaciones/:id", async (req, res) => {
  try {
    const actualizado = await Soporte.findByIdAndUpdate(
      req.params.id,
      { notificado: true },
      { returnDocument: "after" }
    );

    res.json({
      ...actualizado.toObject(),
      problema: actualizado.descripcion,
    });

  } catch (error) {
    res.status(500).json({ mensaje: "Error actualizando notificación" });
  }
});


// ✅ ACTUALIZAR ESTADO
router.put("/:id", async (req, res) => {
  try {
    const actualizado = await Soporte.findByIdAndUpdate(
      req.params.id,
      { estado: req.body.estado },
      { returnDocument: "after" }
    );

    res.json({
      ...actualizado.toObject(),
      problema: actualizado.descripcion,
    });

  } catch (error) {
    res.status(500).json({ mensaje: "Error actualizando estado" });
  }
});

export default router;