document.addEventListener("DOMContentLoaded", () => {
  const sections = [
    {
      id: "main-technology",
      content: [
        {
          icon: "fi fi-tr-hands-heart",
          title: "Encontrar Doctor",
          description:
            "Te ayudamos a encontrar al médico que necesitas de manera rápida y sencilla. No importa dónde te encuentres, nuestra herramienta de búsqueda te conecta con los mejores profesionales la salud.",
        },
        {
          icon: "fi fi-rr-doctor",
          title: "Nuestra ubicación",
          description:
            "Cada especialista tiene su propia clínica o consultorio en diferentes partes de la ciudad y sus alrededores. Nuestra plataforma te permite encontrar al profesional adecuado cerca de    ti.",
        },
        {
          icon: "fi fi-tr-user-md",
          title: "Agendar una cita",
          description:
            "Citas Presenciales: Elige la fecha de tu cita y visita a tu doctor en su               consultorio. citas Online: Si prefieres una consulta desde la comodidad de tu hogar, también  puedes agendar citas virtuales.",
        },
      ],
      render: (item) => {
        const div = document.createElement("div");
        div.className = "inner-technology";

        const span = document.createElement("span");

        const icon = document.createElement("i");
        icon.className = item.icon;

        const h2 = document.createElement("h2");
        h2.textContent = item.title;

        const p = document.createElement("p");
        p.textContent = item.description;

        div.appendChild(span);
        div.appendChild(icon);
        div.appendChild(h2);
        div.appendChild(p);

        return div;
      },
    },
    {
      id: "main-about",
      content: {
        heading: "Acerca de Health Point Manizales",
        imageSrc: "/assets/img/about3.jpg",
        imageAlt: "About Image",
        title: "Brindamos un servicio integral a nuestros pacientes.",
        description1:
          "Ofrecemos los servicios médicos más completos para que todas las personas tengan la oportunidad de recibir atención médica de calidad.",
        description2:
          "En Health Point Manizales, nos enorgullece ofrecer una plataforma integral para agendar citas médicas tanto online como presenciales. Nuestra plataforma ofrece servicio de clase mundial, permitiendo a los pacientes reservar citas con doctores especializados en diversas áreas de la medicina.",
      },
      render: (content) => {
        const aboutHeading = document.createElement("div");
        aboutHeading.className = "about-heading";
        aboutHeading.textContent = content.heading;

        const innerMainAbout = document.createElement("div");
        innerMainAbout.className = "inner-main-about";

        const aboutInnerContentLeft = document.createElement("div");
        aboutInnerContentLeft.className = "about-inner-content-left";

        const img = document.createElement("img");
        img.src = content.imageSrc;
        img.alt = content.imageAlt;

        aboutInnerContentLeft.appendChild(img);

        const aboutInnerContent = document.createElement("div");
        aboutInnerContent.className = "about-inner-content";

        const aboutRightContent = document.createElement("div");
        aboutRightContent.className = "about-right-content";

        const h2 = document.createElement("h2");
        h2.innerHTML = content.title;

        const p1 = document.createElement("p");
        p1.textContent = content.description1;

        const p2 = document.createElement("p");
        p2.className = "aboutsec-content";
        p2.textContent = content.description2;

        const button = document.createElement("button");
        button.textContent = content.buttonText;

        aboutRightContent.appendChild(h2);
        aboutRightContent.appendChild(p1);
        aboutRightContent.appendChild(p2);
        aboutRightContent.appendChild(button);

        aboutInnerContent.appendChild(aboutRightContent);
        innerMainAbout.appendChild(aboutInnerContentLeft);
        innerMainAbout.appendChild(aboutInnerContent);

        const fragment = document.createDocumentFragment();
        fragment.appendChild(aboutHeading);
        fragment.appendChild(innerMainAbout);

        return fragment;
      },
    },
    {
      id: "main-home",
      content: {
        welcomeText: "Bienvenidos a Health Point Manizales.",
        title: "Comprometidos con el bienestar integral de nuestros pacientes.",
        description:
          "Otorgamos atención medica de calidad fomentando el humanismo,innovación y excelencia logrando la seguridad del paciente, su satisfacción y confianza. Prevenimos y fomentamos estándares en salud.",
        buttons: [
          { href: "/servicios", text: "Información" },
          { href: "/doctores", text: "Doctores", class: "homebtnsec" },
        ],
        imageSrc: "/assets/img/her1.png",
        imageAlt: "Hero Image",
      },
      render: (content) => {
        const homeDiv = document.createElement("div");
        homeDiv.className = "home";

        const homeLeftContent = document.createElement("div");
        homeLeftContent.className = "home-left-content";

        const span = document.createElement("span");
        span.textContent = content.welcomeText;

        const h2 = document.createElement("h2");
        h2.innerHTML = content.title;

        const p = document.createElement("p");
        p.className = "lorem";
        p.textContent = content.description;

        const homeBtnDiv = document.createElement("div");
        homeBtnDiv.className = "home-btn";

        content.buttons.forEach((button) => {
          const a = document.createElement("a");
          a.href = button.href;
          a.textContent = button.text;
          if (button.class) {
            a.className = button.class;
          }
          homeBtnDiv.appendChild(a);
        });

        homeLeftContent.appendChild(span);
        homeLeftContent.appendChild(h2);
        homeLeftContent.appendChild(p);
        homeLeftContent.appendChild(homeBtnDiv);

        const homeRightContent = document.createElement("div");
        homeRightContent.className = "home-right-content";

        const img = document.createElement("img");
        img.src = content.imageSrc;
        img.alt = content.imageAlt;

        homeRightContent.appendChild(img);

        homeDiv.appendChild(homeLeftContent);
        homeDiv.appendChild(homeRightContent);

        return homeDiv;
      },
    },
  ];

  sections.forEach((section) => {
    const container = document.getElementById(section.id);
    if (container) {
      if (Array.isArray(section.content)) {
        section.content.forEach((item) => {
          container.appendChild(section.render(item));
        });
      } else {
        container.appendChild(section.render(section.content));
      }
    }
  });

  const faqs = [
    {
      question: "¿De que consta la atencion medica?",
      answer:
        "La atención médica incluye una variedad de servicios para mantener y mejorar la salud de los pacientes. Esto puede abarcar desde consultas médicas generales, diagnósticos y tratamientos de enfermedades, hasta servicios especializados como cirugías, terapias físicas y rehabilitación. Además, la atención médica también incluye asesoramiento preventivo, prescripción de medicamentos y seguimiento continuo de la salud del paciente para asegurar el mejor resultado posible.",
    },
    {
      question: "¿Qué pasa si necesito ir a un hospital?",
      answer:
        "Si necesitas ir a un hospital, lo primero es contactar con tu médico de cabecera o servicio de urgencias para recibir instrucciones precisas. Ellos te indicarán si es necesario ir al hospital y qué pasos seguir. Una vez en el hospital, recibirás la atención médica adecuada basada en tus necesidades, que puede incluir evaluación inicial, pruebas diagnósticas, tratamiento y posibles intervenciones. No olvides llevar contigo información médica relevante y cualquier medicamento que estés tomando.",
    },
    {
      question: "¿Brinda servicio de citas medicas online?",
      answer:
        "Sí, ofrecemos servicios de citas médicas en línea. Puedes agendar una cita directamente desde nuestra plataforma, seleccionar el doctor que desees y coordinar una consulta virtual sin necesidad de desplazarte. Esto te permite recibir atención médica de manera más conveniente y rápida. Además, puedes gestionar y revisar tus citas desde nuestro panel de usuario.",
    },
    {
      question: "¿Brinda servicio de citas presenciales?",
      answer:
        "Sí, también ofrecemos servicios de citas presenciales. Puedes agendar una cita con tu médico preferido a través de nuestra plataforma y asistir personalmente a la consulta en la fecha y hora seleccionadas. Nos aseguramos de facilitar el proceso de reserva para que puedas obtener la atención médica necesaria de manera eficiente y sin complicaciones.",
    },
  ];

  const faqList = document.getElementById("faq-list");

  faqs.forEach((faq) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <div class="question-arrow">
                <span class="question">${faq.question}</span>
                <i class="fa-solid fa-angle-down arrow"></i>
            </div>
            <p>${faq.answer}</p>
            <span class="line"></span>
        `;
    faqList.appendChild(li);
  });

  let liElements = document.querySelectorAll(".faq-text li");
  liElements.forEach((li) => {
    li.addEventListener("click", (e) => {
      let clickedLi;
      if (e.target.classList.contains("question-arrow")) {
        clickedLi = e.target.parentElement;
      } else {
        clickedLi = e.target.parentElement.parentElement;
      }
      clickedLi.classList.toggle("showAnswer");
    });
  });
});
