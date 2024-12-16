const { Router } = require("express");
const AuthController = require("../controller/auth.controller");
const upload = require("../middlewares/upload.middleware");

const router = Router();
const auth = new AuthController();

router.post("/register", upload.single("photo"), auth.register);
router.post("/login", auth.login);
router.post("/requestPasswordReset", auth.RequestPasswordReset);
router.post("/reset-password", auth.resetPassword);

module.exports = router;
