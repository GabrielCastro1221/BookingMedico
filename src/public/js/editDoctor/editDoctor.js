document.addEventListener("DOMContentLoaded", () => {
  const photoInput = document.getElementById("photo");
  const photoPreview = document.getElementById("photoPreview");
  const uploadButton = document.getElementById("uploadButton");
  const form = document.getElementById("profileForm");

  let doctorData;

  uploadButton.addEventListener("click", () => {
    photoInput.click();
  });

  photoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        photoPreview.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  });

  const loadDoctorData = () => {
    doctorData = JSON.parse(localStorage.getItem("user"));
    if (doctorData) {
      form.email.value = doctorData.email || "";
      form.name.value = doctorData.name || "";
      form.phone.value = doctorData.phone || "";
      form.gender.value = doctorData.gender || "";
      form.specialization.value = doctorData.specialization || "";
      form.ticketPrice.value = doctorData.ticket_price || "";
      form.bio.value = doctorData.bio || "";
      form.about.value = doctorData.about || "";
      photoPreview.src =
        doctorData.photo ||
        "https://vineview.com/wp-content/uploads/2017/07/avatar-no-photo-300x300.png";
    } else {
      console.error("No se encontraron datos del doctor en localStorage.");
    }
  };

  loadDoctorData();

  const addSectionItem = (containerId, templateHTML) => {
    const container = document.getElementById(containerId);
    const item = document.createElement("div");
    item.innerHTML = templateHTML;
    container.appendChild(item);
  };

  document.getElementById("addQualification").addEventListener("click", () => {
    addSectionItem(
      "qualificationsContainer",
      `<div class="form-group">
          <input type="text" placeholder="Título">
          <input type="text" placeholder="Universidad">
          <input type="date" placeholder="Fecha de Inicio">
          <input type="date" placeholder="Fecha de Fin">
          <button type="button" class="delete-button">Eliminar</button>
        </div>`
    );
  });

  document.getElementById("addExperience").addEventListener("click", () => {
    addSectionItem(
      "experiencesContainer",
      `<div class="form-group">
          <input type="text" placeholder="Cargo">
          <input type="text" placeholder="Hospital">
          <input type="date" placeholder="Fecha de Inicio">
          <input type="date" placeholder="Fecha de Fin">
          <button type="button" class="delete-button">Eliminar</button>
        </div>`
    );
  });

  document.getElementById("addTimeSlot").addEventListener("click", () => {
    addSectionItem(
      "timeSlotsContainer",
      `<div class="form-group">
          <label for="day">Día</label>
          <select id="day" name="day">
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miércoles">Miércoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
            <option value="Sábado">Sábado</option>
            <option value="Domingo">Domingo</option>
          </select>
          <input type="time" placeholder="Hora Inicio">
          <input type="time" placeholder="Hora Fin">
          <button type="button" class="delete-button">Eliminar</button>
        </div>`
    );
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-button")) {
      const parent = e.target.closest(".form-group");
      if (parent) {
        parent.remove();
      }
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const file = photoInput.files[0];
    if (file) {
      formData.append("photo", file);
    }

    const qualifications = [];
    document
      .querySelectorAll("#qualificationsContainer .form-group")
      .forEach((group) => {
        const degree = group.querySelector("input[placeholder='Título']").value;
        const university = group.querySelector(
          "input[placeholder='Universidad']"
        ).value;
        const startingDate = group.querySelector(
          "input[placeholder='Fecha de Inicio']"
        ).value;
        const endingDate = group.querySelector(
          "input[placeholder='Fecha de Fin']"
        ).value;
        if (degree && university && startingDate && endingDate) {
          qualifications.push({ degree, university, startingDate, endingDate });
        }
      });
    formData.append("education", JSON.stringify(qualifications));

    const experiences = [];
    document
      .querySelectorAll("#experiencesContainer .form-group")
      .forEach((group) => {
        const position = group.querySelector(
          "input[placeholder='Cargo']"
        ).value;
        const hospital = group.querySelector(
          "input[placeholder='Hospital']"
        ).value;
        const startingDate = group.querySelector(
          "input[placeholder='Fecha de Inicio']"
        ).value;
        const endingDate = group.querySelector(
          "input[placeholder='Fecha de Fin']"
        ).value;
        if (position && hospital && startingDate && endingDate) {
          experiences.push({ position, hospital, startingDate, endingDate });
        }
      });
    formData.append("experiences", JSON.stringify(experiences));

    const timeSlots = [];
    document
      .querySelectorAll("#timeSlotsContainer .form-group")
      .forEach((group) => {
        const day = group.querySelector("select[name='day']").value;
        const startingTime = group.querySelector(
          "input[placeholder='Hora Inicio']"
        ).value;
        const endingTime = group.querySelector(
          "input[placeholder='Hora Fin']"
        ).value;
        if (day && startingTime && endingTime) {
          timeSlots.push({ day, startingTime, endingTime });
        }
      });
    formData.append("timeSlots", JSON.stringify(timeSlots));

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/v1/doctors/${doctorData._id}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.status) {
        localStorage.setItem("user", JSON.stringify(result.doctor));
        Toastify({
          text: "Perfil actualizado con éxito",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          background: "#4CAF50",
        }).showToast();
        setTimeout(() => {
          location.reload();
        }, 3000);
      } else {
        Toastify({
          text: "Error al actualizar el perfil: " + result.message,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          background: "#FF0000",
        }).showToast();
      }
    } catch (err) {
      console.error("Error al actualizar el perfil:", err);
      Toastify({
        text: "Error al actualizar el perfil",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        background: "#FF0000",
      }).showToast();
    }
  });
});
