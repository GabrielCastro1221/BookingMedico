document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".tabs-btns button");
  const contents = document.querySelectorAll(".tab-content");
  const logoutButton = document.querySelector(".logout-button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => handleButtonClick(button));
  });

  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }

  function handleButtonClick(button) {
    const target = button.getAttribute("data-target");
    if (target === "profile") {
      window.location.reload();
    } else {
      contents.forEach((content) => {
        content.style.display = content.id === target ? "block" : "none";
      });
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  async function fetchDoctorProfile() {
    try {
      const response = await fetch("/api/v1/doctors/profile/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los datos del perfil");
      }

      const data = await response.json();

      if (data.success) {
        updateProfile(data.data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  function updateProfile(data) {
    document.getElementById("doctor-photo").src = data.photo;
    document.getElementById("specialization").textContent = data.specialization;
    document.getElementById("doctor-name").textContent = data.name;
    document.getElementById("bio").textContent = data.bio;
    document.querySelector(".info-name").textContent = data.name;
    document.querySelector(".info-about").textContent = data.about;

    updateList(".education-list", data.education, (edu) => `
      <div>
        <span class="date">${new Date(edu.startingDate).toLocaleDateString()} - ${new Date(edu.endingDate).toLocaleDateString()}</span>
        <p class="degree">${edu.degree}</p>
      </div>
      <p class="university">${edu.university}</p>
    `);

    updateList(".experience-list", data.experiences, (exp) => `
      <div>
        <span class="date">${new Date(exp.startingDate).toLocaleDateString()} - ${new Date(exp.endingDate).toLocaleDateString()}</span>
        <p class="position">${exp.position}</p>
      </div>
      <p class="hospital">${exp.hospital}</p>
    `);

    updateList("#appointments .card-body", data.appoinments, (appt) => `
      <div class="card">
        <p><strong>Paciente:</strong> ${appt.user}</p>
        <p><strong>Fecha de la Cita:</strong> ${new Date(appt.appointment_date).toLocaleString()}</p>
        <p><strong>Pagado:</strong> ${appt.is_paid ? "Sí" : "No"}</p>
        <p><strong>Precio del Boleto:</strong> $${appt.ticket_price}</p>
        <p><strong>Tipo:</strong> ${appt.type}</p>
        <div class="btns-act">
        ${appt.type === "online" ? `<p><strong></strong> <a class="video_link" href="/video-consulta/${appt._id}" target="_blank">Unirse a la cita</a></p>` : ""}
        <button class="app" data-id="${appt._id}">Aprobar cita</button>
        <div>
      </div>
    `);
  }

  function updateList(selector, items, createItemHTML) {
    const list = document.querySelector(selector);
    list.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = selector.slice(1, -5) + "-item";
      li.innerHTML = createItemHTML(item);
      list.appendChild(li);
    });
  }

  async function changeStatusAppointment(id) {
    try {
      const response = await fetch(`/api/v1/doctors/approved/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cambiar el estado de la cita");
      }

      const data = await response.json();
      console.log("Estado de la cita actualizado:", data);
      Toastify({
        text: "Cita aprobada con éxito",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        background: "#4CAF50",
      }).showToast();
      fetchDoctorProfile(); 
    } catch (error) {
      console.error("Error:", error.message);
      Toastify({
        text: "Error al aprobar la cita",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        background: "#FF0000",
      }).showToast();
    }
  }

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("app")) {
      const appointmentId = e.target.getAttribute("data-id");
      changeStatusAppointment(appointmentId);
    }
  });

  fetchDoctorProfile();
});
