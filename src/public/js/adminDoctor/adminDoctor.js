document.addEventListener("DOMContentLoaded", async () => {
  const doctorCardContainer = document.getElementById("doctor-card-container");

  try {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/v1/doctors", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.status) {
      data.Doctores.forEach((doctor) => {
        const doctorCard = document.createElement("div");
        doctorCard.classList.add("doctor-card");

        const renderList = (items, emptyMessage = "N/A") => {
          if (!items || items.length === 0) {
            return emptyMessage;
          }
          return `<ul>${items
            .map((item) => {
              if (typeof item === "object") {
                return `<li>${Object.values(item).join(" - ")}</li>`;
              }
              return `<li>${item}</li>`;
            })
            .join("")}</ul>`;
        };

        doctorCard.innerHTML = `
          <div class="doctor-photo">
            <img src="${
              doctor.photo ||
              "https://vineview.com/wp-content/uploads/2017/07/avatar-no-photo-300x300.png"
            }" alt="Foto del doctor">
          </div>
          <div class="doctor-info">
            <h2>${doctor.name}</h2>
            <p><strong>Email:</strong> ${doctor.email}</p>
            <p><strong>Teléfono:</strong> ${doctor.phone || "N/A"}</p>
            <p><strong>Precio de la Cita:</strong> ${
              doctor.ticket_price || "N/A"
            }</p>
            <p><strong>Especialización:</strong> ${
              doctor.specialization || "N/A"
            }</p>
            <p><strong>Educación:</strong> ${renderList(doctor.education)}</p>
            <p><strong>Experiencias:</strong> ${renderList(
              doctor.experiences
            )}</p>
            <p><strong>Horarios:</strong> ${renderList(doctor.timeSlots)}</p>
            <p><strong>Estado:</strong> <span class="doctor-status">${
              doctor.isApproved
            }</span></p>
            <div class="btn-doctor">
              <button class="approveDoctor" data-id="${
                doctor._id
              }">Aprobar</button>
              <button class="cancelDoctor" data-id="${
                doctor._id
              }">Cancelar</button>
              <button class="deleteDoctor" data-id="${
                doctor._id
              }">Eliminar</button>
            </div>
          </div>
        `;

        doctorCard
          .querySelector(".approveDoctor")
          .addEventListener("click", async (event) => {
            const doctorId = event.target.dataset.id;

            try {
              const approveResponse = await fetch(
                `/api/v1/doctors/${doctorId}/approval-status`,
                {
                  method: "PUT",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              const approveData = await approveResponse.json();
              if (approveResponse.ok) {
                const doctorStatusElement = doctorCard.querySelector(
                  ".doctor-status"
                );
                doctorStatusElement.textContent = approveData.data.isApproved;
                Toastify({
                  text: "Doctor aprobado con éxito",
                  duration: 3000,
                  close: true,
                  gravity: "top",
                  position: "right",
                  background: "#4CAF50",
                }).showToast();
              } else {
                Toastify({
                  text: `Error al aprobar el doctor: ${approveData.message}`,
                  duration: 3000,
                  close: true,
                  gravity: "top",
                  position: "right",
                  background: "#FF0000",
                }).showToast();
              }
            } catch (err) {
              console.error("Error al aprobar el doctor:", err);
              Toastify({
                text: "Error al aprobar el doctor",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                background: "#FF0000",
              }).showToast();
            }
          });

        doctorCard
          .querySelector(".cancelDoctor")
          .addEventListener("click", async (event) => {
            const doctorId = event.target.dataset.id;

            try {
              const cancelResponse = await fetch(
                `/api/v1/doctors/${doctorId}/cancelled-status`,
                {
                  method: "PUT",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              const cancelData = await cancelResponse.json();
              if (cancelResponse.ok) {
                const doctorStatusElement = doctorCard.querySelector(
                  ".doctor-status"
                );
                doctorStatusElement.textContent = cancelData.data.isApproved;
                Toastify({
                  text: "Doctor cancelado con éxito",
                  duration: 3000,
                  close: true,
                  gravity: "top",
                  position: "right",
                  background: "#4CAF50",
                }).showToast();
              } else {
                Toastify({
                  text: `Error al cancelar el doctor: ${cancelData.message}`,
                  duration: 3000,
                  close: true,
                  gravity: "top",
                  position: "right",
                  background: "#FF0000",
                }).showToast();
              }
            } catch (err) {
              console.error("Error al cancelar el doctor:", err);
              Toastify({
                text: "Error al cancelar el doctor",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                background: "#FF0000",
              }).showToast();
            }
          });

        doctorCard
          .querySelector(".deleteDoctor")
          .addEventListener("click", async (event) => {
            const doctorId = event.target.dataset.id;

            const result = await Swal.fire({
              title: "¿Estás seguro?",
              text: "Esta acción no se puede deshacer",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Sí, eliminarlo",
              cancelButtonText: "Cancelar",
            });

            if (result.isConfirmed) {
              try {
                const deleteResponse = await fetch(
                  `/api/v1/doctors/${doctorId}`,
                  {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                  }
                );

                const deleteData = await deleteResponse.json();

                if (deleteResponse.ok) {
                  Toastify({
                    text: deleteData.message,
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                    className: "info",
                    position: "right",
                    duration: 3000,
                  }).showToast();
                  doctorCard.remove();
                } else {
                  Toastify({
                    text: deleteData.message || "Error al eliminar el doctor.",
                    background: "linear-gradient(to right, #ff5f6d, #ffc3a0)",
                    className: "error",
                    position: "right",
                    duration: 3000,
                  }).showToast();
                }
              } catch (error) {
                console.error("Error al eliminar el doctor:", error);
                Toastify({
                  text: "Error de red al intentar eliminar el doctor.",
                  background: "linear-gradient(to right, #ff5f6d, #ffc3a0)",
                  className: "error",
                  position: "right",
                  duration: 3000,
                }).showToast();
              }
            }
          });

        doctorCardContainer.appendChild(doctorCard);
      });
    }
  } catch (error) {
    console.error("Error fetching doctors:", error);
    Toastify({
      text: "Error al cargar los datos de los doctores.",
      background: "linear-gradient(to right, #ff5f6d, #ffc3a0)",
      className: "error",
      position: "right",
      duration: 3000,
    }).showToast();
  }
});
