// ====== DICCIONARIO GLOBAL A PARTIR DE TEXTO ======
import { normalizeWord, translateWord } from "./translator.js";
import { analyzeAdjective } from "./adjetives/detection.js";
import { translateAdjective } from "./adjetives/lookup.js";

window.GLOBAL_WORD_DICTIONARY = window.GLOBAL_WORD_DICTIONARY || Object.create(null);

/** Tokeniza texto en palabras (Unicode) */
const tokenizeText = (text) => {
  if (!text || typeof text !== "string") return [];
  return text.normalize("NFKC").match(/\p{L}[\p{L}\p{N}'’\-]*|\p{N}+/gu) || [];
};

const NUM_TOKEN = /^\d+(?:[.,]\d+)?$/;

/** Construye/actualiza el diccionario global a partir de un texto */
const buildWordDictionaryFromText = async (text, { includeTranslations = false, sourceLanguage = "de", targetLanguage = "es", reset = false } = {}) => {
  if (reset) window.GLOBAL_WORD_DICTIONARY = Object.create(null);
  const dict = window.GLOBAL_WORD_DICTIONARY;
  const tokens = tokenizeText(text);

  for (const raw of tokens) {
    const normalized = normalizeWord(raw);
    if (!normalized || NUM_TOKEN.test(normalized)) continue;
    if (!dict[normalized]) dict[normalized] = { count: 0, forms: new Set() };
    dict[normalized].count += 1;
    dict[normalized].forms.add(raw);

    // Intentar análisis de adjetivo (alemán)
    try {
      const a = analyzeAdjective(raw);
      if (a?.base && a.confidence >= 0.5) {
        dict[normalized].pos = "adj";
        dict[normalized].lemma = a.base; // p. ej. "schön"
        dict[normalized].degree = a.degree; // "base" | "comp" | "sup" | null
      }
    } catch {}
  }

  if (includeTranslations) {
    const words = Object.keys(dict);
    await Promise.all(
      words.map(async (w) => {
        if (dict[w].translation !== undefined) return;
        try {
          //  Si es adjetivo detectado, intentar primero el lookup morfológico
          if (dict[w].pos === "adj") {
            const t = translateAdjective(w, { lang: targetLanguage });
            if (t?.translation) {
              dict[w].translation = t.translation;
              dict[w].source = "adj-lookup";
              return;
            }
          }
          // Fallback al traductor híbrido genérico
          const r = await translateWord(w, sourceLanguage, targetLanguage);
          dict[w].translation = r?.translation ?? null;
          dict[w].source = r?.source ?? null;
        } catch {
          dict[w].translation = null;
          dict[w].source = null;
        }
      })
    );
  }
  return window.GLOBAL_WORD_DICTIONARY;
};

/** Convierte Sets a arrays (serializable) */
const getSerializableGlobalWordDictionary = () => {
  const dict = window.GLOBAL_WORD_DICTIONARY;
  const out = {};
  for (const k of Object.keys(dict)) {
    const v = dict[k];
    out[k] = {
      count: v.count,
      forms: Array.from(v.forms || []),
      ...(v.translation !== undefined ? { translation: v.translation } : {}),
      ...(v.source !== undefined ? { source: v.source } : {}),
    };
  }
  return out;
};

const resetGlobalWordDictionary = () => {
  window.GLOBAL_WORD_DICTIONARY = Object.create(null);
  return true;
};

// Exponer en window
window.buildWordDictionaryFromText = buildWordDictionaryFromText;
window.getSerializableGlobalWordDictionary = getSerializableGlobalWordDictionary;
window.resetGlobalWordDictionary = resetGlobalWordDictionary;
