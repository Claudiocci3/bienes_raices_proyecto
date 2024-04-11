import Usuario from "../models/Usuario.js";
// import validarRegistro from '../utils/validaciones.js'
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
        errores: errores
      });
    }

    // Validar longitud de la contraseña
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
      const existeUsuario = await Usuario.findOne( {where: { email: req.body.email }} );
      if(existeUsuario){
        errores.push({
          error: `el email ${req.body.email} ya existe`
        })
      }
    // Verificar si hay más errores después de validar la contraseña
    if (errores.length > 0) {
      return res.render("auth/registro", {
        pagina: "Crear pagina",
        errores: errores,
      });
    }

    await Usuario.create({
      nombre,
      email,
      password,
      token:123
    });
   return res.status(200).render("auth/registro", {
    pagina: "Crear pagina",
    mensaje: "Usuario creado correctamente"
   });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }



};

const formularioOlvidePassword = (req, res) => {
  res.render("auth/olvide-password", {
    pagina: "Recupera tu acceso a bienes raices",
  });
};
export {
  formularioLogin,
  formularioRegistro,
  registrar,
  formularioOlvidePassword,
};
