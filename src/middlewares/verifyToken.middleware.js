const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const doctorModel = require("../models/doctor.model");
const configObject = require("../config/env.config");

class AuthMiddleware {
  authenticate = async (req, res, next) => {
    const authToken = req.headers.authorization;
    if (!authToken || !authToken.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "Autorización denegada. No se proporcionó token.",
      });
    }
    try {
      const token = authToken.split(" ")[1];
      const decoded = jwt.verify(token, configObject.auth.jwt_secret);
      req.userId = decoded.id;
      req.role = decoded.role;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "El token de acceso ha expirado.",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Token inválido.",
      });
    }
  };
  restrict = (roles) => async (req, res, next) => {
    try {
      const userId = req.userId;
      let user;
      const patient = await userModel.findById(userId);
      const doctor = await doctorModel.findById(userId);
      if (patient) {
        user = patient;
      } else if (doctor) {
        user = doctor;
        req.doctorId = doctor._id;
      }
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado.",
        });
      }
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para acceder a esta ruta.",
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error en la verificación de roles.",
      });
    }
  };
}

module.exports = AuthMiddleware;
