const bcript = require("bcrypt");
const userModel = require("../models/user.model");
const doctorModel = require("../models/doctor.model");
const jwt = require("jsonwebtoken");
const { generarResetToken } = require("../utils/resetToken");
const MailerController = require("../services/mailer");
const configObject = require("../config/env.config");
const { createHash, isValidPassword } = require("../utils/hash");

const mailer = new MailerController();

class AuthController {
  generateToken = (user) => {
    return jwt.sign(
      { id: user._id, role: user.role },
      configObject.auth.jwt_secret,
      {
        expiresIn: "15d",
      }
    );
  };

  register = async (req, res) => {
    const {
      email,
      password,
      name,
      role,
      gender,
      phone,
      ticket_price,
      bio,
      about,
      specialization,
      education,
      experiences,
      timeSlots,
    } = req.body;
    const photo = req.file ? req.file.path : null;
    try {
      let user = null;
      if (role === "paciente") {
        user = await userModel.findOne({ email });
      } else if (role === "doctor") {
        user = await doctorModel.findOne({ email });
      }
      if (user) {
        return res
          .status(400)
          .json({ message: `El usuario con el email ${email} ya existe!` });
      }
      const salt = await bcript.genSalt(10);
      const hashPassword = await bcript.hash(password, salt);
      if (role === "paciente") {
        user = new userModel({
          name,
          email,
          password: hashPassword,
          photo,
          gender,
          role,
        });
      } else if (role === "doctor") {
        user = new doctorModel({
          name,
          email,
          password: hashPassword,
          photo,
          gender,
          role,
          phone,
          ticket_price,
          bio,
          about,
          specialization,
          education,
          experiences,
          timeSlots,
        });
      }
      await user.save();
      if (role === "doctor") {
        console.log("Registrando un doctor y enviando correo...");
        await mailer.enviarCorreoBienvenidaDoctor(email);
        await mailer.enviarCorreoNuevoDoctor({
          name,
          email,
      });
      }      
      return res
        .status(200)
        .json({ status: true, message: "Registro Exitoso", user: user });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
        message: "Error al registrar usuario",
      });
    }
  };

  login = async (req, res) => {
    const { email } = req.body;
    try {
      let user = null;
      const patient = await userModel.findOne({ email });
      const doctor = await doctorModel.findOne({ email });
      if (patient) {
        user = patient;
      } else if (doctor) {
        user = doctor;
      }
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      const isPasswordMatch = await bcript.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordMatch) {
        return res.status(400).json({
          success: false,
          message: "Credenciales incorrectas",
        });
      }
      const token = this.generateToken(user);
      const { password, role, appointments, ...rest } = user._doc;
      res.status(200).json({
        success: true,
        message: "Inicio de sesion exitoso!",
        token,
        data: { ...rest, role },
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error al iniciar sesion",
      });
    }
  };

  RequestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
      let user = await userModel.findOne({ email });
      if (!user) {
        user = await doctorModel.findOne({ email });
      }
      if (!user) {
        return res.render("passwordChange", { error: "Usuario no encontrado" });
      }
      const token = generarResetToken();
      user.token_reset = {
        token: token,
        expire: new Date(Date.now() + 3600000),
      };
      await user.save();
      await mailer.enviarCorreoRestablecimiento(email, token);
      res.redirect("/confirm");
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "error interno del servidor",
        error: err.message,
      });
    }
  };

  resetPassword = async (req, res) => {
    const { email, password, token } = req.body;
    try {
      let user = await userModel.findOne({ email });
      if (!user) {
        user = await doctorModel.findOne({ email });
      }
      if (!user) {
        return res.render("resetPass", { error: "Usuario no encontrado" });
      }
      const resetToken = user.token_reset;
      if (!resetToken || resetToken.token !== token) {
        return res.render("resetPass", { error: "Token invalido" });
      }
      const ahora = new Date();
      if (ahora > resetToken.expire) {
        return res.render("resetPass", { error: "El token expiro" });
      }
      if (isValidPassword(password, user)) {
        return res.render("resetPass", {
          error: "La nueva contraseña no puede ser igual a a la anterior",
        });
      }
      user.password = createHash(password);
      user.token_reset = undefined;
      await user.save();
      return res.redirect("/");
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "error interno del servidor",
        error: err.message,
      });
    }
  };
}

module.exports = AuthController;
