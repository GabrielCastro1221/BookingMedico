const APP_ID = "12bf0562227b4f709a09cbbde985a24e";
const CHANNEL_NAME = "video_consulta";

let client = null;
let localVideoTrack = null;
let localAudioTrack = null;
let localStream = null;
let isMuted = false;
let isVideoOff = false;

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const muteButton = document.querySelector(".btn-silence i");
const videoButton = document.querySelector(".btn-rec i");
const localVideoContainer = document.querySelector(".local-video");

async function initMeeting() {
  try {
    const response = await fetch(`/api/v1/agora/generate-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channelName: CHANNEL_NAME }),
    });
    const data = await response.json();
    const token = data.token;

    client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    const uid = Math.floor(Math.random() * 10000);

    await client.join(APP_ID, CHANNEL_NAME, token, uid);
    console.log("Conectado al canal");

    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      console.log("Usuario publicado:", user.uid);

      if (mediaType === "audio") {
        const remoteAudioTrack = user.audioTrack;
        remoteAudioTrack.play();
        console.log("Audio remoto reproducido");
      }
      
      if (mediaType === "video") {
        const remoteVideoTrack = user.videoTrack;
        remoteVideoTrack.play(remoteVideo);
      }
    });

    client.on("user-unpublished", (user) => {
      console.log("Usuario no publicado:", user.uid);
      remoteVideo.srcObject = null;
    });

    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideo.srcObject = localStream;

    localVideoTrack = AgoraRTC.createCustomVideoTrack({
      mediaStreamTrack: localStream.getVideoTracks()[0],
    });
    localAudioTrack = AgoraRTC.createCustomAudioTrack({
      mediaStreamTrack: localStream.getAudioTracks()[0],
    });

    await client.publish([localVideoTrack, localAudioTrack]);

    console.log("Video y audio local publicados");
  } catch (error) {
    console.error("Error al inicializar la reunión:", error);
  }
}

function toggleMute() {
  if (isMuted) {
    localAudioTrack.setEnabled(true);
    muteButton.classList.remove("fa-microphone-slash");
    muteButton.classList.add("fa-microphone");
  } else {
    localAudioTrack.setEnabled(false);
    muteButton.classList.remove("fa-microphone");
    muteButton.classList.add("fa-microphone-slash");
  }
  isMuted = !isMuted;
}

function toggleVideo() {
  if (isVideoOff) {
    localVideoTrack.setEnabled(true);
    localVideoContainer.style.display = "block";
    videoButton.classList.remove("fa-video-slash");
    videoButton.classList.add("fa-video");
  } else {
    localVideoTrack.setEnabled(true);
    localVideoContainer.style.display = "none";
    videoButton.classList.remove("fa-video");
    videoButton.classList.add("fa-video-slash");
  }
  isVideoOff = !isVideoOff;
}

document.addEventListener("DOMContentLoaded", initMeeting);
document.addEventListener("DOMContentLoaded", () => {
  const silenceButton = document.querySelector(".btn-silence");
  const videoButtonContainer = document.querySelector(".btn-rec");

  silenceButton.addEventListener("click", toggleMute);
  videoButtonContainer.addEventListener("click", toggleVideo);
});
