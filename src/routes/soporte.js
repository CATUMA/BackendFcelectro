import express from "express";
import Soporte from "../models/soporte.js";

const router = express.Router();


// ✅ CREAR SOPORTE
router.post("/", async (req, res) => {
  try {
    const nuevo = new Soporte(req.body);
    await nuevo.save();
    res.json(nuevo);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al guardar" });
  }
});


// ✅ LISTAR TODOS (soporte técnico)
router.get("/", async (req, res) => {
  const data = await Soporte.find();
  res.json(data);
});


// ✅ HISTORIAL POR USUARIO
router.get("/usuario/:id", async (req, res) => {
  const data = await Soporte.find({
    usuarioId: req.params.id,
  });
  res.json(data);
});


// ✅ ACTUALIZAR ESTADO
router.put("/:id", async (req, res) => {
  const actualizado = await Soporte.findByIdAndUpdate(
    req.params.id,
    { estado: req.body.estado },
    { new: true }
  );
  res.json(actualizado);
});

export default router;