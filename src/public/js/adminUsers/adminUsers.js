document.addEventListener("DOMContentLoaded", async () => {
  const userCardsContainer = document.getElementById("user-cards-container");

  try {
    const token = localStorage.getItem("token");

    const response = await fetch("/api/v1/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.status) {
      data.usuarios.forEach((user) => {
        const userCard = document.createElement("div");
        userCard.classList.add("user-card");

        userCard.innerHTML = `
            <div class="user-photo">
              <img src="${
                user.photo || "https://via.placeholder.com/150"
              }" alt="Foto del usuario">
            </div>
            <div class="user-info">
              <h2>${user.name}</h2>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Teléfono:</strong> ${user.phone || "N/A"}</p>
              <p><strong>Género:</strong> ${user.gender}</p>
              <p><strong>Rol:</strong> <span class="user-role">${
                user.role
              }</span></p>
              <p><strong>Tipo de Sangre:</strong> ${
                user.blood_type || "N/A"
              }</p>
              <p><strong>Reservas:</strong> ${user.booking.length}</p>
              <button class="delete-button btn-red deleteUser" data-id="${
                user._id
              }">Eliminar</button>
              <button class="change-role-button btn-rol rolUser" data-id="${
                user._id
              }">Cambiar Rol</button>
            </div>
          `;

        userCardsContainer.appendChild(userCard);
      });

      const deleteButtons = document.querySelectorAll(".delete-button");
      deleteButtons.forEach((button) => {
        button.addEventListener("click", async (e) => {
          const userId = e.target.getAttribute("data-id");

          try {
            const deleteResponse = await fetch(`/api/v1/users/${userId}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            const deleteData = await deleteResponse.json();

            if (deleteData.status) {
              e.target.closest(".user-card").remove();
              Toastify({
                text: "Usuario eliminado con éxito",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                background: "#4CAF50",
              }).showToast();
            } else {
              Toastify({
                text: `Error al eliminar el usuario: ${deleteData.message}`,
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                background: "#FF0000",
              }).showToast();
            }
          } catch (err) {
            console.error("Error al eliminar el usuario:", err);
            Toastify({
              text: "Error al eliminar el usuario",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "right",
              background: "#FF0000",
            }).showToast();
          }
        });
      });

      const changeRoleButtons = document.querySelectorAll(
        ".change-role-button"
      );
      changeRoleButtons.forEach((button) => {
        button.addEventListener("click", async (e) => {
          const userId = e.target.getAttribute("data-id");

          try {
            const changeRoleResponse = await fetch(
              `/api/v1/users/admin/${userId}`,
              {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            const changeRoleData = await changeRoleResponse.json();
            if (changeRoleResponse.ok) {
              const userRoleElement = e.target
                .closest(".user-card")
                .querySelector(".user-role");
              userRoleElement.textContent = changeRoleData.role;
              Toastify({
                text: "Rol del usuario cambiado con éxito",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                background: "#4CAF50",
              }).showToast();
            } else {
              Toastify({
                text: `Error al cambiar el rol del usuario: ${changeRoleData.message}`,
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                background: "#FF0000",
              }).showToast();
            }
          } catch (err) {
            console.error("Error al cambiar el rol del usuario:", err);
            Toastify({
              text: "Error al cambiar el rol del usuario",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "right",
              background: "#FF0000",
            }).showToast();
          }
        });
      });
    } else {
      userCardsContainer.innerHTML = `<p>${data.message}</p>`;
    }
  } catch (err) {
    userCardsContainer.innerHTML = `<p>Error al obtener los usuarios</p>`;
    console.error("Error al obtener los usuarios:", err);
  }
});
