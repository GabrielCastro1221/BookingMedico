document.addEventListener("DOMContentLoaded", () => {
  const mainServices = document.getElementById("main-services");

  const services = [
    {
      icon: "fa-solid fa-truck-medical",
      title: "Agendar citas medicas",
      description:
        "En nuestra plataforma, los pacientes tienen la posibilidad de agendar citas médicas tanto de manera virtual como presencial. Nuestra plataforma garantiza que cada paciente pueda acceder a la atención médica de calidad que necesita.",
    },
    {
      icon: "fa-regular fa-hospital",
      title: "Perfil de doctores",
      description:
        "Cada doctor deberá diligenciar un formulario en el que se almacenará la información sobre su especialidad y los horarios disponibles para las citas médicas. Cuando el perfil sea aprobado, podrá recibir citas de sus pacientes.",
    },
    {
      icon: "fa-regular fa-heart",
      title: "Metodos De Pagos",
      description:
        "Si se agenda una cita presencial el paciente podra realizar el pago en el sitio de la consulta medica, pero si la cita es online el pago debera hacerse por la pasarela de pago de la plataforma para que el enlace de la video consulta se active.",
    },
  ];

  services.forEach((service) => {
    const div = document.createElement("div");
    div.className = "inner-services";

    const iconDiv = document.createElement("div");
    iconDiv.className = "service-icon";

    const icon = document.createElement("i");
    icon.className = service.icon;

    const h3 = document.createElement("h3");
    h3.textContent = service.title;

    const p = document.createElement("p");
    p.textContent = service.description;

    iconDiv.appendChild(icon);
    div.appendChild(iconDiv);
    div.appendChild(h3);
    div.appendChild(p);

    mainServices.appendChild(div);
  });
});
