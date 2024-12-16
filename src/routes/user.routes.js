const { Router } = require("express");
const UserController = require("../controller/user.controller");
const AuthMiddleware = require("../middlewares/verifyToken.middleware");
const upload = require("../middlewares/upload.middleware");

const router = Router();
const auth = new AuthMiddleware();
const user = new UserController();

router.get("/", auth.authenticate, user.getAllUsers);

router.get(
  "/:id",
  auth.authenticate,
  auth.restrict(["paciente", "admin"]),
  user.getUserById
);

router.put(
  "/:id",
  upload.single("photo"),
  auth.authenticate,
  auth.restrict(["paciente", "admin"]),
  user.updateUser
);

router.delete(
  "/:id",
  auth.authenticate,
  auth.restrict(["paciente", "admin"]),
  user.deleteUser
);

router.post("/create-appointment", user.createAppointment);

router.get(
  "/profile/me",
  auth.authenticate,
  auth.restrict(["paciente", "admin"]),
  user.getUserProfile
);

router.get("/appoinment/my-appoinment", user.getMyAppoinments);

router.put(
  "/cancelled/:id",
  auth.authenticate,
  auth.restrict(["paciente", "admin"]),
  user.cancelledAppointment
);

router.put("/admin/:id", user.changeRolAdmin);

module.exports = router;
