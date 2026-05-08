import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Registro
export const register = async (req, res) => {
  try {
    console.log("BODY REGISTER:", req.body);

    const { nombre, email, password, rol } = req.body;

    // Verificar si el usuario ya existe
    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ msg: "El email ya está registrado" });
    }

    // Encriptar contraseña (versión async)
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Crear usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hashed,
      rol: rol || "cliente"
    });

    await nuevoUsuario.save();

    res.status(201).json({ msg: "Usuario registrado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ msg: "Credenciales incorrectas" });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ msg: "Credenciales incorrectas" });
    }

    // Crear token
    const token = jwt.sign(
      {
        id: usuario._id,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

