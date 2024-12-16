document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profileForm");
  const userPhoto = document.getElementById("userPhoto");

  const loadUserData = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      form.email.value = userData.email || "";
      form.name.value = userData.name || "";
      form.phone.value = userData.phone || "";
      form.gender.value = userData.gender || "masculino";
      form.bloodType.value = userData.blood_type || "";
      userPhoto.src =
        userData.photo ||
        "https://vineview.com/wp-content/uploads/2017/07/avatar-no-photo-300x300.png";
    } else {
      console.error("No se encontraron datos del usuario en localStorage.");
    }
  };

  form.customFile.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        userPhoto.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userData = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!userData || !userData._id) {
      alert("No se encontró el ID del usuario.");
      return;
    }

    if (!token) {
      alert("No se proporcionó el token.");
      return;
    }

    const id = userData._id;
    const formData = new FormData(form);

    try {
      const response = await fetch(`/api/v1/users/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        const updatedData = {
          ...userData,
          ...Object.fromEntries(formData),
          photo: userPhoto.src,
        };
        localStorage.setItem("user", JSON.stringify(updatedData));

        Toastify({
          text: result.message,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }).showToast();

        setTimeout(() => {
          window.location.reload();
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
        text: "Hubo un error al actualizar el perfil.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
      }).showToast();
    }
  });

  loadUserData();
});
