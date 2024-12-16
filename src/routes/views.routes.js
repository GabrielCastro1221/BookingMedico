const { Router } = require("express");
const ViewsController = require("../controller/views.controller");

const router = Router();
const views = new ViewsController();

router.get("/", views.renderLogin);
router.get("/registro", views.renderRegister);
router.get("/reset-password", views.renderResetPass);
router.get("/change-password", views.renderChangePass);
router.get("/confirm", views.renderEmailConfirm);
router.get("/inicio", views.renderHome);
router.get("/doctores", views.renderDoctors);
router.get("/doctores/:id", views.renderDoctorDetail);
router.get("/perfil-doctor", views.renderDoctorProfile);
router.get("/perfil-usuario", views.renderUserProfile);
router.get("/perfil-admin", views.renderAdminProfile);
router.get("/servicios", views.renderServices);
router.get("/contacto", views.renderContact);
router.get("/page-not-found", views.renderNotFound);
router.get("/acceso-denegado", views.renderAccessDenied);
router.get("/video-consulta/:id", views.renderMeeting);
router.get('/buscar-doctor', views.renderSearchDoctor);

module.exports = router;