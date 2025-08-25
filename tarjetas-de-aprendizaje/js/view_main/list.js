import { state } from "../state.js";
import { formatDate } from "../utils.js";
import { updateSelectionCount, toggleWordMastery, toggleWordSelection } from "./shared.js";

export function renderWordListFlat() {
  const container = document.getElementById("wordListContainer");
  container.innerHTML = "";

  if (state.filteredWords.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:40px; color:#666;">No se encontraron palabras con los filtros actuales</div>';
    updateSelectionCount();
    return;
  }

  state.filteredWords.forEach((word) => {
    const div = document.createElement("div");
    div.className = "word-item";
    if (state.selectedWords.has(word.german)) div.classList.add("selected");
    if (word.mastered) div.classList.add("mastered");
    if (state.sessionCompletedWords.has(word.german)) div.classList.add("session-completed");

    const icon = word.mastered ? "🏆" : word.totalPracticed > 0 ? "✅" : "⭕";
    const ctxTitle = state.contexts[word.contextId]?.title || "Sin contexto";
    const masteryInfo = word.mastered && word.masteryDate ? `<span>🏆 Dominada el ${formatDate(word.masteryDate)}</span>` : "";

    div.innerHTML = `
      <div class="word-info">
        <div class="word-german">${icon} ${word.german}</div>
        <div class="word-translations">🇪🇸 ${word.spanish} | 🇬🇧 ${word.english}</div>
        ${state.showContextInfo && word.contextText ? `<div class="word-context">📄 ${ctxTitle}</div>` : ""}
        <div class="word-stats">
          <span>📚 ${word.examples.length} ejemplos</span>
          <span>🎯 ${word.totalPracticed || 0} veces practicada</span>
          <span>📅 ${formatDate(word.lastStudied)}</span>
          ${masteryInfo}
        </div>
      </div>
      <div class="word-actions">
        ${
          !word.mastered
            ? `<button class="mastery-btn" data-action="master" data-g="${word.german}">🏆 Dominar</button>`
            : `<button class="mastery-btn unmaster" data-action="master" data-g="${word.german}">↩️ Reactivar</button>`
        }
        <input type="checkbox" class="word-checkbox" ${state.selectedWords.has(word.german) ? "checked" : ""} data-action="select" data-g="${word.german}">
      </div>
    `;
    container.appendChild(div);
  });

  // Delegación de eventos
  container.onclick = (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const g = btn.getAttribute("data-g");
    const action = btn.getAttribute("data-action");
    if (action === "master") toggleWordMastery(g);
    if (action === "select") toggleWordSelection(g);
  };

  updateSelectionCount();
}
