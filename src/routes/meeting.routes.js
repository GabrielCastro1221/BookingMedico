const express = require("express");
const MeetingController = require("../controller/meeting.controller");

const router = express.Router();
const meeting = new MeetingController();

router.post("/generate-token", meeting.generateAgoraToken);

module.exports = router;
