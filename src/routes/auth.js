import express from "express";
import Usuario from "../models/usuario.js";

const router = express.Router();

// 🔐 LOGIN
router.post("/login", async (req, res) => {
  const { correo, password } = req.body;

  try {
    const user = await Usuario.findOne({ correo, password });

    if (!user) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    res.json({
      usuario: {
        id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol
      }
    });

  } catch (error) {
    res.status(500).json({ mensaje: "Error en servidor" });
  }
});


// 🔹 REGISTRAR USUARIO
router.post("/register", async (req, res) => {
  const { nombre, correo, password, rol } = req.body;

  try {
    const existe = await Usuario.findOne({ correo });

    if (existe) {
      return res.status(400).json({
        mensaje: "El usuario ya existe"
      });
    }

    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      password,
      rol: rol || "cliente"
    });

    await nuevoUsuario.save();

    res.status(201).json({
      mensaje: "Usuario registrado correctamente"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al registrar"
    });
  }
});


// 🔹 LISTAR USUARIOS
router.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuarios" });
  }
});


// 🔹 ACTUALIZAR ROL
router.put("/usuarios/:id", async (req, res) => {
  const { rol } = req.body;

  try {
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { rol },
      { new: true }
    );

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar rol" });
  }
});


// 🔹 ELIMINAR USUARIO
router.delete("/usuarios/:id", async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar usuario" });
  }
});


// 🔹 ACTUALIZAR FOTO PERFIL
router.put("/usuarios/:id/foto", async (req, res) => {
  try {
    const { foto } = req.body;

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { foto },
      { new: true }
    );

    res.json(usuario);

  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar foto" });
  }
});


// 🔍 BUSCAR CLIENTES
router.get("/usuarios/buscar/:texto", async (req, res) => {
  try {
    const texto = req.params.texto;

    const usuarios = await Usuario.find({
      $and: [
        { rol: "cliente" }, // 🔥 SOLO CLIENTES
        {
          $or: [
            { nombre: { $regex: texto, $options: "i" } },
            { correo: { $regex: texto, $options: "i" } }
          ]
        }
      ]
    });

    res.json(usuarios);

  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar clientes" });
  }
});


export default router;