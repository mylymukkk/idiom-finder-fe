import { applyTranslations } from "../language.js";

const fileMap = {
  ukr: "../src/data/ukr_idioms.json",
  eng: "../src/data/eng_idioms.json",
};

const idiomCache = { ukr: null, eng: null };

document.addEventListener("page-loaded", () => {
  if (window.currentPage === "view-all") {
    initViewLogic();
    preloadDefaultDataset();
  }
});

async function loadDatasetOnce(ds) {
  if (idiomCache[ds]) return idiomCache[ds];
  try {
    const res = await fetch(fileMap[ds]);
    idiomCache[ds] = await res.json();
    return idiomCache[ds];
  } catch (err) {
    console.error(`Failed to load ${ds}:`, err);
    return {};
  }
}

function initViewLogic() {
  const container = document.getElementById("idioms-container");
  const ukrCheckbox = document.getElementById("view-dataset-ukr");
  const engCheckbox = document.getElementById("view-dataset-eng");

  if (!container) return;

  container.addEventListener("click", (e) => {
    const target = e.target;

    // Toggle прикладів
    if (target.hasAttribute("data-example")) {
      const parent = target.closest("li") || target.closest(".idiom-card");
      parent?.querySelector(".example-block")?.classList.toggle("hidden");
    }

    // Toggle повної ідіоми
    if (target.classList.contains("show-full-idiom")) {
      const fullBlock = target
        .closest(".idiom-card")
        ?.querySelector(".full-idiom");
      if (fullBlock) {
        fullBlock.textContent = target.dataset.fullIdiom;
        fullBlock.classList.toggle("hidden");
      }
    }
  });

  [ukrCheckbox, engCheckbox].forEach((el) =>
    el?.addEventListener("change", loadIdioms)
  );
}

function preloadDefaultDataset() {
  const ukr = document.getElementById("view-dataset-ukr");
  if (ukr) {
    ukr.checked = true;
    loadIdioms();
  }
}

async function loadIdioms() {
  const selectedKeys = [];
  if (document.getElementById("view-dataset-ukr")?.checked)
    selectedKeys.push("ukr");
  if (document.getElementById("view-dataset-eng")?.checked)
    selectedKeys.push("eng");

  let combined = [];

  for (const key of selectedKeys) {
    const data = await loadDatasetOnce(key);
    const items = Object.values(data);
    combined = combined.concat(items);
  }

  renderIdioms(combined);
}

function renderMeaning(m, index = null) {
  return `
    <div>
      <p class="mb-2 text-body">
        ${index !== null ? `<span class="text-body">${index + 1}. </span>` : ""}
        ${
          m.used_with_words?.length
            ? `<span class="text-body text-xs mr-1 italic ">(<span data-i18n="with_words_label"></span> ${m.used_with_words.join(
                ", "
              )})</span>`
            : ""
        }
        ${m.meaning}
      </p>

      <p class="cursor-pointer font-medium text-sm text-fg-brand hover:underline"
         data-example
         data-i18n="example_label"></p>

      <blockquote class="example-block hidden p-4 mt-3 border-s-4 border-default bg-neutral-secondary-soft">
        <p class="text-sm italic text-heading">
          ${m.example}
          <span class="text-body text-xs">${m.author || ""}</span>
        </p>
      </blockquote>
    </div>
  `;
}

function renderIdioms(list) {
  const container = document.getElementById("idioms-container");
  const countLabel = document.getElementById("view-count");

  if (!container || !countLabel) return;

  countLabel.innerHTML = `<span data-i18n="found_label"></span>${list.length}`;

  container.innerHTML = list
    .map(
      (idiom) => `
    <div class="idiom-card relative bg-neutral-primary-soft block p-6 border border-default rounded-base shadow-xs">
      <h5 class="mb-3 text-2xl font-semibold tracking-tight text-heading">
        ${idiom.idiom_shorten}
        ${
          idiom.idiom !== idiom.idiom_shorten
            ? `
          <span class="show-full-idiom text-fg-brand text-xs leading-none cursor-pointer select-none px-1.5 py-4"
                data-full-idiom="${idiom.idiom}">+</span>
        `
            : ""
        }
      </h5>
      <p class="hidden full-idiom text-sm text-body mb-3 italic"></p>

      ${
        idiom.meanings.length === 1
          ? renderMeaning(idiom.meanings[0], null, idiom._lang)
          : `<ul class="flex flex-col gap-4">
            ${idiom.meanings
              .map((m, i) => `<li>${renderMeaning(m, i, idiom._lang)}</li>`)
              .join("")}
          </ul>`
      }
    </div>
  `
    )
    .join("");

  applyTranslations();
}
