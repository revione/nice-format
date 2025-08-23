import { WORD_TYPES } from "../word-types/types.js";

const getTypeStyle = (id) => Object.values(WORD_TYPES).find((t) => t.id === id) || WORD_TYPES.OTHER;

function getActiveFilters() {
  const checks = document.querySelectorAll('.filter-checkboxes input[type="checkbox"]:checked');
  return Array.from(checks).map((cb) => cb.dataset.type);
}

function updateTypeLabels(counts) {
  const totals = Object.values(WORD_TYPES).reduce((acc, t) => ((acc[t.id] = 0), acc), {});
  Object.values(counts).forEach(({ type }) => {
    if (type in totals) totals[type]++;
  });

  Object.keys(totals).forEach((type) => {
    const label = document.getElementById(`label-${type}`);
    if (!label) return;
    const style = getTypeStyle(type);
    label.textContent = `${style.emoji} ${style.label} (${totals[type]})`;
  });

  const active = getActiveFilters();
  const shown = Object.entries(counts).filter(([, d]) => active.includes(d.type)).length;
  const status = document.getElementById("filter-status");
  if (status) status.textContent = `Mostrando: ${shown} palabras únicas (${active.length} tipos seleccionados)`;
}

function renderWordList(counts) {
  const active = getActiveFilters();
  const list = document.getElementById("word-list");
  if (!list) return;

  const entries = Object.entries(counts)
    .filter(([, d]) => active.includes(d.type))
    .sort(([, a], [, b]) => b.count - a.count);

  list.innerHTML = "";
  for (const [word, data] of entries) {
    const style = getTypeStyle(data.type);
    const row = document.createElement("div");
    row.className = "word-item";
    row.innerHTML = `
      <span class="word-text"><span title="${style.label}">${style.emoji}</span> ${word}</span>
      <span class="word-count-number" style="background:${style.color}">${data.count}</span>
    `;
    list.appendChild(row);
  }
}

function broadcastActiveFilters() {
  const activeTypes = getActiveFilters();
  document.dispatchEvent(new CustomEvent("app:filters-changed", { detail: { activeTypes } }));
}

function initFilters() {
  let lastCounts = {};

  document.addEventListener("app:analysis-ready", (e) => {
    lastCounts = e.detail.counts || {};
    updateTypeLabels(lastCounts);
    renderWordList(lastCounts);
    broadcastActiveFilters();
  });

  document.querySelectorAll('.filter-checkboxes input[type="checkbox"]').forEach((cb) => {
    cb.addEventListener("change", () => {
      document.dispatchEvent(new CustomEvent("app:filters-changed", { detail: { activeTypes: getActiveFilters() } }));
    });
  });

  document.addEventListener("app:filters-changed", () => {
    updateTypeLabels(lastCounts);
    renderWordList(lastCounts);
  });
}

document.addEventListener("DOMContentLoaded", initFilters);
