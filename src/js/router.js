import { applyTranslations } from "./language.js";

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector('nav[aria-label="Main functions"]');

  nav?.addEventListener("click", async (e) => {
    const link = e.target.closest(".tab-link");
    if (!link) return;

    e.preventDefault();
    const page = link.dataset.tab;

    if (window.currentPage === page) return;

    updateTabUI(link);
    await loadPage(page);
  });
});

async function loadPage(page) {
  const container = document.getElementById("page-content");
  const searchForm = document.getElementById("search-form");
  if (!container) return;

  if (page === "view-all") {
    searchForm?.classList.add("hidden");
  } else {
    searchForm?.classList.remove("hidden");
  }

  try {
    const response = await fetch(`./pages/${page}.html`);
    if (!response.ok) throw new Error(`Page ${page} not found`);
    const html = await response.text();

    container.innerHTML = html;
    window.currentPage = page;

    applyTranslations();
    document.dispatchEvent(new Event("page-loaded"));
  } catch (err) {
    console.error("LoadPage Error:", err);
    container.innerHTML = `<p>Error loading content.</p>`;
  }
}

function updateTabUI(activeLink) {
  const allLinks = document.querySelectorAll(".tab-link");
  const key = activeLink.dataset.tab;

  allLinks.forEach((link) => {
    link.classList.remove("bg-brand", "text-white", "active");
    link.classList.add("hover:bg-neutral-secondary-soft");
    link.setAttribute("aria-selected", "false");
    link.removeAttribute("aria-current");
  });
  activeLink.classList.add("bg-brand", "text-white", "active");
  activeLink.classList.remove(
    "hover:text-heading",
    "hover:bg-neutral-secondary-soft"
  );
  activeLink.setAttribute("aria-selected", "true");
  activeLink.setAttribute("aria-current", "page");

  const infoBlock = document.querySelector("[data-tab-content]");
  if (infoBlock) {
    const h3 = infoBlock.querySelector("h3");
    const p = infoBlock.querySelector("p");
    h3.setAttribute("data-i18n", `tab_${key}_title`);
    p.setAttribute("data-i18n", `tab_${key}_text`);

    applyTranslations();
  }
}
