const APP_ID = "12bf0562227b4f709a09cbbde985a24e"; // Reemplaza con tu APP_ID real
const CHANNEL_NAME = "video_consulta"; // Nombre del canal
const SERVER_API_URL = "/api/v1/agora/generate-token"; // Endpoint para generar token

let client = null; // Cliente de Agora
let localVideoTrack = null; // Video local
let localAudioTrack = null; // Audio local
let isMuted = false; // Estado del micrófono
let isVideoOff = false; // Estado del video

const localVideoContainer = document.getElementById("localVideo");
const remoteVideoContainer = document.getElementById("remoteVideo");
const muteButton = document.querySelector(".btn-silence i");
const videoButton = document.querySelector(".btn-rec i");

async function initMeeting() {
  try {
    // 1. Generar el token desde el servidor
    const response = await fetch(SERVER_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelName: CHANNEL_NAME }),
    });
    const data = await response.json();

    if (!data.status) throw new Error("Error al obtener el token");
    const token = data.token;

    // 2. Crear el cliente de Agora
    client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    // 3. Unir al canal con el token generado
    const uid = Math.floor(Math.random() * 10000); // ID único para el usuario
    await client.join(APP_ID, CHANNEL_NAME, token, uid);
    console.log("Conectado al canal:", CHANNEL_NAME);

    // 4. Capturar audio y video local usando Agora
    localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();

    // 5. Reproducir el video local en el contenedor
    localVideoTrack.play(localVideoContainer);

    // 6. Publicar los tracks en el canal
    await client.publish([localVideoTrack, localAudioTrack]);
    console.log("Audio y video local publicados en el canal");

    // 7. Escuchar la publicación de otros usuarios remotos
    client.on("user-published", handleUserPublished);

    // 8. Escuchar cuando un usuario remoto deja de publicar
    client.on("user-unpublished", handleUserUnpublished);
  } catch (error) {
    console.error("Error al inicializar la reunión:", error);
  }
}

// Función para manejar la publicación de un usuario remoto
async function handleUserPublished(user, mediaType) {
  console.log("Usuario publicado:", user.uid);

  // Suscribirse a los tracks publicados (audio o video)
  await client.subscribe(user, mediaType);

  if (mediaType === "video") {
    const remoteVideoTrack = user.videoTrack;
    remoteVideoTrack.play(remoteVideoContainer);
  } else if (mediaType === "audio") {
    const remoteAudioTrack = user.audioTrack;
    remoteAudioTrack.play(); // Reproducir el audio remoto
  }
}

// Función para manejar la despublicación de un usuario remoto
function handleUserUnpublished(user) {
  console.log("Usuario no publicado:", user.uid);
  remoteVideoContainer.innerHTML = ""; // Limpiar el contenedor de video remoto
}

// Función para alternar el micrófono
function toggleMute() {
  if (localAudioTrack) {
    isMuted = !isMuted;
    localAudioTrack.setEnabled(!isMuted);

    if (isMuted) {
      muteButton.classList.remove("fa-microphone");
      muteButton.classList.add("fa-microphone-slash");
    } else {
      muteButton.classList.remove("fa-microphone-slash");
      muteButton.classList.add("fa-microphone");
    }
  }
}

// Función para alternar el video
function toggleVideo() {
  if (localVideoTrack) {
    isVideoOff = !isVideoOff;
    localVideoTrack.setEnabled(!isVideoOff);

    if (isVideoOff) {
      videoButton.classList.remove("fa-video");
      videoButton.classList.add("fa-video-slash");
      localVideoContainer.style.display = "none";
    } else {
      videoButton.classList.remove("fa-video-slash");
      videoButton.classList.add("fa-video");
      localVideoContainer.style.display = "block";
    }
  }
}

// Configurar eventos de botones
document.addEventListener("DOMContentLoaded", () => {
  // Iniciar la reunión
  initMeeting();

  // Configurar botones de mute y video
  const silenceButton = document.querySelector(".btn-silence");
  const videoButtonContainer = document.querySelector(".btn-rec");

  silenceButton.addEventListener("click", toggleMute);
  videoButtonContainer.addEventListener("click", toggleVideo);
});
