const { Router } = require("express");
const DoctorController = require("../controller/doctor.controller");
const AuthMiddleware = require("../middlewares/verifyToken.middleware");
const upload = require("../middlewares/upload.middleware");

const router = Router();
const auth = new AuthMiddleware();
const doctor = new DoctorController();

router.get("/", doctor.getAllDoctors);
router.get("/:id", doctor.getDoctorsById);

router.put(
  "/:id",
  upload.single('photo'),
  auth.authenticate,
  auth.restrict(["doctor"]),
  doctor.updateDoctor
);

router.delete("/:id", doctor.deleteDoctor);

router.put(
  "/approved/:id",
  auth.authenticate,
  auth.restrict(["doctor"]),
  doctor.changeStatusAppointment
);

router.get(
  "/profile/me",
  auth.authenticate,
  auth.restrict(["doctor"]),
  doctor.getDoctorProfile
);

router.get(
  "/appoinment/my-appoinment",
  auth.authenticate,
  auth.restrict(["doctor"]),
  doctor.getDoctorAppointments
);

router.put("/:id/approval-status", doctor.changeApprovalStatus);
router.put("/:id/cancelled-status",  doctor.cancelledStatus);

module.exports = router;
