document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("input[name='query']");
  const mainInnerDoctor = document.querySelector(".main-inner-doctor");

  const fetchAllDoctors = async () => {
    try {
      const response = await fetch("/todos-los-doctores");
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const allDoctors = doc.querySelector(".main-inner-doctor").innerHTML;
      mainInnerDoctor.innerHTML = allDoctors;
    } catch (error) {
      console.error("Error al obtener todos los doctores:", error);
    }
  };

  searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (!query) {
      await fetchAllDoctors();
      return;
    }

    try {
      const response = await fetch(
        `/buscar-doctor?query=${encodeURIComponent(query)}`
      );
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const newDoctors = doc.querySelector(".main-inner-doctor").innerHTML;
      mainInnerDoctor.innerHTML = newDoctors;
    } catch (error) {
      console.error("Error al buscar doctores:", error);
    }
  });

  fetchAllDoctors();
});
