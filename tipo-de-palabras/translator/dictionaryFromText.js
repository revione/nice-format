// ====== DICCIONARIO GLOBAL A PARTIR DE TEXTO ======
import { normalizeWord, translateWord } from "./translator.js";

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
  }

  if (includeTranslations) {
    const words = Object.keys(dict);
    await Promise.all(
      words.map(async (w) => {
        if (dict[w].translation !== undefined) return;
        try {
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
