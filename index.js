const sectionFiles = [
  "nav",
  "hero",
  "tech-stack",
  "projects",
  "architecture",
  "experience",
  "contact",
];

async function loadSections() {
  for (const name of sectionFiles) {
    const slot = document.querySelector(`[data-section="${name}"]`);
    const response = await fetch(`sections/${name}.html`);
    if (!response.ok) throw new Error(`Could not load sections/${name}.html`);
    slot.outerHTML = await response.text();
  }
  startHeroTypewriter();
  setupResponsiveNav();
  setupTechFilters();
  setupArchitectureTabs();
}

function setupArchitectureTabs() {
  const tabs = document.querySelectorAll("[data-architecture]");
  const panels = document.querySelectorAll("[data-architecture-panel]");
  if (!tabs.length || !panels.length) return;
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      const active = tab.dataset.architecture;
      tabs.forEach((item) => item.classList.toggle("active", item === tab));
      panels.forEach((panel) => {
        const selected = panel.dataset.architecturePanel === active;
        panel.hidden = !selected;
        panel.style.display = selected ? "block" : "none";
      });
    }),
  );
}

function setupTechFilters() {
  const grid = document.querySelector("#stack .stack-grid");
  if (!grid || document.querySelector(".tech-filters")) return;
  const categories = [
    "All",
    ...Array.from(grid.querySelectorAll("h3")).map((title) =>
      title.textContent.trim(),
    ),
  ];
  const filterBar = document.createElement("div");
  filterBar.className = "tech-filters";
  filterBar.innerHTML = categories
    .map(
      (category, index) =>
        `<button class="tech-filter${index === 0 ? " active-filter" : ""}" data-tech-filter="${category}">${category}</button>`,
    )
    .join("");
  grid.before(filterBar);
  const buttons = filterBar.querySelectorAll("[data-tech-filter]");
  const cards = grid.querySelectorAll("article");
  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      const filter = button.dataset.techFilter;
      buttons.forEach((item) =>
        item.classList.toggle("active-filter", item === button),
      );
      cards.forEach((card) => {
        card.hidden = filter !== "All" && card.dataset.techCategory !== filter;
      });
    }),
  );
  cards.forEach((card) => {
    card.dataset.techCategory = card.querySelector("h3").textContent.trim();
  });
}

function setupResponsiveNav() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("mobile-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "✕" : "☰";
  });
  links.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      links.classList.remove("mobile-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    }),
  );
}

function startHeroTypewriter() {
  const focus = document.getElementById("typed-focus");
  if (!focus) return;
  const items = [
    ["Scalable Microservices"],
    ["High-Throughput APIs"],
    ["Optimized Databases & Caching"],
    ["Node.js & Spring Boot Engineering"],
    ["Enterprise Applications"],
    ["Cloud Deployments & CI/CD"],
  ];
  let item = 0;
  let letter = 0;
  let deleting = false;
  // ensure no prefilled content flashes when the typewriter starts
  focus.textContent = "";
  function tick() {
    const [text] = items[item];
    focus.textContent = text.slice(0, letter);
    if (!deleting) {
      if (letter < text.length) {
        letter++;
      } else {
        // reached full word, pause then start deleting
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
    } else {
      if (letter > 0) {
        letter--;
      } else {
        // finished deleting, move to next item
        deleting = false;
        item = (item + 1) % items.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 70);
  }
  tick();
}

loadSections().catch((error) => {
  document.getElementById("root").innerHTML =
    `<p class="load-error">${error.message}. Open this portfolio through Live Server or a web host.</p>`;
});
