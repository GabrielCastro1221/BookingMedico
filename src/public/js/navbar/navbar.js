document.addEventListener("DOMContentLoaded", () => {
  const menubar = document.querySelector("#menu-bars");
  const navbar = document.querySelector(".navbar");

  const links = [
    { href: "/inicio", text: "Inicio" },
    { href: "/doctores", text: "Doctores" },
    { href: "/servicios", text: "Servicios" },
    { href: "/contacto", text: "Contactanos" },
  ];

  const navbarContainer = document.getElementById("navbar");
  links.forEach((link) => {
    const a = document.createElement("a");
    a.href = link.href;
    a.textContent = link.text;
    navbarContainer.appendChild(a);
  });

  menubar.addEventListener("click", () => {
    menubar.classList.toggle("fa-times");
    navbar.classList.toggle("active");
  });

  const authButton = document.getElementById("auth-button");
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    authButton.textContent = "Mi Perfil";
    if (user.role === "doctor") {
      authButton.href = "/perfil-doctor";
    } else if (user.role === "paciente") {
      authButton.href = "/perfil-usuario";
    } else if (user.role === "admin") {
      authButton.href = "/perfil-admin";
    }
  } else {
    authButton.textContent = "Ingresar";
    authButton.href = "/";
  }
});
