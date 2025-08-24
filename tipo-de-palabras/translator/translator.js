import { LOCAL_DICTIONARY } from "./localDictionary.js";
import { loadApiKey } from "./apiKey.js";

const TRANSLATION_CACHE = new Map();
const TRANSLATION_QUEUE = new Map();
const STORAGE_KEY = "german_translations_learned";

// ===== SISTEMA DE APRENDIZAJE AUTOMÁTICO =====

/**
 * Carga las traducciones aprendidas desde localStorage
 */
export const loadLearnedTranslations = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const learned = JSON.parse(stored);
      console.log(`📖 Cargadas ${Object.keys(learned).length} traducciones aprendidas desde localStorage`);
      return learned;
    }
  } catch (error) {
    console.error("Error cargando traducciones aprendidas:", error);
  }
  return {};
};

/**
 * Guarda una nueva traducción aprendida en localStorage
 */
export const saveLearnedTranslation = (word, translation, source = "google") => {
  try {
    const learned = loadLearnedTranslations();
    const normalized = normalizeWord(word);

    learned[normalized] = {
      translation,
      source,
      dateAdded: new Date().toISOString(),
      timesUsed: (learned[normalized]?.timesUsed || 0) + 1,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(learned, null, 2));
    console.log(`💾 Guardada traducción: ${word} → ${translation} (${source})`);
    return true;
  } catch (error) {
    console.error("Error guardando traducción aprendida:", error);
    return false;
  }
};

/**
 * Busca en traducciones aprendidas
 */
export const findLearnedTranslation = (word) => {
  const learned = loadLearnedTranslations();
  const normalized = normalizeWord(word);

  if (learned[normalized]) {
    learned[normalized].timesUsed++;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(learned, null, 2));

    return {
      translation: learned[normalized].translation,
      source: "learned",
      metadata: learned[normalized],
    };
  }

  return null;
};

/**
 * Obtiene estadísticas de traducciones aprendidas
 */
export const getLearnedStats = () => {
  const learned = loadLearnedTranslations();
  const entries = Object.entries(learned);

  return {
    total: entries.length,
    bySource: entries.reduce((acc, [word, data]) => {
      acc[data.source] = (acc[data.source] || 0) + 1;
      return acc;
    }, {}),
    mostUsed: entries
      .sort(([, a], [, b]) => (b.timesUsed || 0) - (a.timesUsed || 0))
      .slice(0, 10)
      .map(([word, data]) => ({ word, uses: data.timesUsed, translation: data.translation })),
    oldestEntries: entries
      .sort(([, a], [, b]) => new Date(a.dateAdded) - new Date(b.dateAdded))
      .slice(0, 10)
      .map(([word, data]) => ({ word, date: data.dateAdded, translation: data.translation })),
  };
};

/**
 * Exporta todas las traducciones aprendidas en formato código
 */
export const exportLearnedTranslations = () => {
  const learned = loadLearnedTranslations();
  const sorted = Object.keys(learned).sort();

  let output = "// Traducciones aprendidas automáticamente:\n";
  output += "// Generado el: " + new Date().toLocaleString() + "\n\n";

  for (const word of sorted) {
    const data = learned[word];
    output += `"${word}": "${data.translation}", // ${data.source} - usado ${data.timesUsed} veces\n`;
  }

  return output;
};

/**
 * Limpia traducciones aprendidas (con confirmación)
 */
export const clearLearnedTranslations = (confirm = false) => {
  if (!confirm) {
    console.log("⚠️  Para limpiar las traducciones aprendidas, usa: clearLearnedTranslations(true)");
    return false;
  }

  try {
    const count = Object.keys(loadLearnedTranslations()).length;
    localStorage.removeItem(STORAGE_KEY);
    console.log(`🗑️  Se eliminaron ${count} traducciones aprendidas`);
    return true;
  } catch (error) {
    console.error("Error limpiando traducciones:", error);
    return false;
  }
};

// Normalización simple: solo lowercase y trim para preservar caracteres alemanes
export const normalizeWord = (word) => {
  return word.toLowerCase().trim();
};

// MEJORADA: Búsqueda más precisa y ordenada por prioridad
export const findLocalTranslation = (word) => {
  const normalized = normalizeWord(word);

  // PASO 1: Buscar en traducciones aprendidas (máxima prioridad)
  const learned = findLearnedTranslation(word);
  if (learned) {
    return {
      translation: learned.translation,
      source: "learned",
      metadata: learned.metadata,
    };
  }

  // PASO 2: Búsqueda exacta en diccionario base
  if (LOCAL_DICTIONARY[normalized]) {
    return {
      translation: LOCAL_DICTIONARY[normalized],
      source: "local",
    };
  }

  // PASO 3: Búsqueda sin artículos comunes (solo si son > 3 caracteres)
  if (normalized.length > 3) {
    const withoutArticles = normalized.replace(/^(der|die|das|den|dem|des|ein|eine|einen|einem|einer)\s+/, "");
    if (withoutArticles !== normalized && withoutArticles.length > 2) {
      if (LOCAL_DICTIONARY[withoutArticles]) {
        return {
          translation: LOCAL_DICTIONARY[withoutArticles],
          source: "local",
        };
      }
    }
  }

  // PASO 4: Búsqueda sin terminaciones comunes (solo palabras > 4 caracteres)
  if (normalized.length > 4) {
    const endings = ["en", "er", "es", "te", "st", "et"];
    for (const ending of endings) {
      if (normalized.endsWith(ending)) {
        const withoutEnding = normalized.slice(0, -ending.length);
        if (withoutEnding.length > 2 && LOCAL_DICTIONARY[withoutEnding]) {
          return {
            translation: LOCAL_DICTIONARY[withoutEnding],
            source: "local",
          };
        }
      }
    }
  }

  // PASO 5: ELIMINADO - La búsqueda por substring causaba traducciones incorrectas

  return null;
};

/**
 * Traduce una palabra usando diccionario local primero, luego Google API
 * @param {string} word - Palabra a traducir
 * @param {string} sourceLanguage - Idioma origen (por defecto 'de' para alemán)
 * @param {string} targetLanguage - Idioma destino (por defecto 'es' para español)
 * @returns {Promise<{translation: string, source: 'local'|'google'|null}>}
 */
export const translateWord = async (word, sourceLanguage = "de", targetLanguage = "es") => {
  const cacheKey = `${word.toLowerCase()}|${sourceLanguage}|${targetLanguage}`;

  // Verificar cache
  if (TRANSLATION_CACHE.has(cacheKey)) return TRANSLATION_CACHE.get(cacheKey);

  // Verificar si ya está en proceso
  if (TRANSLATION_QUEUE.has(cacheKey)) return await TRANSLATION_QUEUE.get(cacheKey);

  // Crear nueva traducción
  const translationPromise = performHybridTranslation(word, sourceLanguage, targetLanguage);
  TRANSLATION_QUEUE.set(cacheKey, translationPromise);

  try {
    const result = await translationPromise;
    TRANSLATION_CACHE.set(cacheKey, result);
    TRANSLATION_QUEUE.delete(cacheKey);
    return result;
  } catch (error) {
    console.error(`Error traduciendo "${word}":`, error);
    TRANSLATION_QUEUE.delete(cacheKey);
    return { translation: null, source: null };
  }
};

export const performHybridTranslation = async (word, sourceLanguage, targetLanguage) => {
  // PASO 1: Buscar en diccionarios locales (base + aprendido)
  const localResult = findLocalTranslation(word);
  if (localResult) {
    const sourceIcon = localResult.source === "learned" ? "📖" : "📚";
    // console.log(`${sourceIcon} Traducción ${localResult.source}: ${word} → ${localResult.translation}`);
    return localResult;
  }

  // PASO 2: Si no está en local, intentar Google Translate
  const apiKey = loadApiKey();
  if (!apiKey) {
    console.log(`⚠️ "${word}" no encontrada en diccionario local y no hay API key configurada`);
    return { translation: null, source: null };
  }

  console.log(`🌐 Buscando en Google Translate: ${word}`);

  try {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: word,
        target: targetLanguage,
        source: sourceLanguage,
        format: "text",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.data?.translations?.length > 0) {
      const googleTranslation = data.data.translations[0].translatedText;
      saveLearnedTranslation(word, googleTranslation, "google");
      console.log(`🔍 Traducción Google: ${word} → ${googleTranslation}`);
      return { translation: googleTranslation, source: "google" };
    }

    return { translation: null, source: null };
  } catch (error) {
    console.error(`❌ Error con Google Translate para "${word}":`, error.message);
    return { translation: null, source: null };
  }
};
