/**
 * lookup.js - SIMPLIFICADO: Sin builders innecesarios
 */

import { ADJECTIVES_IMPORTED, ADJ_GRADABLE } from "./lemmas/index.js";
import { makeAdjectivesFromList } from "./utils/builders.js";
import { analyzeAdjective } from "./detection.js";
import { generateGermanVariants } from "./utils/variants.js";
import { germanWordValidator } from "./utils/validation.js";

/**
 * Mapa de formas directas optimizado
 */
class DirectFormsCache {
  constructor() {
    this.map = null;
  }

  build() {
    if (this.map) return this.map;

    this.map = new Map();

    for (const entry of ADJECTIVES_IMPORTED) {
      if (entry.de) {
        for (const variant of generateGermanVariants(entry.de)) {
          if (!this.map.has(variant)) {
            this.map.set(variant, entry);
          }
        }
      }
    }

    return this.map;
  }

  get(word) {
    const map = this.build();
    return map.get(word) || null;
  }
}

// Cache singleton
const directFormsCache = new DirectFormsCache();

/**
 * Crea resultado de traducción - FUNCIÓN SIMPLE
 */
const createTranslationResult = (deWord, baseDe, form, gradable, translation = null, allTranslations = null) => {
  const result = {
    de: String(deWord || ""),
    baseDe,
    form,
    gradable: Boolean(gradable),
  };

  if (allTranslations) {
    // Caso lang="all" - devolver todas las traducciones
    result.translations = allTranslations;
  } else {
    // Caso normal - devolver traducción específica
    result.translation = translation;
  }

  return result;
};

/**
 * Genera forma inflectida (comp/sup) - SIMPLIFICADO
 */
const generateInflectedForm = (deWord, baseEntry, targetForm) => {
  try {
    const [generated] = makeAdjectivesFromList([
      {
        base: { de: baseEntry.de, es: baseEntry.es },
        gradable: baseEntry.gradable,
      },
    ]);

    const targetTranslation = generated[targetForm];
    if (targetTranslation?.es) {
      return {
        ...baseEntry,
        de: deWord,
        es: targetTranslation.es,
        form: targetForm,
      };
    }
  } catch (error) {
    console.warn(`Error generando ${targetForm} para ${baseEntry.de}:`, error);
  }

  return null;
};

/**
 * Genera traducción desde análisis morfológico - SIMPLIFICADO
 */
const generateTranslationFromAnalysis = (deWord, analysis) => {
  const { base: analyzedBase, degree } = analysis;

  // Buscar entrada base
  for (const baseVariant of generateGermanVariants(analyzedBase)) {
    const baseEntry = directFormsCache.get(baseVariant);

    if (baseEntry && baseEntry.form === "base") {
      const targetForm = degree || "base";

      // Forma base o no gradable
      if (targetForm === "base" || degree === null) {
        return {
          ...baseEntry,
          de: deWord,
          form: "base",
        };
      }

      // Generar comp/sup si es gradable
      if ((targetForm === "comp" || targetForm === "sup") && ADJ_GRADABLE.get(baseEntry.de) !== false) {
        return generateInflectedForm(deWord, baseEntry, targetForm);
      }
    }
  }

  return null;
};

/**
 * Busca entrada: directo primero, análisis después - SIMPLIFICADO
 */
const findEntry = (deWord) => {
  // Validación temprana
  const validation = germanWordValidator.validate(deWord);
  if (!validation.valid) return null;

  const normalizedWord = validation.value;

  // 1. Búsqueda directa optimizada
  for (const variant of generateGermanVariants(normalizedWord)) {
    const direct = directFormsCache.get(variant);
    if (direct) {
      return { ...direct, de: deWord };
    }
  }

  // 2. Análisis morfológico
  const analysis = analyzeAdjective(deWord);
  if (!analysis.base || analysis.confidence < 0.5) {
    return null;
  }

  // 3. Generar desde análisis
  return generateTranslationFromAnalysis(deWord, analysis);
};

/**
 * API principal de traducción - SIMPLIFICADO
 */
export function translateAdjective(deWord, { lang = "es" } = {}) {
  if (!deWord) return null;

  const entry = findEntry(deWord);
  if (!entry) return null;

  // Análisis para determinar base
  const analysis = analyzeAdjective(deWord);
  const baseDe = analysis.base || entry.de;
  const gradable = ADJ_GRADABLE.get(baseDe) ?? entry.gradable ?? true;

  // Todas las traducciones
  if (lang === "all") {
    const translations = Object.fromEntries(Object.entries(entry).filter(([k, v]) => !["de", "form", "gradable"].includes(k) && typeof v === "string"));

    return createTranslationResult(deWord, baseDe, entry.form, gradable, null, translations);
  }

  // Traducción específica
  const translation = entry[lang] || null;
  return createTranslationResult(deWord, baseDe, entry.form, gradable, translation);
}

/**
 * API simple - solo traducción
 */
export const tr = (deWord, lang = "es") => translateAdjective(deWord, { lang })?.translation ?? null;
