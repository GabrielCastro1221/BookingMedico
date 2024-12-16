const doctorModel = require("../models/doctor.model");
const bookingModel = require("../models/booking.model");
const EmailManager = require("../services/mailer");

const mailer = new EmailManager();

class DoctorController {
  getAllDoctors = async (req, res) => {
    try {
      const doctors = await doctorModel.find({});
      if (!doctors) {
        res
          .status(404)
          .json({ status: false, message: "Doctores no encontrados" });
      }
      res.status(201).json({
        status: true,
        message: "Doctores encontrados",
        Doctores: doctors,
      });
    } catch (err) {
      res
        .status(500)
        .json({ status: false, message: "error al obtener los Doctores" });
    }
  };

  getDoctorsById = async (req, res) => {
    const { id } = req.params;
    try {
      const doctor = await doctorModel.findById(id);
      if (!doctor) {
        res
          .status(404)
          .json({ status: false, message: "Doctor no encontrado" });
      }
      res
        .status(201)
        .json({ status: true, message: "Doctor encontrado", Doctor: doctor });
    } catch (err) {
      res
        .status(500)
        .json({ status: false, message: "error al obtener los doctor" });
    }
  };

  updateDoctor = async (req, res) => {
    const { id } = req.params;
    try {
      let photoUrl = req.body.photo;
      if (req.file) {
        photoUrl = req.file.path;
      }

      const education = req.body.education
        ? JSON.parse(req.body.education)
        : undefined;
      const experiences = req.body.experiences
        ? JSON.parse(req.body.experiences)
        : undefined;
      const timeSlots = req.body.timeSlots
        ? JSON.parse(req.body.timeSlots)
        : undefined;

      const updateData = {
        ...req.body,
        photo: photoUrl,
      };

      if (education) updateData.education = education;
      if (experiences) updateData.experiences = experiences;
      if (timeSlots) updateData.timeSlots = timeSlots;

      const updatedDoctor = await doctorModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedDoctor) {
        return res.status(404).json({
          status: false,
          message: "Doctor no encontrado",
        });
      }
      res.status(200).json({
        status: true,
        message: "Doctor actualizado con éxito",
        doctor: updatedDoctor,
      });
    } catch (err) {
      console.error("Error al actualizar el doctor:", err);
      res.status(500).json({
        status: false,
        message: "Error al actualizar el doctor",
      });
    }
  };

  deleteDoctor = async (req, res) => {
    const { id } = req.params;
    try {
      const doctor = await doctorModel.findByIdAndDelete(id);
      if (!doctor) {
        res
          .status(404)
          .json({ status: false, message: "doctor no encontrado" });
      }
      res.status(201).json({
        status: true,
        message: "doctor eliminado con exito!",
        doctor: doctor,
      });
    } catch (err) {
      res
        .status(500)
        .json({ status: false, message: "error al eliminar los doctor" });
    }
  };

  changeStatusAppointment = async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await bookingModel.findById(id);
      if (!booking) {
        return res.status(404).send("Cita no encontrada");
      }
      const statusChange =
        booking.status === "pending" || "approved" ? "approved" : "pending";
      const statusUpdate = await bookingModel.findByIdAndUpdate(
        id,
        { status: statusChange },
        { new: true }
      );
      res.status(200).json(statusUpdate);
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error al cambiar el estado de la cita",
      });
    }
  };

  getDoctorProfile = async (req, res) => {
    const doctorId = req.userId;
    try {
      const doctor = await doctorModel.findById(doctorId);
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor no encontrado",
        });
      }
      const { password, ...rest } = doctor._doc;
      const appoinments = await bookingModel.find({ doctor: doctorId });
      res.status(200).json({
        success: true,
        message: "Informacion del perfil obtenida satisfactoriamente",
        data: { ...rest, appoinments },
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error al obtener la informacion del perfil",
      });
    }
  };

  getDoctorAppointments = async (req, res) => {
    try {
      const doctorId = req.doctorId;
      if (!doctorId) {
        return res.status(400).json({
          success: false,
          message: "Doctor ID no proporcionado",
        });
      }
      const bookings = await bookingModel
        .find({ doctor: doctorId })
        .populate("user", "-password")
        .populate("doctor", "-password");
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No se encontraron citas para este doctor",
        });
      }
      res.status(200).json({
        success: true,
        message: "Citas del doctor obtenidas exitosamente!",
        data: bookings,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error al obtener las citas del doctor",
      });
    }
  };

  changeApprovalStatus = async (req, res) => {
    const { id } = req.params;
    try {
      const doctor = await doctorModel.findById(id);
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor no encontrado",
        });
      }
      const updatedDoctor = await doctorModel.findByIdAndUpdate(
        id,
        { isApproved: "approved" },
        { new: true }
      );

      await mailer.enviarCorreoAprobacionDoctor(doctor.email, doctor.name);

      return res.status(200).json({
        success: true,
        message: `Estado de aprobación actualizado a "approved"`,
        data: updatedDoctor,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al actualizar el estado de aprobación",
        error: error.message,
      });
    }
  };

  cancelledStatus = async (req, res) => {
    const { id } = req.params;
    try {
      const doctor = await doctorModel.findById(id);
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor no encontrado",
        });
      }
      const updatedDoctor = await doctorModel.findByIdAndUpdate(
        id,
        { isApproved: "cancelled" },
        { new: true }
      );

      await mailer.enviarCorreoCancelacionDoctor(doctor.email, doctor.name);

      return res.status(200).json({
        success: true,
        message: `Estado de aprobación actualizado a "cancelled"`,
        data: updatedDoctor,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al actualizar el estado de aprobación",
        error: error.message,
      });
    }
  };
}

module.exports = DoctorController;
