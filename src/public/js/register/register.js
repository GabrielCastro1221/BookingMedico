document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form");
  const preview = document.querySelector(".preview");
  form.customFile.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        Toastify({
          text: result.message,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }).showToast();

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        Toastify({
          text: `Error: ${result.message}`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        }).showToast();
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      Toastify({
        text: "Hubo un error al registrar el usuario.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
      }).showToast();
    }
  });
});
