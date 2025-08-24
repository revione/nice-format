// front-js/textDictionary.js
// Construye el diccionario del texto del <textarea id="formatter"> y refresca tooltips

const rebuildFromText = async (text) => {
  const t = text || "";
  await window.buildWordDictionaryFromText(t, {
    reset: true,
    includeTranslations: true, // 👈 importante para que haya traducciones
    sourceLanguage: "de",
    targetLanguage: "es",
  });

  const dict = window.getSerializableGlobalWordDictionary();

  // Prepara una tabla amigable
  const rows = Object.entries(dict)
    // ordena por frecuencia desc
    .sort(([, a], [, b]) => (b.count || 0) - (a.count || 0))
    .map(([word, data]) => ({
      word,
      count: data.count,
      forms: (data.forms || []).join(" · "),
      translation: data.translation ?? null,
      source: data.source ?? null, // "local" | "learned" | "google" | null
    }));
  console.groupCollapsed(`📖 Diccionario (${rows.length} palabras únicas) — traducciones: ${window.TEXT_DICT_INCLUDE_TRANSLATIONS ? "ON" : "OFF"}`);
  console.table(rows);
  console.log("Objeto completo:", dict);
  console.groupEnd();

  // Notifica a quien pinte tooltips que el diccionario ya está listo/actualizado
  document.dispatchEvent(
    new CustomEvent("app:dict-updated", {
      detail: { size: Object.keys(dict).length },
    })
  );
};

const debounce = (fn, ms = 150) => {
  let h;
  return (...args) => {
    clearTimeout(h);
    h = setTimeout(() => fn(...args), ms);
  };
};
const debouncedRebuild = debounce(rebuildFromText, 150);

// 1) Cada vez que el analizador tenga texto listo
document.addEventListener("app:analysis-ready", (e) => {
  debouncedRebuild(e?.detail?.text || "");
});

// 2) Por si el usuario edita directamente el textarea
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("formatter");
  if (!el) return;
  ["input", "keyup", "change", "paste"].forEach((ev) => el.addEventListener(ev, () => debouncedRebuild(el.value)));
  // primera construcción
  debouncedRebuild(el.value || "");
});
