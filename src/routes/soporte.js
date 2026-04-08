import express from "express";
import Soporte from "../models/soporte.js";

const router = express.Router();

// ✅ CREAR SOPORTE
router.post("/", async (req, res) => {
  try {
    console.log("BODY BACKEND:", req.body); // 🔍 DEBUG

    const { usuarioId, nombre, correo, tipoProducto, descripcion } = req.body;

    // 🔥 VALIDACIÓN PROFESIONAL
    if (!usuarioId || !tipoProducto || !descripcion) {
      return res.status(400).json({
        mensaje: "Faltan campos obligatorios",
      });
    }

    const nuevo = new Soporte({
      usuarioId,
      nombre,
      correo,
      tipoProducto,
      descripcion,
      estado: "Pendiente",
      ticket: "TCK-" + Date.now(),

      historial: [
        {
          estado: "Pendiente",
          mensaje: "Hemos recibido tu solicitud.",
          tipo: "sistema",
          fecha: new Date(),
        },
      ],
    });

    await nuevo.save();

    res.status(201).json(nuevo);

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al guardar soporte" });
  }
});

// ✅ LISTAR TODOS
router.get("/", async (req, res) => {
  try {
    const data = await Soporte.find().sort({ createdAt: -1 });
    res.json(data);
  } catch {
    res.status(500).json({ mensaje: "Error obteniendo datos" });
  }
});

// ✅ HISTORIAL POR USUARIO
router.get("/usuario/:id", async (req, res) => {
  try {
    const data = await Soporte.find({
      usuarioId: req.params.id,
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch {
    res.status(500).json({ mensaje: "Error obteniendo historial" });
  }
});

// 🔔 NOTIFICACIONES CLIENTE
router.get("/notificaciones/:userId", async (req, res) => {
  try {
    const soportes = await Soporte.find({
      usuarioId: req.params.userId,
      notificado: false,
    });

    const notificaciones = soportes.map((s) => ({
      soporteId: s._id,
      ticket: s.ticket,
      estado: s.estado,
      mensaje: s.historial?.at(-1)?.mensaje,
    }));

    await Soporte.updateMany(
      { usuarioId: req.params.userId, notificado: false },
      { notificado: true }
    );

    res.json(notificaciones);

  } catch {
    res.status(500).json({ mensaje: "Error notificaciones" });
  }
});

// ✅ ACTUALIZAR ESTADO
router.put("/:id", async (req, res) => {
  try {
    const { estado } = req.body;

    const soporte = await Soporte.findById(req.params.id);

    if (!soporte) {
      return res.status(404).json({ mensaje: "Soporte no encontrado" });
    }

    soporte.estado = estado;

    let mensajeAutomatico = "";

    if (estado === "Pendiente") {
      mensajeAutomatico = "Hemos recibido tu solicitud.";
    } else if (estado === "En proceso") {
      mensajeAutomatico = "Tu equipo pasara a ser revisado por favor traerlo al local.";
    } else if (estado === "Finalizado") {
      mensajeAutomatico = "Tu equipo está listo para recoger.";
    }

    if (!soporte.historial) {
      soporte.historial = [];
    }

    soporte.historial.push({
      estado,
      mensaje: mensajeAutomatico,
      tipo: "sistema",
      fecha: new Date(),
    });

    soporte.notificado = false;

    await soporte.save();

    res.json(soporte);

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error actualizando estado" });
  }
});

export default router;