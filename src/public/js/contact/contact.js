const btn = document.getElementById("button");

document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();

  btn.value = "Enviando Mensaje...";

  const serviceID = "default_service";
  const templateID = "template_91wpmec";

  emailjs.sendForm(serviceID, templateID, this).then(
    () => {
      btn.value = "Enviar Mensaje";
      Toastify({
        text: "Mensaje enviado con éxito!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        background: "#4CAF50",
        stopOnFocus: true,
        style: {
          fontSize: "18px",
        },
      }).showToast();
    },
    (err) => {
      btn.value = "Enviar Mensaje";
      Toastify({
        text: `Error: ${JSON.stringify(err)}`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        background: "#FF0000",
        stopOnFocus: true,
        style: {
          fontSize: "18px",
        },
      }).showToast();
    }
  );
});
