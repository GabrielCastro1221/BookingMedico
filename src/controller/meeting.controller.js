const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const configObject = require("../config/env.config");

class MeetingController {
  generateAgoraToken = async (req, res) => {
    try {
      const appID = configObject.agora.agora_app_id;
      const appCertificate = configObject.agora.agora_app_certificate;
      const channelName = req.body.channelName;
      const uid = req.body.uid || 0;
      const role = RtcRole.PUBLISHER;
      const expirationTimeInSeconds = 3600;
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
      const token = RtcTokenBuilder.buildTokenWithUid(
        appID,
        appCertificate,
        channelName,
        uid,
        role,
        privilegeExpiredTs
      );
      return res.status(200).json({ status: true, token: token });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error al crear el token valido de AgoraRTC",
      });
    }
  };
}

module.exports = MeetingController;
