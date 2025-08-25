import { state } from "../state.js";
import { saveData } from "../storage.js";
import { applyFilters } from "../filters.js";
import { renderWordListGrouped } from "./group.js";
import { renderWordListFlat } from "./list.js";

export function updateMainView() {
  state.groupByContext = document.getElementById("groupByContext")?.checked || false;
  updateContextFilter();
  updateWordStats();
  applyFilters();
  state.groupByContext ? renderWordListGrouped() : renderWordListFlat();
  saveData();
}

export function updateContextFilter() {
  const sel = document.getElementById("contextFilter");
  if (!sel) return;
  sel.innerHTML = '<option value="all">Todos los contextos</option>';
  Object.values(state.contexts).forEach((ctx) => {
    const opt = document.createElement("option");
    opt.value = ctx.id;
    opt.textContent = ctx.title;
    sel.appendChild(opt);
  });
}

export function updateWordStats() {
  const stats = {
    total: Object.keys(state.words).length,
    practiced: 0,
    mastered: 0,
    totalSessions: 0,
    active: 0,
    sessionCompleted: 0,
  };
  Object.values(state.words).forEach((w) => {
    stats.totalSessions += w.totalPracticed || 0;
    if (w.totalPracticed > 0) stats.practiced++;
    if (w.mastered) stats.mastered++;
    else stats.active++;
    if (state.sessionCompletedWords.has(w.german)) stats.sessionCompleted++;
  });

  const el = document.getElementById("wordStats");
  el.innerHTML = `
    <div class="stat-item"><div class="stat-number">${stats.total}</div><div class="stat-label">Total</div></div>
    <div class="stat-item"><div class="stat-number" style="color:#00b894;">${stats.practiced}</div><div class="stat-label">Practicadas</div></div>
    <div class="stat-item"><div class="stat-number" style="color:#10b981;">${stats.mastered}</div><div class="stat-label">Dominadas</div></div>
    <div class="stat-item"><div class="stat-number" style="color:#4facfe;">${stats.active}</div><div class="stat-label">Activas</div></div>
    <div class="stat-item"><div class="stat-number">${stats.totalSessions}</div><div class="stat-label">Total Sesiones</div></div>
    ${stats.sessionCompleted > 0 ? `<div class="stat-item"><div class="stat-number" style="color:#f59e0b;">${stats.sessionCompleted}</div><div class="stat-label">Completadas Hoy</div></div>` : ""}
  `;
}

export function updateSelectionCount() {
  const count = state.selectedWords.size;
  const activeCount = [...state.selectedWords].filter((g) => !state.words[g]?.mastered).length;
  const masteredCount = count - activeCount;
  let text = `${count} palabra${count !== 1 ? "s" : ""} seleccionada${count !== 1 ? "s" : ""}`;
  if (masteredCount > 0) text += ` (${activeCount} activas, ${masteredCount} dominadas)`;
  document.getElementById("selectionCount").textContent = text;
}

// ============ FUNCIONES DE INTERACCIÓN ============

export function toggleWordMastery(g) {
  const w = state.words[g];
  if (!w) return;
  w.mastered = !w.mastered;
  w.masteryDate = w.mastered ? new Date().toISOString() : null;
  saveData();

  if (state.groupByContext) {
    updateSingleWordInContext(w);
  } else {
    updateMainView();
  }
}

export function toggleWordSelection(g) {
  state.selectedWords.has(g) ? state.selectedWords.delete(g) : state.selectedWords.add(g);

  const checkbox = document.querySelector(`input[onchange*="${g}"]`);
  if (checkbox) {
    checkbox.checked = state.selectedWords.has(g);
    checkbox.closest(".word-item").classList.toggle("selected", state.selectedWords.has(g));
  }

  updateSelectionCount();
}

export function selectAllWords() {
  state.filteredWords.forEach((w) => {
    if (!w.mastered) state.selectedWords.add(w.german);
  });

  // Importar dinámicamente las funciones de renderizado
  import("./list.js").then(({ renderWordListFlat }) => {
    import("./group.js").then(({ renderWordListGrouped }) => {
      state.groupByContext ? renderWordListGrouped() : renderWordListFlat();
    });
  });
}

export function deselectAllWords() {
  state.selectedWords.clear();

  // Importar dinámicamente las funciones de renderizado
  import("./list.js").then(({ renderWordListFlat }) => {
    import("./group.js").then(({ renderWordListGrouped }) => {
      state.groupByContext ? renderWordListGrouped() : renderWordListFlat();
    });
  });
}

// ============ FUNCIONES DE ACTUALIZACIÓN SELECTIVA ============

export function updateSingleWordInContext(word) {
  const wordElement = document.querySelector(`input[onchange*="${word.german}"]`)?.closest(".word-item");
  if (!wordElement) return;

  wordElement.classList.toggle("mastered", word.mastered);

  const icon = word.mastered ? "🏆" : (word.totalPracticed || 0) > 0 ? "✅" : "⭕";
  const germanElement = wordElement.querySelector(".word-german");
  germanElement.innerHTML = `${icon} ${word.german}`;

  const masteryBtn = wordElement.querySelector(".mastery-btn");
  if (word.mastered) {
    masteryBtn.innerHTML = "↩️ Reactivar";
    masteryBtn.classList.add("unmaster");
    masteryBtn.setAttribute("onclick", `toggleWordMastery('${word.german}')`);
  } else {
    masteryBtn.innerHTML = "🏆 Dominar";
    masteryBtn.classList.remove("unmaster");
    masteryBtn.setAttribute("onclick", `toggleWordMastery('${word.german}')`);
  }

  const statsElement = wordElement.querySelector(".word-stats");
  const lastStudied = word.lastStudied ? new Date(word.lastStudied).toLocaleDateString() : "Nunca";
  const totalPracticed = word.totalPracticed || 0;
  const masteryInfo = word.mastered && word.masteryDate ? `<span>🏆 Dominada el ${new Date(word.masteryDate).toLocaleDateString()}</span>` : "";

  statsElement.innerHTML = `
    <span>📚 ${word.examples.length} ejemplos</span>
    <span>🎯 ${totalPracticed} veces practicada</span>
    <span>📅 ${lastStudied}</span>
    ${masteryInfo}
  `;

  const contextId = word.contextId || "__noctx__";
  const contextWords = state.filteredWords.filter((w) => (w.contextId || "__noctx__") === contextId);
  updateSingleContextMeta(contextId, contextWords);
  updateWordStats();
}

export function updateSingleContextMeta(contextId, wordsInGroup) {
  const contextSection = document.querySelector(`[data-context-id="${contextId}"]`)?.closest(".context-section");
  if (!contextSection) return;

  const meta = contextSection.querySelector(".context-meta");
  const total = wordsInGroup.length;
  const activas = wordsInGroup.filter((w) => !w.mastered).length;
  const dominadas = total - activas;
  const practicadas = wordsInGroup.filter((w) => (w.totalPracticed || 0) > 0).length;

  meta.innerHTML = `
    <span><strong>${total}</strong> palabras</span>
    <span><strong>${activas}</strong> activas</span>
    <span><strong>${dominadas}</strong> dominadas</span>
    <span><strong>${practicadas}</strong> practicadas</span>
  `;
}
