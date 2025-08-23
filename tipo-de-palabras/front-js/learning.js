// === learning.js ===
import { WORD_TYPES } from "../word-types/types.js";

const getTypeStyle = (id) => Object.values(WORD_TYPES).find((t) => t.id === id) || WORD_TYPES.OTHER;

function makeStore() {
  const set = new Set();
  const key = (w, t) => `${w}|${t}`;
  return {
    add: (w, t) => set.add(key(w, t)),
    remove: (w, t) => set.delete(key(w, t)),
    hasKey: (w, t) => set.has(key(w, t)),
    size: () => set.size,
    list: () =>
      Array.from(set)
        .sort()
        .map((k) => {
          const [word, type] = k.split("|");
          return { word, type };
        }),
    raw: () => set,
  };
}

function renderLearningList(container, counter, store) {
  if (!container || !counter) return;
  const entries = store.list();

  if (entries.length === 0) {
    container.parentElement.style.display = "none";
    counter.textContent = "(0 palabras)";
    container.innerHTML = "";
    return;
  }
  container.parentElement.style.display = "block";
  counter.textContent = `(${entries.length} palabras)`;

  container.innerHTML = "";
  for (const { word, type } of entries) {
    const style = getTypeStyle(type);
    const row = document.createElement("div");
    row.className = "learn-word-item";
    row.innerHTML = `
      <span class="word-text"><span title="${style.label}">${style.emoji}</span> ${word}</span>
      <span class="word-count-number" style="background:${style.color}">${style.label}</span>
    `;
    container.appendChild(row);
  }
}

/**
 * Devuelve info de la selección dentro de `container`.
 * - items: [{text, type}] por cada span .word-colored dentro del rango
 * - text: texto unido (para guardar como "frase")
 * - type: "phrase" si hay >1 ítem o tipos mixtos; o el tipo único si solo hay uno
 */
function getSelectionInfo(container) {
  if (!container) return null;
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;

  const range = sel.getRangeAt(0);
  const within = container.contains(range.commonAncestorContainer) || range.commonAncestorContainer === container;
  if (!within) return null;

  const spans = Array.from(container.querySelectorAll(".word-colored"));
  const inRange = spans.filter((node) => {
    try {
      const r = document.createRange();
      r.selectNodeContents(node);
      return range.compareBoundaryPoints(Range.END_TO_START, r) < 0 && range.compareBoundaryPoints(Range.START_TO_END, r) > 0;
    } catch {
      return false;
    }
  });

  if (inRange.length === 0) return null;

  const items = inRange.map((n) => ({
    text: (n.textContent || "").toLowerCase(),
    type: n.dataset.type || "other",
  }));

  const joinedText = items
    .map((i) => i.text)
    .join(" ")
    .trim();
  const types = Array.from(new Set(items.map((i) => i.type)));
  const unifiedType = items.length === 1 ? items[0].type : "phrase"; // ⟵ Fuerza "phrase" si hay varias

  return {
    items,
    text: joinedText,
    type: unifiedType,
  };
}

function clearNativeSelection() {
  const sel = window.getSelection && window.getSelection();
  if (sel && sel.removeAllRanges) sel.removeAllRanges();
}

function initLearning() {
  const content = document.getElementById("colored-content");
  const list = document.getElementById("learn-word-list");
  const count = document.getElementById("learn-count");
  const box = document.getElementById("learn-words");

  const store = makeStore();

  const reapply = () => {
    const set = store.raw();
    const spans = content.querySelectorAll(".word-colored");
    spans.forEach((s) => {
      const word = (s.textContent || "").toLowerCase();
      const type = s.dataset.type || "other";
      s.classList.toggle("word-learning", set.has(`${word}|${type}`));
    });
  };

  document.addEventListener("app:highlight-rendered", reapply);
  const refreshLearningUI = () => renderLearningList(list, count, store);

  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (key !== "d" && key !== "f") return;

    const selInfo = getSelectionInfo(content);

    // ——— Con selección ———
    if (selInfo) {
      e.preventDefault();

      const { items, text, type } = selInfo;

      if (items.length > 1) {
        // Varias palabras: SIEMPRE guardar/quitar como UNA sola "frase"
        if (key === "d") store.add(text, "phrase");
        if (key === "f") store.remove(text, "phrase");
      } else {
        // Solo una palabra seleccionada: actúa sobre esa palabra
        const only = items[0];
        if (key === "d") store.add(only.text, only.type || "other");
        if (key === "f") store.remove(only.text, only.type || "other");
      }

      refreshLearningUI();
      reapply();
      clearNativeSelection();
      return;
    }

    // ——— Sin selección: opera sobre la palabra activa (hover) ———
    const active = content.querySelector(".word-colored.word-active");
    if (!active) return;

    const word = (active.textContent || "").toLowerCase();
    const type = active.dataset.type || "other";

    e.preventDefault();
    if (key === "d") store.add(word, type);
    if (key === "f") store.remove(word, type);

    refreshLearningUI();
    reapply();
    clearNativeSelection();
  });

  box.style.display = "none";
  reapply();
  refreshLearningUI();
}

document.addEventListener("DOMContentLoaded", initLearning);
