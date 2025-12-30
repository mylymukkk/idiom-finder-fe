let currentLang = localStorage.getItem("lang") || "en";
window.i18nDict = {};

const FLAGS_CONFIG = {
  en: "./assets/icons/icons.svg#usa-flag",
  uk: "./assets/icons/icons.svg#ua-flag",
};

export async function loadLanguage(lang) {
  try {
    const res = await fetch("../src/i18n/lang.json");
    const data = await res.json();
    window.i18nDict = data[lang];

    applyTranslations();
    updateHeaderFlag(lang);
    localStorage.setItem("lang", lang);
    currentLang = lang;
  } catch (err) {
    console.error("Language load error:", err);
  }
}

function updateHeaderFlag(lang) {
  const useElement = document.querySelector("#lang-flag use");
  if (useElement) useElement.setAttribute("href", FLAGS_CONFIG[lang]);
}

export function applyTranslations() {
  const dict = window.i18nDict;
  if (!dict) return;

  document.documentElement.lang = currentLang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = dict[key];
    if (!value) return;

    if (el.tagName === "META") {
      el.setAttribute("content", value);
    } else if (el.tagName === "INPUT") el.placeholder = value;
    else el.textContent = value;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadLanguage(currentLang);
});
