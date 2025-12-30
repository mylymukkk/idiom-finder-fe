import { loadLanguage } from "./language.js";

document.addEventListener("DOMContentLoaded", () => {
  const langBtn = document.getElementById("lang-btn");
  const langMenu = document.getElementById("language-dropdown-menu");
  const sourcesToggle = document.getElementById("sources-toggle");

  // Джерела
  sourcesToggle?.addEventListener("click", () => {
    document.getElementById("sources-content")?.classList.toggle("hidden");
    document.getElementById("sources-arrow")?.classList.toggle("rotate-180");
  });

  // Мовне меню
  langBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    langMenu?.classList.toggle("hidden");
  });

  document.addEventListener("click", () => langMenu?.classList.add("hidden"));

  // Вибір мови
  langMenu?.addEventListener("click", (e) => {
    const link = e.target.closest("[data-lang]");
    if (link) {
      e.preventDefault();
      loadLanguage(link.dataset.lang);
    }
  });
});
