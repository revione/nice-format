import { loadData } from "./storage.js";
import { updateMainView } from "./view_main/shared.js";
import { setupKeyboardShortcuts } from "./keyboard.js";
import { setupDropdownCloser, toggleDropdown, toggleLanguage } from "./config.js";
import { processImport, exportData, clearAllData, importFromFile } from "./import_export.js";
import { generateDetailedStats, validateData } from "./analytics.js";
import { startReview, endReview, revealContent, previousCard, nextCard, markAsPracticed, toggleMastery } from "./view_study.js";

// Arranque
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  updateMainView();
  setupKeyboardShortcuts();
  setupDropdownCloser();

  // (Opcional) debug/telemetría
  validateData();
  console.log("Estadísticas detalladas:", generateDetailedStats());
});

// Exponer handlers al HTML (botones con onclick)
window.toggleDropdown = toggleDropdown;
window.toggleLanguage = toggleLanguage;

window.processImport = processImport;
window.exportData = exportData;
window.clearAllData = clearAllData;

window.startReview = startReview;
window.endReview = endReview;
window.revealContent = revealContent;
window.previousCard = previousCard;
window.nextCard = nextCard;
window.markAsPracticed = markAsPracticed;
window.toggleMastery = toggleMastery;

// Si tienes botones en la lista principal que llaman funciones, expórtalas también
import { selectAllWords, deselectAllWords, toggleWordSelection, toggleWordMastery } from "./view_main/shared.js";
window.selectAllWords = selectAllWords;
window.deselectAllWords = deselectAllWords;
window.toggleWordSelection = toggleWordSelection;
window.toggleWordMastery = toggleWordMastery;

import { applyFilters } from "./filters.js";
window.applyFilters = applyFilters;
window.updateMainView = updateMainView;
window.importFromFile = importFromFile;
