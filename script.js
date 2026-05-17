const header = document.querySelector(".site-header");
const form = document.querySelector(".contact-form");
const navToggle = document.getElementById("nav-toggle");
const mainNav = document.getElementById("main-nav");

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxe0GqTSK_5QZbnlE6mtoNu0plWNlnwWpYHXCnwJhC3Dc-Ss5kJlAWZQ_GYpniutxgt/exec";

if (!header || !form || !navToggle || !mainNav) {
  console.error("SmartQ: elemento requerido no encontrado en el DOM.");
}

const syncHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 18);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Cerrar menu" : "Abrir menu");
  document.body.style.overflow = isOpen ? "hidden" : "";
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menu");
    document.body.style.overflow = "";
  });
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector("button");
  const status = form.querySelector(".form-status");
  const data = new FormData(form);

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  button.textContent = "Enviando...";
  button.disabled = true;
  if (status) {
    status.textContent = "Estamos enviando tu consulta.";
  }

  try {
    if (!GOOGLE_SCRIPT_URL) {
      throw new Error("Falta configurar GOOGLE_SCRIPT_URL en script.js.");
    }

    data.append("source", "SmartQ Web");
    data.append("page", window.location.href);
    data.append("sent_at", new Date().toISOString());

    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: data,
    });

    form.reset();
    if (status) {
      status.textContent = "Consulta enviada. Te vamos a contactar pronto.";
    }
  } catch (error) {
    console.error("SmartQ: error al enviar el formulario.", error);
    if (status) {
      status.textContent = "No pudimos enviar la consulta. Probá nuevamente o escribinos por WhatsApp.";
    }
  } finally {
    button.disabled = false;
    button.textContent = "Enviar consulta";
  }
});
