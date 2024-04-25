import Usuario from "../models/Usuario.js";
import { generarID } from "../helpers/tokens.js";
import { emailRegistro } from "../helpers/emails.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar sesion",
  });
};
const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear cuenta",
  });
};
const registrar = async (req, res) => {
  try {
    const errores = [];
    const { nombre, email, password, repetir_password } = req.body;

    if (!nombre) {
      errores.push({
        error: "El campo nombre es obligatorio",
      });
    }
    if (!email) {
      errores.push({
        error: "El campo email es obligatorio",
      });
    }
    if (!password) {
      errores.push({
        error: "El campo contraseña es obligatorio",
      });
    }
    if (!repetir_password) {
      errores.push({
        error: "El campo repetir contraseña es obligatorio",
      });
    }

    // Verificar si hay errores en los campos obligatorios
    if (errores.length > 0) {
      return res.render("auth/registro", {
        pagina: "Crear pagina",
        errores: errores,
      });
    }

    //Validar longitud de la contraseña
    if (password.length < 8) {
      errores.push({
        error: "La contraseña debe tener al menos 8 caracteres",
      });
    }

    // Verificar si las contraseñas coinciden
    if (password !== repetir_password) {
      errores.push({
        error: "Las contraseñas no coinciden",
      });
    }

    //verificar si existe el usuario
    const existeUsuario = await Usuario.findOne({
      where: { email: req.body.email },
    });
    if (existeUsuario) {
      errores.push({
        error: `el email ${req.body.email} ya existe`,
      });
    }
    // Verificar si hay más errores después de validar la contraseña
    if (errores.length > 0) {
      return res.render("auth/registro", {
        pagina: "Crear pagina",
        errores: errores,
      });
    }

    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      token: generarID(),
    });

    //enviar email de confirmacion
    emailRegistro({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token,
    });

    return res.status(200).render("auth/mensaje", {
      pagina: "Cuenta creada correctamente",
      mensaje: "Hemos enviado un mail de confirmacion para confirmar tu cuenta",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  //verificar si el token es valido
  const usuario = await Usuario.findOne({where: {token}});
  
  if(!usuario){
    return res.status(200).render("auth/confirmar-cuenta", {
      pagina: "Error al confirmar tu cuenta",
      mensaje: "Hubo un error al confirmar ",
      error: true
    });
  }
  
  //confirmar user
  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();

  res.status(200).render("auth/confirmar-cuenta", {
    pagina: "Cuenta confirmada",
    mensaje: "Tu cuenta ha sido confirmada"
  });
};

const formularioOlvidePassword = (req, res) => {
 return res.render("auth/olvide-password", {
    pagina: "Recupera tu acceso a bienes raices",
  });
};
export {
  formularioLogin,
  formularioRegistro,
  registrar,
  confirmar,
  formularioOlvidePassword,
};
