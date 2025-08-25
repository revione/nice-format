import { state } from "./state.js";
import { saveData } from "./storage.js";
import { generateContextId, showMessage } from "./utils.js";
import { updateMainView } from "./view_main/shared.js";

export function parseStructuredData(dataStr) {
  let jsonStr = dataStr.trim();
  if (!jsonStr.startsWith("{")) throw new Error("Los datos deben comenzar con un objeto con contextText y contextWords");
  const parsed = JSON.parse(jsonStr);
  if (!parsed.contextText || !parsed.contextWords) throw new Error("Falta contextText o contextWords");
  return parsed;
}

export function processImport() {
  const input = document.getElementById("dataInput").value.trim();
  if (!input) return showMessage("importMessage", "No hay datos para procesar.", "error");

  try {
    const data = parseStructuredData(input);
    const contextId = generateContextId();
    const contextTitle = data.contextText.substring(0, 50) + "...";

    state.contexts[contextId] = {
      id: contextId,
      title: contextTitle,
      text: data.contextText,
      dateCreated: new Date().toISOString(),
      wordCount: data.contextWords.length,
    };

    let imported = 0;
    data.contextWords.forEach((item) => {
      if (item.toLearn?.de) {
        const g = item.toLearn.de;
        state.words[g] = {
          german: g,
          spanish: item.toLearn.es || "",
          english: item.toLearn.en || "",
          examples: item.examples || [],
          contextId,
          contextText: data.contextText,
          dateCreated: new Date().toISOString(),
          totalPracticed: 0,
          lastStudied: null,
          mastered: false,
          masteryDate: null,
          sessionCompleted: false,
        };
        imported++;
      }
    });

    saveData();
    updateMainView();
    showMessage("importMessage", `¡${imported} palabras importadas en "${contextTitle}"!`, "success");
  } catch (e) {
    showMessage("importMessage", `Error: ${e.message}`, "error");
  }
}

export function exportData() {
  const keys = Object.keys(state.words);
  if (keys.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }
  const payload = {
    words: state.words,
    contexts: state.contexts,
    version: "2.0",
    exportDate: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "vocabulario_alemán_avanzado_" + new Date().toISOString().split("T")[0] + ".json";
  link.click();
}

export function clearAllData() {
  if (!confirm("¿Seguro que quieres borrar todos los datos?")) return;
  state.words = {};
  state.contexts = {};
  state.selectedWords.clear();
  state.sessionCompletedWords.clear();
  saveData();
  updateMainView();
  alert("Todos los datos han sido eliminados.");
  document.getElementById("configDropdown")?.classList.remove("show");
}

export function importFromFile() {
  const file = document.getElementById("importFile")?.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);

      // Mezcla no destructiva
      if (imported.words && typeof imported.words === "object") {
        Object.assign(state.words, imported.words);
      }
      if (imported.contexts && typeof imported.contexts === "object") {
        Object.assign(state.contexts, imported.contexts);
      }

      // Normaliza mínimos por si vienen de exportes viejos
      Object.values(state.words).forEach((w) => {
        if (w.mastered === undefined) w.mastered = false;
        if (w.masteryDate === undefined) w.masteryDate = null;
        if (w.sessionCompleted === undefined) w.sessionCompleted = false;
        if (w.totalPracticed === undefined) w.totalPracticed = 0;
        if (w.lastStudied === undefined) w.lastStudied = null;
      });

      saveData();
      updateMainView();
      showMessage("importMessage", "Datos importados correctamente desde archivo.", "success");

      // cierre suave del dropdown
      setTimeout(() => {
        const dd = document.getElementById("configDropdown");
        if (dd) dd.classList.remove("show");
        const msg = document.getElementById("importMessage");
        if (msg) msg.innerHTML = "";
      }, 1200);
    } catch (err) {
      showMessage("importMessage", "Error al importar el archivo.", "error");
    }
  };
  reader.readAsText(file);
}
