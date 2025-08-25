import { state } from "../state.js";
import { updateSelectionCount, updateSingleContextMeta } from "./shared.js";

export function renderWordListGrouped() {
  const container = document.getElementById("wordListContainer");
  container.innerHTML = "";

  if (state.filteredWords.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:40px; color:#666;">No se encontraron palabras con los filtros actuales</div>';
    updateSelectionCount();
    return;
  }

  const groups = {};
  state.filteredWords.forEach((w) => {
    const cid = w.contextId || "__noctx__";
    if (!groups[cid]) groups[cid] = [];
    groups[cid].push(w);
  });

  const getContextTitle = (cid) => (cid === "__noctx__" ? "Sin contexto" : state.contexts[cid]?.title || "Sin contexto");
  const getContextText = (cid) => (cid === "__noctx__" ? "" : state.contexts[cid]?.text || "");

  Object.keys(groups)
    .sort((a, b) => getContextTitle(a).localeCompare(getContextTitle(b)))
    .forEach((cid) => {
      const wordsInGroup = groups[cid];

      const section = document.createElement("div");
      section.className = "context-section";

      const header = document.createElement("div");
      header.className = "context-header";

      const title = document.createElement("div");
      title.className = "context-title";
      title.setAttribute("data-context-id", cid);
      const contextTitle = getContextTitle(cid);
      const contextText = getContextText(cid);
      const displayText = contextText || contextTitle;
      title.innerHTML = `📄 ${displayText}`;

      const metaActions = document.createElement("div");
      metaActions.className = "context-meta-actions";

      const meta = document.createElement("div");
      meta.className = "context-meta";
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

      const actions = document.createElement("div");
      actions.className = "context-actions";

      const btnSelectAll = document.createElement("button");
      btnSelectAll.className = "btn btn-small btn-secondary";
      btnSelectAll.innerHTML = "✅ Sel. Todo";
      btnSelectAll.onclick = (e) => {
        e.stopPropagation();
        selectAllWordsInContext(cid, wordsInGroup);
      };

      const btnDeselect = document.createElement("button");
      btnDeselect.className = "btn btn-small btn-secondary";
      btnDeselect.innerHTML = "❌ Desel.";
      btnDeselect.onclick = (e) => {
        e.stopPropagation();
        deselectAllWordsInContext(cid, wordsInGroup);
      };

      actions.appendChild(btnSelectAll);
      actions.appendChild(btnDeselect);
      metaActions.appendChild(meta);
      metaActions.appendChild(actions);

      const body = document.createElement("div");
      body.className = "context-body";
      body.style.display = "none";
      header.classList.add("collapsed");

      header.onclick = (e) => {
        if (!e.target.closest("button") && !e.target.closest(".expand-arrow")) {
          toggleContextBody(header, body);
        }
      };

      header.appendChild(title);
      header.appendChild(metaActions);

      // Renderizar palabras
      if (wordsInGroup.length === 0) {
        body.innerHTML = `<div class="context-empty">No hay palabras en este contexto.</div>`;
      } else {
        wordsInGroup.forEach((word) => {
          const wordDiv = document.createElement("div");
          wordDiv.className = "word-item";

          if (state.selectedWords.has(word.german)) wordDiv.classList.add("selected");
          if (word.mastered) wordDiv.classList.add("mastered");
          if (state.sessionCompletedWords.has(word.german)) wordDiv.classList.add("session-completed");

          const icon = word.mastered ? "🏆" : (word.totalPracticed || 0) > 0 ? "✅" : "⭕";
          const lastStudied = word.lastStudied ? new Date(word.lastStudied).toLocaleDateString() : "Nunca";
          const totalPracticed = word.totalPracticed || 0;
          const masteryInfo = word.mastered && word.masteryDate ? `<span>🏆 Dominada el ${new Date(word.masteryDate).toLocaleDateString()}</span>` : "";

          wordDiv.innerHTML = `
            <div class="word-info">
              <div class="word-german">${icon} ${word.german}</div>
              <div class="word-translations">🇪🇸 ${word.spanish} | 🇬🇧 ${word.english}</div>
              <div class="word-stats">
                <span>📚 ${word.examples.length} ejemplos</span>
                <span>🎯 ${totalPracticed} veces practicada</span>
                <span>📅 ${lastStudied}</span>
                ${masteryInfo}
              </div>
            </div>
            <div class="word-actions">
              ${
                !word.mastered
                  ? `<button class="mastery-btn" onclick="toggleWordMastery('${word.german}')">🏆 Dominar</button>`
                  : `<button class="mastery-btn unmaster" onclick="toggleWordMastery('${word.german}')">↩️ Reactivar</button>`
              }
              <input type="checkbox" class="word-checkbox"
                ${state.selectedWords.has(word.german) ? "checked" : ""}
                onchange="toggleWordSelection('${word.german}')">
            </div>
          `;

          body.appendChild(wordDiv);
        });
      }

      section.appendChild(header);
      section.appendChild(body);
      container.appendChild(section);

      setTimeout(() => {
        checkIfTitleNeedsExpansion(title);
      }, 0);
    });

  updateSelectionCount();
}

function selectAllWordsInContext(contextId, wordsInGroup) {
  wordsInGroup.forEach((w) => {
    if (!w.mastered) state.selectedWords.add(w.german);
  });
  updateSingleContextWords(contextId, wordsInGroup);
  updateSelectionCount();
}

function deselectAllWordsInContext(contextId, wordsInGroup) {
  wordsInGroup.forEach((w) => state.selectedWords.delete(w.german));
  updateSingleContextWords(contextId, wordsInGroup);
  updateSelectionCount();
}

function updateSingleContextWords(contextId, wordsInGroup) {
  const contextSection = document.querySelector(`[data-context-id="${contextId}"]`)?.closest(".context-section");
  if (!contextSection) return;

  // Actualizar meta información
  updateSingleContextMeta(contextId, wordsInGroup);

  // Actualizar solo las palabras de este contexto
  const body = contextSection.querySelector(".context-body");
  const wasHidden = body.style.display === "none";

  // Re-renderizar solo las palabras
  body.innerHTML = "";
  wordsInGroup.forEach((word) => {
    const wordDiv = document.createElement("div");
    wordDiv.className = "word-item";

    if (state.selectedWords.has(word.german)) wordDiv.classList.add("selected");
    if (word.mastered) wordDiv.classList.add("mastered");
    if (state.sessionCompletedWords.has(word.german)) wordDiv.classList.add("session-completed");

    const icon = word.mastered ? "🏆" : (word.totalPracticed || 0) > 0 ? "✅" : "⭕";
    const lastStudied = word.lastStudied ? new Date(word.lastStudied).toLocaleDateString() : "Nunca";
    const totalPracticed = word.totalPracticed || 0;
    const masteryInfo = word.mastered && word.masteryDate ? `<span>🏆 Dominada el ${new Date(word.masteryDate).toLocaleDateString()}</span>` : "";

    wordDiv.innerHTML = `
      <div class="word-info">
        <div class="word-german">${icon} ${word.german}</div>
        <div class="word-translations">🇪🇸 ${word.spanish} | 🇬🇧 ${word.english}</div>
        <div class="word-stats">
          <span>📚 ${word.examples.length} ejemplos</span>
          <span>🎯 ${totalPracticed} veces practicada</span>
          <span>📅 ${lastStudied}</span>
          ${masteryInfo}
        </div>
      </div>
      <div class="word-actions">
        ${
          !word.mastered
            ? `<button class="mastery-btn" onclick="toggleWordMastery('${word.german}')">🏆 Dominar</button>`
            : `<button class="mastery-btn unmaster" onclick="toggleWordMastery('${word.german}')">↩️ Reactivar</button>`
        }
        <input type="checkbox" class="word-checkbox"
          ${state.selectedWords.has(word.german) ? "checked" : ""}
          onchange="toggleWordSelection('${word.german}')">
      </div>
    `;

    body.appendChild(wordDiv);
  });

  if (wasHidden) {
    body.style.display = "none";
  }
}

function toggleContextBody(header, body) {
  const isHidden = body.style.display === "none" || header.classList.contains("collapsed");

  if (isHidden) {
    body.style.display = "block";
    header.classList.remove("collapsed");
  } else {
    body.style.display = "none";
    header.classList.add("collapsed");
  }
}

function checkIfTitleNeedsExpansion(titleElement) {
  const tempElement = document.createElement("div");
  tempElement.style.cssText = `
    position: absolute;
    visibility: hidden;
    width: ${titleElement.offsetWidth}px;
    font-family: ${getComputedStyle(titleElement).fontFamily};
    font-size: ${getComputedStyle(titleElement).fontSize};
    font-weight: ${getComputedStyle(titleElement).fontWeight};
    line-height: ${getComputedStyle(titleElement).lineHeight};
    padding: ${getComputedStyle(titleElement).padding};
  `;
  tempElement.innerHTML = titleElement.innerHTML;
  document.body.appendChild(tempElement);

  const fullHeight = tempElement.scrollHeight;
  const constrainedHeight = parseFloat(getComputedStyle(titleElement).maxHeight);

  document.body.removeChild(tempElement);

  if (fullHeight > constrainedHeight) {
    titleElement.classList.add("expandable");

    titleElement.addEventListener("click", (e) => {
      const rect = titleElement.getBoundingClientRect();
      const clickX = e.clientX - rect.left;

      if (clickX <= 30) {
        e.stopPropagation();
        titleElement.classList.toggle("expanded");
      }
    });

    titleElement.addEventListener("mousemove", (e) => {
      const rect = titleElement.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;

      if (mouseX <= 30) {
        titleElement.style.cursor = "pointer";
      } else {
        titleElement.style.cursor = "default";
      }
    });
  }
}
