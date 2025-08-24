import { loadApiKey, setApiKey as persistApiKey, clearApiKey as clearStoredApiKey, getApiKeyInfo } from "./apiKey.js";

import { translateWord, findLocalTranslation, normalizeWord, getLearnedStats, exportLearnedTranslations, clearLearnedTranslations } from "./translator.js";

import "./dictionaryFromText.js"; // registra en window las utilidades del diccionario por texto

// Inicialización principal
const initTranslatorApp = () => {
  console.log("🚀 translator init");

  // (Opcional) solo para informar si hay clave almacenada
  const storedKey = loadApiKey();
  if (storedKey) {
    console.log("🌐 Google Translate API: ✅ Clave presente en localStorage");
  } else {
    console.log("🌐 Google Translate API: ❌ No configurada (se usará solo diccionario local/aprendido)");
  }

  // Exponer helpers en window (para consola/UI)
  window.setApiKey = async (key) => {
    const ok = await persistApiKey(key);
    if (ok) console.log("🔐 API key guardada. El traductor la tomará automáticamente de localStorage.");
    return ok;
  };

  window.clearApiKey = () => {
    const ok = clearStoredApiKey();
    if (ok) console.log("🔐 API key eliminada del almacenamiento.");
    return ok;
  };

  window.getApiKeyInfo = getApiKeyInfo;

  // Extras útiles
  window.translateWord = translateWord;
  window.findLocalTranslation = findLocalTranslation;
  window.normalizeWord = normalizeWord;
  window.getLearnedStats = getLearnedStats;
  window.exportLearnedTranslations = exportLearnedTranslations;
  window.clearLearnedTranslations = clearLearnedTranslations;

  console.log("🛠️ Funciones disponibles en consola:");
  console.log("   setApiKey('...'), clearApiKey(), getApiKeyInfo()");
  console.log("   buildWordDictionaryFromText(text, {reset, includeTranslations})");
  console.log("   getSerializableGlobalWordDictionary(), resetGlobalWordDictionary()");
  console.log("   translateWord(w), findLocalTranslation(w), normalizeWord(w)");
  console.log("   getLearnedStats(), exportLearnedTranslations(), clearLearnedTranslations(true)");
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTranslatorApp);
} else {
  initTranslatorApp();
}
