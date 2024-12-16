document.addEventListener("DOMContentLoaded", () => {
  const sidePanel = document.getElementById("side-panel");
  const submitButton = sidePanel.querySelector(".submit-button");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user._id : null;
  const userIdInput = document.getElementById("userId");
  if (userId) {
    userIdInput.value = userId;
  } else {
    console.warn("userId no encontrado en el localStorage");
  }

  submitButton.addEventListener("click", async () => {
    const doctorId = document.getElementById("doctorId").value;
    const doctorPhone = document
      .querySelector(".profile-info .bio")
      .textContent.trim();
    const appointmentDateStr = sidePanel.querySelector(".date-select").value;
    const ticketPrice = parseFloat(
      sidePanel
        .querySelector(".price-text")
        .textContent.replace("$", "")
        .replace(" COP", "")
    );
    const appointmentType = sidePanel.querySelector(
      "input[name='appointmentType']:checked"
    ).value;

    const [day, timeRange] = appointmentDateStr.split(" ");
    const [startingTime, endingTime] = timeRange.split(" - ");
    const appointmentDate = getNextDayOfWeek(day);
    appointmentDate.setHours(
      parseInt(startingTime.split(":")[0]),
      parseInt(startingTime.split(":")[1]),
      0,
      0
    );

    if (
      !userId ||
      !doctorId ||
      !appointmentDate ||
      !ticketPrice ||
      !appointmentType
    ) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/v1/users/create-appointment", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          doctorId,
          appointment_date: appointmentDate.toISOString(),
          ticket_price: ticketPrice,
          type: appointmentType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Cita agendada exitosamente",
          text: "Si la cita médica es presencial puedes pagar en el sitio de la consulta pero si la cita es online debes ponerte en contacto con el médico para acordar el medio de pago.",
          icon: "success",
        });
      } else {
        Toastify({
          text: `Error al agendar la cita: ${data.message}`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          background: "#FF0000",
        }).showToast();
      }
    } catch (error) {
      console.error("Error al agendar la cita:", error);
      Toastify({
        text: "Error al agendar la cita.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        background: "#FF0000",
      }).showToast();
    }
  });

  function getNextDayOfWeek(day) {
    const daysOfWeek = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const today = new Date();
    const todayDayIndex = today.getDay();
    const targetDayIndex = daysOfWeek.indexOf(day);

    let daysUntilNextAppointment = targetDayIndex - todayDayIndex;
    if (daysUntilNextAppointment <= 0) {
      daysUntilNextAppointment += 7;
    }

    const nextAppointmentDate = new Date(today);
    nextAppointmentDate.setDate(today.getDate() + daysUntilNextAppointment);
    return nextAppointmentDate;
  }
});
