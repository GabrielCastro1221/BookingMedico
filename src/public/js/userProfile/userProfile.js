document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".tabs-btns button");
  const sections = document.querySelectorAll(".profile-content");

  const showSection = (targetId) => {
    sections.forEach((section) => {
      section.style.display = section.id === targetId ? "block" : "none";
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      showSection(targetId);
    });
  });

  showSection("profile");

  const token = localStorage.getItem("token");
  if (token) {
    getUserProfile(token);
  }
});

const getUserProfile = async (token) => {
  try {
    const response = await fetch("/api/v1/users/profile/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/";
      } else {
        throw new Error("Error al obtener el perfil del usuario");
      }
    }

    const result = await response.json();
    if (result.success) {
      renderProfile(result.data);
      renderBookings(result.data.bookings);
    } else {
      console.error(result.message);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const renderProfile = (data) => {
  const profileContainer = document.querySelector(".perfil-usuario-body");
  const fields = {
    name: ".perfil-usuario-bio .titulo",
    email: ".lista-datos li:nth-child(1) span",
    phone: ".lista-datos li:nth-child(2) span",
    gender: ".lista-datos li:nth-child(3) span",
    role: ".lista-datos li:nth-child(4) span",
    blood_type: ".lista-datos li:nth-child(5) span",
  };

  Object.keys(fields).forEach((key) => {
    const element = profileContainer.querySelector(fields[key]);
    if (element) {
      element.textContent = data[key] || "No especificado";
    }
  });

  const avatarImg = document.querySelector(".perfil-usuario-avatar img");
  if (avatarImg) {
    avatarImg.src =
      data.photo ||
      "https://vineview.com/wp-content/uploads/2017/07/avatar-no-photo-300x300.png";
  }
};

const renderBookings = (bookings) => {
  const bookingsContainer = document.querySelector("#citas");
  bookingsContainer.innerHTML = "";

  if (bookings.length === 0) {
    bookingsContainer.innerHTML = "<p>No tienes citas agendadas.</p>";
    return;
  }

  const list = document.createElement("ul");
  list.classList.add("lista-citas");

  bookings.forEach((booking) => {
    const listItem = document.createElement("li");
    listItem.classList.add("cita-item");
    listItem.innerHTML = `
      <div class="cita-header">
        <div>
          <span class="cita-date">Fecha: ${new Date(
            booking.appointment_date
          ).toLocaleString()}</span>
        </div>
        <h3>Doctor: <span style="color: black;">${
          booking.doctor.name
        }</span></h3>
      </div>
      <div class="cita-body">
        <h3>Precio: <span style="color: black;">$${
          booking.ticket_price
        } COP</span></h3>
      </div>
      <strong class="cita-type t">Tipo de cita: <span class="s">${booking.type}<span></strong>
      <div class="cita-footer">
        ${
          booking.type === "online"
            ? `<a href="/video-consulta/${booking._id}" class="btn-link">Unirse a la cita</a>`
            : ""
        }
      </div>
    `;
    list.appendChild(listItem);
  });

  bookingsContainer.appendChild(list);
};

const datos = [
  { icono: "fa-solid fa-envelope", texto: "Email", valor: "" },
  { icono: "fas fa-phone-alt", texto: "Teléfono", valor: "" },
  { icono: "fa-solid fa-venus-mars", texto: "Género", valor: "" },
  { icono: "fa-solid fa-address-book", texto: "Rol", valor: "" },
  { icono: "fa-solid fa-droplet", texto: "Sangre", valor: "" },
];

const botones = [
  { clase: "group-1", dataTarget: "profile", texto: "Mi Perfil" },
  { clase: "group-1", dataTarget: "citas", texto: "Citas Médicas" },
  { clase: "group-1", dataTarget: "editar", texto: "Editar Perfil" },
];

const perfilBio = {
  titulo: "Biografía del Usuario",
  texto:
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
};

const avatarData = {
  imagenUrl:
    "https://vineview.com/wp-content/uploads/2017/07/avatar-no-photo-300x300.png",
  botonTexto: "Cambiar Avatar",
  botonIcono: "far fa-image",
};

const lista = document.querySelector(".lista-datos");

datos.forEach((dato) => {
  const li = document.createElement("li");
  const icono = document.createElement("i");
  icono.className = `${dato.icono} icono`;
  const texto = document.createTextNode(` ${dato.texto}: `);
  const span = document.createElement("span");
  span.textContent = dato.valor;
  li.appendChild(icono);
  li.appendChild(texto);
  li.appendChild(span);
  lista.appendChild(li);
});

const contenedorBotones = document.querySelector(".tabs-btns");

botones.forEach((boton) => {
  const button = document.createElement("button");
  button.className = boton.clase;
  button.setAttribute("data-target", boton.dataTarget);
  button.textContent = boton.texto;
  contenedorBotones.appendChild(button);
});

const perfilUsuarioBio = document.querySelector(".perfil-usuario-bio");
const titulo = document.createElement("h3");
titulo.className = "titulo";
titulo.textContent = perfilBio.titulo;

const texto = document.createElement("p");
texto.className = "texto";
texto.textContent = perfilBio.texto;

perfilUsuarioBio.appendChild(titulo);
perfilUsuarioBio.appendChild(texto);

const avatarContainer = document.querySelector(".perfil-usuario-avatar");

const imagen = document.createElement("img");
imagen.src = avatarData.imagenUrl;
imagen.alt = "img-avatar";

const boton = document.createElement("button");
boton.type = "button";
boton.className = "boton-avatar";

const icono = document.createElement("i");
icono.className = avatarData.botonIcono;

boton.appendChild(icono);
boton.appendChild(document.createTextNode(` ${avatarData.botonTexto}`));

avatarContainer.appendChild(imagen);
avatarContainer.appendChild(boton);

const logoutButton = document.querySelector(".logout-button");
logoutButton.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
});

const deleteButton = document.querySelector(".delete-button");

deleteButton.addEventListener("click", async () => {
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
  try {
    const response = await fetch(`/api/v1/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    const result = await response.json();
    if (response.ok) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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
    console.error("Error al eliminar el usuario:", error);
    Toastify({
      text: "Hubo un error al eliminar la cuenta.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      background: "linear-gradient(to right, #ff5f6d, #ffc371)",
    }).showToast();
  }
});
