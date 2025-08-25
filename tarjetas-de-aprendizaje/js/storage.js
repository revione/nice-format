import { state, VERSION } from "./state.js";

const KEY = "germanVocabularyAdvanced";

export function loadData() {
  try {
    const saved = localStorage.getItem(KEY);
    console.log({ saved: JSON.parse(saved) });
    if (!saved) return;
    const parsed = JSON.parse(saved);

    state.words = parsed.words || {};
    state.contexts = parsed.contexts || {};
    state.studyLanguages = parsed.studyLanguages || ["es", "en"];
    state.selectedWords = new Set(parsed.selectedWords || []);
    state.sessionCompletedWords = new Set(parsed.sessionCompletedWords || []);
    state.groupByContext = parsed.groupByContext ?? true;
    state.showContextInfo = parsed.showContextInfo ?? false;

    document.getElementById("groupByContext").checked = parsed.groupByContext;

    migrateOldData();
  } catch {
    state.words = {};
    state.contexts = {};
  }
}

export function saveData() {
  try {
    const payload = {
      words: state.words,
      contexts: state.contexts,
      studyLanguages: state.studyLanguages,
      selectedWords: [...state.selectedWords],
      sessionCompletedWords: [...state.sessionCompletedWords],
      groupByContext: state.groupByContext,
      showContextInfo: state.showContextInfo,
      version: VERSION,
    };
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    console.error("Error guardando en localStorage");
  }
}

function migrateOldData() {
  let changed = false;
  Object.values(state.words).forEach((w) => {
    if (w.mastered === undefined) {
      w.mastered = false;
      changed = true;
    }
    if (w.masteryDate === undefined) {
      w.masteryDate = null;
      changed = true;
    }
    if (w.sessionCompleted === undefined) {
      w.sessionCompleted = false;
      changed = true;
    }
    if (w.totalPracticed === undefined) {
      w.totalPracticed = 0;
      changed = true;
    }
    if (w.lastStudied === undefined) {
      w.lastStudied = null;
      changed = true;
    }
  });
  if (changed) saveData();
}
