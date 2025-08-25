import { state } from "./state.js";

export function toggleDropdown(id) {
  document.querySelectorAll(".dropdown-content").forEach((d) => d.id !== id && d.classList.remove("show"));
  const d = document.getElementById(id);
  d.classList.toggle("show");
  if (d.classList.contains("show") && id === "configDropdown") updateConfigStats();
}

export function toggleLanguage(lang) {
  const option = document.querySelector(`[data-lang="${lang}"]`);
  const checkbox = option.querySelector('input[type="checkbox"]');
  if (state.studyLanguages.includes(lang)) {
    if (state.studyLanguages.length > 1) {
      state.studyLanguages = state.studyLanguages.filter((l) => l !== lang);
      option.classList.remove("selected");
      checkbox.checked = false;
    }
  } else {
    state.studyLanguages.push(lang);
    option.classList.add("selected");
    checkbox.checked = true;
  }
}

export function updateConfigStats() {
  const totalWords = Object.keys(state.words).length;
  const totalContexts = Object.keys(state.contexts).length;
  const practicedWords = Object.values(state.words).filter((w) => (w.totalPracticed || 0) > 0).length;
  const masteredWords = Object.values(state.words).filter((w) => w.mastered).length;

  document.getElementById("configStats").innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin:10px 0; font-size:.9rem;">
      <div class="stat-item"><div class="stat-number">${totalContexts}</div><div class="stat-label">Contextos</div></div>
      <div class="stat-item"><div class="stat-number">${totalWords}</div><div class="stat-label">Palabras</div></div>
      <div class="stat-item"><div class="stat-number">${practicedWords}</div><div class="stat-label">Practicadas</div></div>
      <div class="stat-item"><div class="stat-number" style="color:#10b981;">${masteredWords}</div><div class="stat-label">Dominadas</div></div>
      <div class="stat-item"><div class="stat-number">${totalWords - masteredWords}</div><div class="stat-label">Activas</div></div>
      <div class="stat-item"><div class="stat-number">${totalWords - practicedWords}</div><div class="stat-label">Sin Practicar</div></div>
    </div>`;
}

// cierre de dropdowns al click fuera
export function setupDropdownCloser() {
  document.addEventListener("click", (ev) => {
    if (!ev.target.closest(".dropdown")) {
      document.querySelectorAll(".dropdown-content").forEach((d) => d.classList.remove("show"));
    }
  });
}
