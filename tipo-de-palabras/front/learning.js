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
  if (inRange.length === 1) {
    const s = inRange[0];
    return { text: s.textContent.toLowerCase(), type: s.dataset.type || "phrase" };
  }
  const text = inRange
    .map((n) => n.textContent)
    .join(" ")
    .toLowerCase();
  const types = Array.from(new Set(inRange.map((n) => n.dataset.type).filter(Boolean)));
  return { text, type: types.length === 1 ? types[0] : "phrase" };
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

    const sel = getSelectionInfo(content);
    if (sel) {
      e.preventDefault();
      if (key === "d") store.add(sel.text, sel.type);
      if (key === "f") store.remove(sel.text, sel.type);
      refreshLearningUI();
      reapply();
      return;
    }

    const active = content.querySelector(".word-colored.word-active");
    if (!active) return;
    const word = (active.textContent || "").toLowerCase();
    const type = active.dataset.type || "other";

    e.preventDefault();
    if (key === "d") store.add(word, type);
    if (key === "f") store.remove(word, type);
    refreshLearningUI();
    reapply();
  });

  box.style.display = "none";
  reapply();
  refreshLearningUI();
}

document.addEventListener("DOMContentLoaded", initLearning);
