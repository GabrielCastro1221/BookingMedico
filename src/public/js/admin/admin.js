document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".tabs-btns button");
  const sections = document.querySelectorAll(".tab-content");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-target");

      sections.forEach((section) => {
        if (section.id === target) {
          section.style.display = "block";
        } else {
          section.style.display = "none";
        }
      });
    });
  });

  sections.forEach((section, index) => {
    if (index === 0) {
      section.style.display = "block";
    } else {
      section.style.display = "none";
    }
  });
});

const logoutButton = document.querySelector(".logout-button");
logoutButton.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
});